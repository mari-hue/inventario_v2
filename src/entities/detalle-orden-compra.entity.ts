import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { Producto } from './producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';

@Entity('detalle_ordenes_compra')
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cantidad_ordenada', type: 'int' })
  cantidadOrdenada: number;

  @Column({ name: 'cantidad_recibida', type: 'int', default: 0 })
  cantidadRecibida: number;

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

  @Column({ name: 'fecha_esperada_entrega', type: 'date', nullable: true })
  fechaEsperadaEntrega: Date;

  @Column({ name: 'fecha_recepcion', type: 'date', nullable: true })
  fechaRecepcion: Date;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // pendiente, recibido_parcial, recibido_completo, cancelado

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @ManyToOne(() => OrdenCompra, (orden) => orden.detalles)
  @JoinColumn({ name: 'orden_compra_id' })
  ordenCompra: OrdenCompra;

  @ManyToOne(() => Producto, (producto) => producto.detallesCompra)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Bodega)
  @JoinColumn({ name: 'bodega_destino_id' })
  bodegaDestino: Bodega;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}