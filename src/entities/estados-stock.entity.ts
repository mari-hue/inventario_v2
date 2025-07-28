import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipos } from './equipos.entity';

@Entity('estados_stock')
export class EstadosStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  equipo_id: number;

  @Column({ type: 'varchar' })
  estado: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @ManyToOne(() => Equipos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipos;
}