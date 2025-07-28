import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipos } from './equipos.entity';

@Entity('inventarios_fisicos')
export class InventariosFisicos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  equipo_id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', nullable: true })
  estado_sistema: string;

  @Column({ type: 'varchar', nullable: true })
  estado_fisico: string;

  @Column({ type: 'text', nullable: true })
  diferencia: string;

  @Column({ type: 'text', nullable: true })
  observacion: string;

  @Column({ type: 'boolean', default: false })
  escaneado: boolean;

  @ManyToOne(() => Equipos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipos;
}