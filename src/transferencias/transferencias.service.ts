import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transferencia } from '../entities/transferencia.entity';
import { TransferenciaDetalle } from '../entities/transferencia-detalle.entity';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';

@Injectable()
export class TransferenciasService {
  constructor(
    @InjectRepository(Transferencia)
    private transferenciaRepository: Repository<Transferencia>,
    @InjectRepository(TransferenciaDetalle)
    private transferenciaDetalleRepository: Repository<TransferenciaDetalle>,
    private dataSource: DataSource,
  ) {}

  async create(createTransferenciaDto: CreateTransferenciaDto): Promise<Transferencia> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generar número de transferencia único
      const numeroTransferencia = await this.generarNumeroTransferencia();
      
      const transferencia = this.transferenciaRepository.create({
        ...createTransferenciaDto,
        numeroTransferencia,
        fechaSolicitud: new Date(),
        estado: 'pendiente',
      });

      const savedTransferencia = await queryRunner.manager.save(transferencia);

      // Crear detalles
      const detalles = createTransferenciaDto.detalles.map(detalle => {
        return this.transferenciaDetalleRepository.create({
          ...detalle,
          transferencia: savedTransferencia,
          costoTotal: detalle.cantidadSolicitada * detalle.costoUnitario,
        });
      });

      await queryRunner.manager.save(detalles);

      // Actualizar totales
      savedTransferencia.totalItems = detalles.reduce((sum, d) => sum + d.cantidadSolicitada, 0);
      savedTransferencia.costoTotal = detalles.reduce((sum, d) => sum + d.costoTotal, 0);
      
      await queryRunner.manager.save(savedTransferencia);
      await queryRunner.commitTransaction();

      return this.findOne(savedTransferencia.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page = 1, limit = 10, estado?: string, bodegaOrigenId?: number, bodegaDestinoId?: number) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.transferenciaRepository
      .createQueryBuilder('transferencia')
      .leftJoinAndSelect('transferencia.bodegaOrigen', 'bodegaOrigen')
      .leftJoinAndSelect('transferencia.bodegaDestino', 'bodegaDestino')
      .leftJoinAndSelect('transferencia.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto');

    if (estado) {
      queryBuilder.where('transferencia.estado = :estado', { estado });
    }

    if (bodegaOrigenId) {
      queryBuilder.andWhere('transferencia.bodegaOrigen.id = :bodegaOrigenId', { bodegaOrigenId });
    }

    if (bodegaDestinoId) {
      queryBuilder.andWhere('transferencia.bodegaDestino.id = :bodegaDestinoId', { bodegaDestinoId });
    }

    const [transferencias, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('transferencia.fechaSolicitud', 'DESC')
      .getManyAndCount();

    return {
      data: transferencias,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPendientes(): Promise<Transferencia[]> {
    return this.transferenciaRepository.find({
      where: { estado: 'pendiente' },
      relations: ['bodegaOrigen', 'bodegaDestino', 'detalles', 'detalles.producto'],
      order: { fechaSolicitud: 'ASC' },
    });
  }

  async findEnTransito(): Promise<Transferencia[]> {
    return this.transferenciaRepository.find({
      where: { estado: 'en_transito' },
      relations: ['bodegaOrigen', 'bodegaDestino', 'detalles', 'detalles.producto'],
      order: { fechaEnvio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Transferencia> {
    const transferencia = await this.transferenciaRepository.findOne({
      where: { id },
      relations: ['bodegaOrigen', 'bodegaDestino', 'detalles', 'detalles.producto', 'detalles.lote'],
    });

    if (!transferencia) {
      throw new NotFoundException(`Transferencia con ID ${id} no encontrada`);
    }

    return transferencia;
  }

  async findByNumero(numero: string): Promise<Transferencia> {
    const transferencia = await this.transferenciaRepository.findOne({
      where: { numeroTransferencia: numero },
      relations: ['bodegaOrigen', 'bodegaDestino', 'detalles', 'detalles.producto', 'detalles.lote'],
    });

    if (!transferencia) {
      throw new NotFoundException(`Transferencia con número ${numero} no encontrada`);
    }

    return transferencia;
  }

  async enviar(id: number, usuarioAutorizaId: number): Promise<Transferencia> {
    const transferencia = await this.findOne(id);

    if (transferencia.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden enviar transferencias pendientes');
    }

    transferencia.estado = 'en_transito';
    transferencia.fechaEnvio = new Date();
    transferencia.usuarioAutorizaId = usuarioAutorizaId;

    // Actualizar detalles a enviado
    transferencia.detalles.forEach(detalle => {
      detalle.cantidadEnviada = detalle.cantidadSolicitada;
      detalle.estado = 'enviado';
    });

    await this.transferenciaRepository.save(transferencia);
    return this.findOne(id);
  }

  async recibir(id: number, usuarioRecibeId: number): Promise<Transferencia> {
    const transferencia = await this.findOne(id);

    if (transferencia.estado !== 'en_transito') {
      throw new BadRequestException('Solo se pueden recibir transferencias en tránsito');
    }

    transferencia.estado = 'recibida';
    transferencia.fechaRecepcion = new Date();
    transferencia.usuarioRecibeId = usuarioRecibeId;

    // Actualizar detalles a recibido
    transferencia.detalles.forEach(detalle => {
      detalle.cantidadRecibida = detalle.cantidadEnviada;
      detalle.estado = 'recibido';
    });

    await this.transferenciaRepository.save(transferencia);
    return this.findOne(id);
  }

  async cancelar(id: number): Promise<Transferencia> {
    const transferencia = await this.findOne(id);

    if (transferencia.estado === 'recibida') {
      throw new BadRequestException('No se puede cancelar una transferencia recibida');
    }

    transferencia.estado = 'cancelada';

    await this.transferenciaRepository.save(transferencia);
    return this.findOne(id);
  }

  async update(id: number, updateTransferenciaDto: UpdateTransferenciaDto): Promise<Transferencia> {
    const transferencia = await this.findOne(id);
    
    if (transferencia.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden modificar transferencias pendientes');
    }

    Object.assign(transferencia, updateTransferenciaDto);
    await this.transferenciaRepository.save(transferencia);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const transferencia = await this.findOne(id);
    
    if (transferencia.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden eliminar transferencias pendientes');
    }

    await this.transferenciaRepository.remove(transferencia);
  }

  private async generarNumeroTransferencia(): Promise<string> {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    
    const ultimaTransferencia = await this.transferenciaRepository
      .createQueryBuilder('transferencia')
      .where("transferencia.numeroTransferencia LIKE :patron", { patron: `TRF-${año}${mes}%` })
      .orderBy('transferencia.numeroTransferencia', 'DESC')
      .getOne();

    let secuencial = 1;
    if (ultimaTransferencia) {
      const ultimoNumero = ultimaTransferencia.numeroTransferencia.split('-')[1];
      secuencial = parseInt(ultimoNumero.slice(-4)) + 1;
    }

    return `TRF-${año}${mes}${secuencial.toString().padStart(4, '0')}`;
  }
}