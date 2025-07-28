import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';
import { Producto } from './producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';

@Entity('detalle_ordenes_venta')
export class DetalleOrdenVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cantidad_solicitada', type: 'int' })
  cantidadSolicitada: number;

  @Column({ name: 'cantidad_despachada', type: 'int', default: 0 })
  cantidadDespachada: number;

  @Column({ name: 'cantidad_pendiente', type: 'int' })
  cantidadPendiente: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 })
  descuentoPorcentaje: number;

  @Column({ name: 'descuento_valor', type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuentoValor: number;

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ name: 'fecha_despacho', type: 'date', nullable: true })
  fechaDespacho: Date;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // pendiente, despachado_parcial, despachado_completo, cancelado

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @ManyToOne(() => OrdenVenta, (orden) => orden.detalles)
  @JoinColumn({ name: 'orden_venta_id' })
  ordenVenta: OrdenVenta;

  @ManyToOne(() => Producto, (producto) => producto.detallesVenta)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Bodega)
  @JoinColumn({ name: 'bodega_origen_id' })
  bodegaOrigen: Bodega;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}