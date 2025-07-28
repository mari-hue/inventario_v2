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
import { Producto } from './producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';
import { TransferenciaDetalle } from './transferencia-detalle.entity';

@Entity('transferencias')
export class Transferencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numero_transferencia', length: 50, unique: true })
  numeroTransferencia: string;

  @Column({ name: 'fecha_solicitud', type: 'date' })
  fechaSolicitud: Date;

  @Column({ name: 'fecha_envio', type: 'date', nullable: true })
  fechaEnvio: Date;

  @Column({ name: 'fecha_recepcion', type: 'date', nullable: true })
  fechaRecepcion: Date;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // pendiente, enviada, en_transito, recibida, cancelada

  @Column({ name: 'usuario_solicita_id', type: 'int' })
  usuarioSolicitaId: number;

  @Column({ name: 'usuario_autoriza_id', type: 'int', nullable: true })
  usuarioAutorizaId: number;

  @Column({ name: 'usuario_recibe_id', type: 'int', nullable: true })
  usuarioRecibeId: number;

  @Column({ type: 'text', nullable: true })
  motivo: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'total_items', type: 'int', default: 0 })
  totalItems: number;

  @Column({ name: 'costo_total', type: 'decimal', precision: 12, scale: 2, default: 0 })
  costoTotal: number;

  // Relaciones
  @ManyToOne(() => Bodega, { eager: true })
  @JoinColumn({ name: 'bodega_origen_id' })
  bodegaOrigen: Bodega;

  @ManyToOne(() => Bodega, { eager: true })
  @JoinColumn({ name: 'bodega_destino_id' })
  bodegaDestino: Bodega;

  @OneToMany(() => TransferenciaDetalle, (detalle) => detalle.transferencia, { cascade: true })
  detalles: TransferenciaDetalle[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}