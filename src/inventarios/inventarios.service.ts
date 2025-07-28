import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventario } from '../entities/inventario.entity';
import { Producto } from '../entities/producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { MovimientoInventarioDto, AjusteInventarioDto, TransferenciaInventarioDto } from './dto/movimiento-inventario.dto';

@Injectable()
export class InventariosService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Bodega)
    private readonly bodegaRepository: Repository<Bodega>,
    @InjectRepository(MovimientoInventario)
    private readonly movimientoRepository: Repository<MovimientoInventario>,
    private readonly dataSource: DataSource,
  ) {}

  async findInventarioPorBodega(bodegaId: number): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { bodega: { id: bodegaId }, esActivo: true },
      relations: ['producto', 'producto.categoria', 'bodega'],
      order: { producto: { nombre: 'ASC' } }
    });
  }

  async findInventarioPorProducto(productoId: number): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { producto: { id: productoId }, esActivo: true },
      relations: ['producto', 'bodega'],
      order: { bodega: { nombre: 'ASC' } }
    });
  }

  async findInventarioProductoBodega(productoId: number, bodegaId: number): Promise<Inventario> {
    let inventario = await this.inventarioRepository.findOne({
      where: { 
        producto: { id: productoId }, 
        bodega: { id: bodegaId } 
      },
      relations: ['producto', 'bodega']
    });

    // Si no existe, crear registro de inventario
    if (!inventario) {
      const producto = await this.productoRepository.findOne({ where: { id: productoId } });
      const bodega = await this.bodegaRepository.findOne({ where: { id: bodegaId } });

      if (!producto || !bodega) {
        throw new NotFoundException('Producto o Bodega no encontrados');
      }

      inventario = this.inventarioRepository.create({
        producto,
        bodega,
        cantidadActual: 0,
        cantidadDisponible: 0,
        cantidadReservada: 0,
        stockMinimo: producto.stockMinimo,
        stockMaximo: producto.stockMaximo,
        puntoReorden: producto.puntoReorden
      });

      inventario = await this.inventarioRepository.save(inventario);
    }

    return inventario;
  }

  async registrarMovimiento(movimientoDto: MovimientoInventarioDto): Promise<MovimientoInventario> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obtener inventario actual
      const inventario = await this.findInventarioProductoBodega(
        movimientoDto.productoId,
        movimientoDto.bodegaId
      );

      const cantidadAnterior = inventario.cantidadActual;
      let cantidadMovimiento = movimientoDto.cantidad;
      let cantidadNueva: number;

      // Calcular nueva cantidad según tipo de movimiento
      switch (movimientoDto.tipoMovimiento) {
        case 'entrada':
          cantidadNueva = cantidadAnterior + cantidadMovimiento;
          break;
        case 'salida':
          if (cantidadAnterior < cantidadMovimiento) {
            throw new BadRequestException('Stock insuficiente para la salida');
          }
          cantidadNueva = cantidadAnterior - cantidadMovimiento;
          cantidadMovimiento = -cantidadMovimiento; // Negativo para salidas
          break;
        case 'transferencia':
          if (cantidadAnterior < cantidadMovimiento) {
            throw new BadRequestException('Stock insuficiente para la transferencia');
          }
          cantidadNueva = cantidadAnterior - cantidadMovimiento;
          cantidadMovimiento = -cantidadMovimiento; // Negativo para origen de transferencia
          break;
        case 'ajuste':
          cantidadNueva = movimientoDto.cantidad;
          cantidadMovimiento = cantidadNueva - cantidadAnterior;
          break;
        default:
          throw new BadRequestException('Tipo de movimiento no válido');
      }

      // Actualizar inventario
      inventario.cantidadActual = cantidadNueva;
      inventario.cantidadDisponible = cantidadNueva - inventario.cantidadReservada;
      inventario.fechaUltimoMovimiento = new Date();

      // Actualizar costo promedio si se proporciona costo
      if (movimientoDto.costoUnitario && movimientoDto.tipoMovimiento === 'entrada') {
        const costoTotal = inventario.costoPromedio * cantidadAnterior + 
                          movimientoDto.costoUnitario * movimientoDto.cantidad;
        inventario.costoPromedio = cantidadNueva > 0 ? costoTotal / cantidadNueva : 0;
      }

      await queryRunner.manager.save(inventario);

      // Registrar movimiento
      const movimiento = this.movimientoRepository.create({
        producto: inventario.producto,
        bodega: inventario.bodega,
        tipoMovimiento: movimientoDto.tipoMovimiento,
        subtipoMovimiento: movimientoDto.subtipoMovimiento,
        numeroDocumento: movimientoDto.numeroDocumento,
        cantidadAnterior,
        cantidadMovimiento: Math.abs(cantidadMovimiento),
        cantidadNueva,
        costoUnitario: movimientoDto.costoUnitario,
        costoTotal: movimientoDto.costoUnitario ? 
          movimientoDto.costoUnitario * Math.abs(cantidadMovimiento) : 0,
        motivo: movimientoDto.motivo || '',
        usuarioId: movimientoDto.usuarioId,
        ordenCompraId: movimientoDto.ordenCompraId,
        ordenVentaId: movimientoDto.ordenVentaId,
        bodegaDestinoId: movimientoDto.bodegaDestinoId
      });

      const movimientoGuardado = await queryRunner.manager.save(movimiento);

      // Si es transferencia, crear movimiento de entrada en bodega destino
      if (movimientoDto.tipoMovimiento === 'transferencia' && movimientoDto.bodegaDestinoId) {
        await this.registrarEntradaTransferencia(
          movimientoDto.productoId,
          movimientoDto.bodegaDestinoId,
          movimientoDto.cantidad,
          movimientoDto.motivo,
          movimientoDto.usuarioId,
          queryRunner
        );
      }

      await queryRunner.commitTransaction();
      return movimientoGuardado;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async registrarEntradaTransferencia(
    productoId: number,
    bodegaDestinoId: number,
    cantidad: number,
    motivo: string,
    usuarioId: number,
    queryRunner: any
  ): Promise<void> {
    const inventarioDestino = await this.findInventarioProductoBodega(productoId, bodegaDestinoId);
    
    const cantidadAnterior = inventarioDestino.cantidadActual;
    const cantidadNueva = cantidadAnterior + cantidad;

    // Actualizar inventario destino
    inventarioDestino.cantidadActual = cantidadNueva;
    inventarioDestino.cantidadDisponible = cantidadNueva - inventarioDestino.cantidadReservada;
    inventarioDestino.fechaUltimoMovimiento = new Date();

    await queryRunner.manager.save(inventarioDestino);

    // Registrar movimiento de entrada
    const movimientoEntrada = this.movimientoRepository.create({
      producto: inventarioDestino.producto,
      bodega: inventarioDestino.bodega,
      tipoMovimiento: 'transferencia',
      subtipoMovimiento: 'transferencia_entrada',
      cantidadAnterior,
      cantidadMovimiento: cantidad,
      cantidadNueva,
      motivo,
      usuarioId
    });

    await queryRunner.manager.save(movimientoEntrada);
  }

  async ajustarInventario(ajusteDto: AjusteInventarioDto): Promise<MovimientoInventario> {
    const movimientoDto: MovimientoInventarioDto = {
      productoId: ajusteDto.productoId,
      bodegaId: ajusteDto.bodegaId,
      tipoMovimiento: 'ajuste',
      subtipoMovimiento: 'ajuste_manual',
      cantidad: ajusteDto.cantidadNueva,
      motivo: ajusteDto.motivo,
      usuarioId: ajusteDto.usuarioId
    };

    return await this.registrarMovimiento(movimientoDto);
  }

  async transferirInventario(transferenciaDto: TransferenciaInventarioDto): Promise<MovimientoInventario> {
    const movimientoDto: MovimientoInventarioDto = {
      productoId: transferenciaDto.productoId,
      bodegaId: transferenciaDto.bodegaOrigenId,
      tipoMovimiento: 'transferencia',
      subtipoMovimiento: 'transferencia_salida',
      cantidad: transferenciaDto.cantidad,
      motivo: transferenciaDto.motivo,
      usuarioId: transferenciaDto.usuarioId,
      bodegaDestinoId: transferenciaDto.bodegaDestinoId
    };

    return await this.registrarMovimiento(movimientoDto);
  }

  async getHistorialMovimientos(
    productoId?: number,
    bodegaId?: number,
    fechaInicio?: Date,
    fechaFin?: Date,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: MovimientoInventario[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.producto', 'producto')
      .leftJoinAndSelect('movimiento.bodega', 'bodega')
      .leftJoinAndSelect('movimiento.bodegaDestino', 'bodegaDestino');

    if (productoId) {
      queryBuilder.andWhere('movimiento.producto_id = :productoId', { productoId });
    }

    if (bodegaId) {
      queryBuilder.andWhere('movimiento.bodega_id = :bodegaId', { bodegaId });
    }

    if (fechaInicio) {
      queryBuilder.andWhere('movimiento.fecha_movimiento >= :fechaInicio', { fechaInicio });
    }

    if (fechaFin) {
      queryBuilder.andWhere('movimiento.fecha_movimiento <= :fechaFin', { fechaFin });
    }

    const [data, total] = await queryBuilder
      .orderBy('movimiento.fecha_movimiento', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getResumenInventario(): Promise<{
    totalProductos: number;
    totalBodegas: number;
    valorTotalInventario: number;
    productosBajoStock: number;
  }> {
    const totalProductos = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .select('COUNT(DISTINCT inventario.producto_id)', 'count')
      .where('inventario.es_activo = true')
      .getRawOne();

    const totalBodegas = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .select('COUNT(DISTINCT inventario.bodega_id)', 'count')
      .where('inventario.es_activo = true')
      .getRawOne();

    const valorTotal = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .select('SUM(inventario.cantidad_actual * inventario.costo_promedio)', 'valor')
      .where('inventario.es_activo = true')
      .getRawOne();

    const productosBajoStock = await this.inventarioRepository
      .createQueryBuilder('inventario')
      .where('inventario.cantidad_actual <= inventario.punto_reorden')
      .andWhere('inventario.es_activo = true')
      .getCount();

    return {
      totalProductos: parseInt(totalProductos.count) || 0,
      totalBodegas: parseInt(totalBodegas.count) || 0,
      valorTotalInventario: parseFloat(valorTotal.valor) || 0,
      productosBajoStock
    };
  }
}