import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Equipos } from './equipos.entity';

@Entity('documentos_equipo')
export class DocumentosEquipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  equipo_id: number;

  @Column({ type: 'varchar' })
  tipo_documento: string;

  @Column({ type: 'varchar' })
  nombre_archivo: string;

  @Column({ type: 'text' })
  url_archivo: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Equipos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipos;
}