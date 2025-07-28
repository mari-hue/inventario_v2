import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Bodegas } from './bodegas.entity';

@Entity('ubicaciones')
export class Ubicaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  bodega_id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  tipo: string;

  @Column({ type: 'int', nullable: true })
  ubicacion_padre_id: number;

  @Column({ type: 'varchar', nullable: true })
  codigo_referencia: string;

  @ManyToOne(() => Bodegas)
  @JoinColumn({ name: 'bodega_id' })
  bodega: Bodegas;

  @ManyToOne(() => Ubicaciones, { nullable: true })
  @JoinColumn({ name: 'ubicacion_padre_id' })
  ubicacion_padre: Ubicaciones;
}