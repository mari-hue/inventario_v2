import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { LoteProducto } from '../entities/lote-producto.entity';
import { InventarioLote } from '../entities/inventario-lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(LoteProducto)
    private loteRepository: Repository<LoteProducto>,
    @InjectRepository(InventarioLote)
    private inventarioLoteRepository: Repository<InventarioLote>,
  ) {}

  async create(createLoteDto: CreateLoteDto): Promise<LoteProducto> {
    try {
      const lote = this.loteRepository.create({
        ...createLoteDto,
        cantidadActual: createLoteDto.cantidadInicial,
      });
      return await this.loteRepository.save(lote);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El número de lote ya existe');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, search?: string, productoId?: number) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.loteRepository
      .createQueryBuilder('lote')
      .leftJoinAndSelect('lote.producto', 'producto')
      .leftJoinAndSelect('lote.proveedor', 'proveedor')
      .leftJoinAndSelect('lote.inventarios', 'inventarios')
      .leftJoinAndSelect('inventarios.bodega', 'bodega');

    if (search) {
      queryBuilder.where(
        'lote.numeroLote ILIKE :search OR producto.nombre ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (productoId) {
      queryBuilder.andWhere('lote.producto.id = :productoId', { productoId });
    }

    const [lotes, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('lote.fechaVencimiento', 'ASC')
      .getManyAndCount();

    return {
      data: lotes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActivos(): Promise<LoteProducto[]> {
    return this.loteRepository.find({
      where: { 
        esActivo: true,
        cantidadActual: MoreThan(0)
      },
      relations: ['producto', 'proveedor', 'inventarios', 'inventarios.bodega'],
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findVencenPronto(dias = 30): Promise<LoteProducto[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    return this.loteRepository.find({
      where: {
        esActivo: true,
        cantidadActual: MoreThan(0),
        fechaVencimiento: LessThan(fechaLimite),
      },
      relations: ['producto', 'inventarios', 'inventarios.bodega'],
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findVencidos(): Promise<LoteProducto[]> {
    const hoy = new Date();
    
    return this.loteRepository.find({
      where: {
        esActivo: true,
        fechaVencimiento: LessThan(hoy),
      },
      relations: ['producto', 'inventarios', 'inventarios.bodega'],
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findByProducto(productoId: number): Promise<LoteProducto[]> {
    return this.loteRepository.find({
      where: { 
        producto: { id: productoId },
        esActivo: true 
      },
      relations: ['producto', 'proveedor', 'inventarios', 'inventarios.bodega'],
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findOne(id: number): Promise<LoteProducto> {
    const lote = await this.loteRepository.findOne({
      where: { id },
      relations: ['producto', 'proveedor', 'inventarios', 'inventarios.bodega'],
    });

    if (!lote) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    }

    return lote;
  }

  async findByNumero(numeroLote: string): Promise<LoteProducto> {
    const lote = await this.loteRepository.findOne({
      where: { numeroLote },
      relations: ['producto', 'proveedor', 'inventarios', 'inventarios.bodega'],
    });

    if (!lote) {
      throw new NotFoundException(`Lote con número ${numeroLote} no encontrado`);
    }

    return lote;
  }

  async findInventarioLote(loteId: number): Promise<InventarioLote[]> {
    return this.inventarioLoteRepository.find({
      where: { lote: { id: loteId } },
      relations: ['lote', 'bodega'],
    });
  }

  async update(id: number, updateLoteDto: UpdateLoteDto): Promise<LoteProducto> {
    const lote = await this.findOne(id);
    
    try {
      Object.assign(lote, updateLoteDto);
      return await this.loteRepository.save(lote);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El número de lote ya existe');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const lote = await this.findOne(id);
    lote.esActivo = false;
    await this.loteRepository.save(lote);
  }

  // Métodos auxiliares para movimientos de inventario por lotes
  async actualizarCantidadLote(loteId: number, cantidadMovimiento: number): Promise<void> {
    const lote = await this.findOne(loteId);
    lote.cantidadActual += cantidadMovimiento;
    
    if (lote.cantidadActual < 0) {
      throw new BadRequestException('La cantidad del lote no puede ser negativa');
    }
    
    await this.loteRepository.save(lote);
  }
}