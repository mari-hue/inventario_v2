import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { DetalleOrdenCompra } from './detalle-orden-compra.entity';

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numero_orden', length: 50, unique: true })
  numeroOrden: string;

  @Column({ name: 'fecha_orden', type: 'date' })
  fechaOrden: Date;

  @Column({ name: 'fecha_esperada_entrega', type: 'date', nullable: true })
  fechaEsperadaEntrega: Date;

  @Column({ name: 'fecha_entrega_real', type: 'date', nullable: true })
  fechaEntregaReal: Date;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // pendiente, enviada, parcialmente_recibida, recibida, cancelada

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'impuesto', type: 'decimal', precision: 12, scale: 2, default: 0 })
  impuesto: number;

  @Column({ name: 'total', type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ name: 'porcentaje_impuesto', type: 'decimal', precision: 5, scale: 2, default: 19 })
  porcentajeImpuesto: number;

  @Column({ name: 'forma_pago', length: 100, nullable: true })
  formaPago: string;

  @Column({ name: 'condiciones_pago', type: 'text', nullable: true })
  condicionesPago: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'usuario_crea_id', type: 'int', nullable: true })
  usuarioCreaId: number;

  @Column({ name: 'usuario_aprueba_id', type: 'int', nullable: true })
  usuarioApruebaId: number;

  @Column({ name: 'fecha_aprobacion', type: 'timestamp', nullable: true })
  fechaAprobacion: Date;

  // Relaciones
  @ManyToOne(() => Proveedor, (proveedor) => proveedor.ordenesCompra)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.ordenCompra, { cascade: true })
  detalles: DetalleOrdenCompra[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}