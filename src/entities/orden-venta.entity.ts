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
import { Cliente } from './cliente.entity';
import { DetalleOrdenVenta } from './detalle-orden-venta.entity';

@Entity('ordenes_venta')
export class OrdenVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numero_orden', length: 50, unique: true })
  numeroOrden: string;

  @Column({ name: 'fecha_orden', type: 'date' })
  fechaOrden: Date;

  @Column({ name: 'fecha_entrega_solicitada', type: 'date', nullable: true })
  fechaEntregaSolicitada: Date;

  @Column({ name: 'fecha_entrega_real', type: 'date', nullable: true })
  fechaEntregaReal: Date;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // pendiente, confirmada, procesando, despachada, entregada, cancelada

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 })
  descuentoPorcentaje: number;

  @Column({ name: 'descuento_valor', type: 'decimal', precision: 12, scale: 2, default: 0 })
  descuentoValor: number;

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

  @Column({ name: 'direccion_entrega', type: 'text', nullable: true })
  direccionEntrega: string;

  @Column({ name: 'contacto_entrega', length: 100, nullable: true })
  contactoEntrega: string;

  @Column({ name: 'telefono_entrega', length: 15, nullable: true })
  telefonoEntrega: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'usuario_crea_id', type: 'int', nullable: true })
  usuarioCreaId: number;

  @Column({ name: 'usuario_aprueba_id', type: 'int', nullable: true })
  usuarioApruebaId: number;

  @Column({ name: 'fecha_aprobacion', type: 'timestamp', nullable: true })
  fechaAprobacion: Date;

  // Relaciones
  @ManyToOne(() => Cliente, (cliente) => cliente.ordenesVenta)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(() => DetalleOrdenVenta, (detalle) => detalle.ordenVenta, { cascade: true })
  detalles: DetalleOrdenVenta[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}