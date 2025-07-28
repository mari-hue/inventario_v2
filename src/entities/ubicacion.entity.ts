import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bodega } from '../bodega/entities/bodega.entity';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_ubicacion', length: 20, unique: true })
  codigoUbicacion: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  ciudad: string;

  @Column({ length: 50, nullable: true })
  region: string;

  @Column({ length: 50, nullable: true })
  pais: string;

  @Column({ name: 'codigo_postal', length: 10, nullable: true })
  codigoPostal: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitud: number;

  @Column({ name: 'zona_horaria', length: 50, nullable: true })
  zonaHoraria: string;

  @Column({ name: 'es_activa', type: 'boolean', default: true })
  esActiva: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @OneToMany(() => Bodega, (bodega) => bodega.ubicacion)
  bodegas: Bodega[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}