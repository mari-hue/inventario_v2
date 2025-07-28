import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transferencia } from './transferencia.entity';
import { Producto } from './producto.entity';
import { LoteProducto } from './lote-producto.entity';

@Entity('transferencia_detalles')
export class TransferenciaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cantidad_solicitada', type: 'int' })
  cantidadSolicitada: number;

  @Column({ name: 'cantidad_enviada', type: 'int', default: 0 })
  cantidadEnviada: number;

  @Column({ name: 'cantidad_recibida', type: 'int', default: 0 })
  cantidadRecibida: number;

  @Column({ name: 'costo_unitario', type: 'decimal', precision: 10, scale: 2 })
  costoUnitario: number;

  @Column({ name: 'costo_total', type: 'decimal', precision: 12, scale: 2 })
  costoTotal: number;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // pendiente, enviado, recibido, faltante

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @ManyToOne(() => Transferencia, (transferencia) => transferencia.detalles)
  @JoinColumn({ name: 'transferencia_id' })
  transferencia: Transferencia;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => LoteProducto, { nullable: true })
  @JoinColumn({ name: 'lote_id' })
  lote: LoteProducto;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}