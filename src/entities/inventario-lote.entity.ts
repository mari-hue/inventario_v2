import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoteProducto } from './lote-producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';

@Entity('inventario_lotes')
@Unique(['lote', 'bodega'])
export class InventarioLote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cantidad_actual', type: 'int', default: 0 })
  cantidadActual: number;

  @Column({ name: 'cantidad_reservada', type: 'int', default: 0 })
  cantidadReservada: number;

  @Column({ name: 'cantidad_disponible', type: 'int', default: 0 })
  cantidadDisponible: number;

  @Column({ name: 'ubicacion_fisica', length: 100, nullable: true })
  ubicacionFisica: string;

  @Column({ name: 'codigo_ubicacion', length: 50, nullable: true })
  codigoUbicacion: string;

  @Column({ name: 'fecha_ultimo_movimiento', type: 'timestamp', nullable: true })
  fechaUltimoMovimiento: Date;

  @Column({ name: 'es_activo', type: 'boolean', default: true })
  esActivo: boolean;

  // Relaciones
  @ManyToOne(() => LoteProducto, (lote) => lote.inventarios, { eager: true })
  @JoinColumn({ name: 'lote_id' })
  lote: LoteProducto;

  @ManyToOne(() => Bodega, { eager: true })
  @JoinColumn({ name: 'bodega_id' })
  bodega: Bodega;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}