import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Inventario } from '../entities/inventario.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { LoteProducto } from '../entities/lote-producto.entity';
import { InventarioLote } from '../entities/inventario-lote.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(MovimientoInventario)
    private movimientoRepository: Repository<MovimientoInventario>,
    @InjectRepository(LoteProducto)
    private loteRepository: Repository<LoteProducto>,
    @InjectRepository(InventarioLote)
    private inventarioLoteRepository: Repository<InventarioLote>,
  ) {}

  async getInventarioGeneral() {
    const query = `
      SELECT 
        p.codigo_producto,
        p.nombre,
        c.nombre as categoria,
        SUM(i.cantidad_actual) as cantidad_total,
        SUM(i.cantidad_disponible) as cantidad_disponible,
        SUM(i.cantidad_reservada) as cantidad_reservada,
        AVG(i.costo_promedio) as costo_promedio,
        SUM(i.cantidad_actual * i.costo_promedio) as valor_total,
        p.stock_minimo,
        p.punto_reorden,
        CASE 
          WHEN SUM(i.cantidad_actual) <= p.stock_minimo THEN 'Crítico'
          WHEN SUM(i.cantidad_actual) <= p.punto_reorden THEN 'Bajo'
          ELSE 'Normal'
        END as estado_stock
      FROM productos p
      LEFT JOIN inventarios i ON p.id = i.producto_id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.es_activo = true AND i.es_activo = true
      GROUP BY p.id, p.codigo_producto, p.nombre, c.nombre, p.stock_minimo, p.punto_reorden
      ORDER BY p.nombre
    `;
    
    return this.inventarioRepository.query(query);
  }

  async getProductosBajoStock() {
    const query = `
      SELECT 
        p.codigo_producto,
        p.nombre,
        c.nombre as categoria,
        SUM(i.cantidad_actual) as cantidad_actual,
        p.stock_minimo,
        p.punto_reorden,
        (p.stock_minimo - SUM(i.cantidad_actual)) as deficit
      FROM productos p
      LEFT JOIN inventarios i ON p.id = i.producto_id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.es_activo = true 
        AND i.es_activo = true
      GROUP BY p.id, p.codigo_producto, p.nombre, c.nombre, p.stock_minimo, p.punto_reorden
      HAVING SUM(i.cantidad_actual) <= p.stock_minimo
      ORDER BY deficit DESC
    `;
    
    return this.inventarioRepository.query(query);
  }

  async getProductosSinMovimiento(dias: number) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const query = `
      SELECT 
        p.codigo_producto,
        p.nombre,
        c.nombre as categoria,
        SUM(i.cantidad_actual) as cantidad_actual,
        MAX(mi.fecha_movimiento) as ultimo_movimiento,
        SUM(i.cantidad_actual * i.costo_promedio) as valor_inmovilizado
      FROM productos p
      LEFT JOIN inventarios i ON p.id = i.producto_id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN movimientos_inventario mi ON p.id = mi.producto_id
      WHERE p.es_activo = true 
        AND i.es_activo = true
        AND (mi.fecha_movimiento < $1 OR mi.fecha_movimiento IS NULL)
      GROUP BY p.id, p.codigo_producto, p.nombre, c.nombre
      HAVING SUM(i.cantidad_actual) > 0
      ORDER BY ultimo_movimiento ASC NULLS FIRST
    `;
    
    return this.inventarioRepository.query(query, [fechaLimite]);
  }

  async getLotesVencenPronto(dias: number) {
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

  async getLotesVencidos() {
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

  async getValoracionInventario(bodegaId?: number) {
    let query = `
      SELECT 
        b.nombre as bodega,
        c.nombre as categoria,
        COUNT(DISTINCT p.id) as total_productos,
        SUM(i.cantidad_actual) as cantidad_total,
        SUM(i.cantidad_actual * i.costo_promedio) as valor_total
      FROM inventarios i
      JOIN productos p ON i.producto_id = p.id
      JOIN bodegas b ON i.bodega_id = b.id_bodega
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE i.es_activo = true AND p.es_activo = true
    `;

    const params = [];
    if (bodegaId) {
      query += ` AND b.id_bodega = $1`;
      params.push(bodegaId);
    }

    query += `
      GROUP BY b.id_bodega, b.nombre, c.id, c.nombre
      ORDER BY b.nombre, c.nombre
    `;
    
    return this.inventarioRepository.query(query, params);
  }

  async getMovimientosPeriodo(fechaInicio: Date, fechaFin: Date, bodegaId?: number) {
    let query = `
      SELECT 
        DATE(mi.fecha_movimiento) as fecha,
        mi.tipo_movimiento,
        mi.subtipo_movimiento,
        b.nombre as bodega,
        p.codigo_producto,
        p.nombre as producto,
        SUM(CASE WHEN mi.tipo_movimiento = 'entrada' THEN mi.cantidad_movimiento ELSE 0 END) as total_entradas,
        SUM(CASE WHEN mi.tipo_movimiento = 'salida' THEN mi.cantidad_movimiento ELSE 0 END) as total_salidas,
        COUNT(*) as total_movimientos
      FROM movimientos_inventario mi
      JOIN productos p ON mi.producto_id = p.id
      JOIN bodegas b ON mi.bodega_id = b.id_bodega
      WHERE mi.fecha_movimiento BETWEEN $1 AND $2
    `;

    const params = [fechaInicio, fechaFin];
    if (bodegaId) {
      query += ` AND b.id_bodega = $3`;
      params.push(bodegaId);
    }

    query += `
      GROUP BY DATE(mi.fecha_movimiento), mi.tipo_movimiento, mi.subtipo_movimiento, 
               b.nombre, p.codigo_producto, p.nombre
      ORDER BY fecha DESC, b.nombre, p.nombre
    `;
    
    return this.movimientoRepository.query(query, params);
  }

  async getDashboard() {
    const [
      totalProductos,
      productosActivos,
      totalBodegas,
      valorTotalInventario,
      productosBajoStock,
      lotesVencenPronto,
      movimientosHoy
    ] = await Promise.all([
      this.productoRepository.count(),
      this.productoRepository.count({ where: { esActivo: true } }),
      this.inventarioRepository.query('SELECT COUNT(DISTINCT bodega_id) as total FROM inventarios WHERE es_activo = true'),
      this.inventarioRepository.query('SELECT SUM(cantidad_actual * costo_promedio) as valor_total FROM inventarios WHERE es_activo = true'),
      this.getProductosBajoStock(),
      this.getLotesVencenPronto(30),
      this.movimientoRepository.count({ 
        where: { 
          fechaMovimiento: MoreThan(new Date(new Date().setHours(0, 0, 0, 0))) 
        } 
      })
    ]);

    return {
      totalProductos,
      productosActivos,
      totalBodegas: totalBodegas[0]?.total || 0,
      valorTotalInventario: parseFloat(valorTotalInventario[0]?.valor_total || 0),
      productosBajoStock: productosBajoStock.length,
      lotesVencenPronto: lotesVencenPronto.length,
      movimientosHoy,
      alertas: {
        productosBajoStock: productosBajoStock.slice(0, 5),
        lotesVencenPronto: lotesVencenPronto.slice(0, 5),
      }
    };
  }

  async getInventarioPorCategoria() {
    const query = `
      SELECT 
        c.nombre as categoria,
        COUNT(DISTINCT p.id) as total_productos,
        SUM(i.cantidad_actual) as cantidad_total,
        SUM(i.cantidad_actual * i.costo_promedio) as valor_total,
        AVG(i.costo_promedio) as costo_promedio
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.categoria_id
      LEFT JOIN inventarios i ON p.id = i.producto_id
      WHERE c.es_activa = true AND p.es_activo = true AND i.es_activo = true
      GROUP BY c.id, c.nombre
      ORDER BY valor_total DESC
    `;
    
    return this.inventarioRepository.query(query);
  }

  async getInventarioPorBodega() {
    const query = `
      SELECT 
        b.nombre as bodega,
        u.nombre as ubicacion,
        COUNT(DISTINCT i.producto_id) as total_productos,
        SUM(i.cantidad_actual) as cantidad_total,
        SUM(i.cantidad_disponible) as cantidad_disponible,
        SUM(i.cantidad_reservada) as cantidad_reservada,
        SUM(i.cantidad_actual * i.costo_promedio) as valor_total
      FROM bodegas b
      LEFT JOIN ubicaciones u ON b.ubicacion_id = u.id
      LEFT JOIN inventarios i ON b.id_bodega = i.bodega_id
      WHERE b.es_activa = true AND i.es_activo = true
      GROUP BY b.id_bodega, b.nombre, u.nombre
      ORDER BY valor_total DESC
    `;
    
    return this.inventarioRepository.query(query);
  }
}