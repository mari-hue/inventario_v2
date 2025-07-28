import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Producto } from './producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';

@Entity('inventarios')
@Unique(['producto', 'bodega'])
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cantidad_actual', type: 'int', default: 0 })
  cantidadActual: number;

  @Column({ name: 'cantidad_reservada', type: 'int', default: 0 })
  cantidadReservada: number;

  @Column({ name: 'cantidad_disponible', type: 'int', default: 0 })
  cantidadDisponible: number;

  @Column({ name: 'stock_minimo', type: 'int', default: 0 })
  stockMinimo: number;

  @Column({ name: 'stock_maximo', type: 'int', default: 0 })
  stockMaximo: number;

  @Column({ name: 'punto_reorden', type: 'int', default: 0 })
  puntoReorden: number;

  @Column({ name: 'ubicacion_fisica', length: 100, nullable: true })
  ubicacionFisica: string;

  @Column({ name: 'codigo_ubicacion', length: 50, nullable: true })
  codigoUbicacion: string;

  @Column({ name: 'fecha_ultimo_movimiento', type: 'timestamp', nullable: true })
  fechaUltimoMovimiento: Date;

  @Column({ name: 'costo_promedio', type: 'decimal', precision: 10, scale: 2, default: 0 })
  costoPromedio: number;

  @Column({ name: 'es_activo', type: 'boolean', default: true })
  esActivo: boolean;

  // Relaciones
  @ManyToOne(() => Producto, (producto) => producto.inventarios)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Bodega, (bodega) => bodega.inventarios)
  @JoinColumn({ name: 'bodega_id' })
  bodega: Bodega;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}