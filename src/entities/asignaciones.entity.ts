import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Equipos } from './equipos.entity';
import { Usuarios } from './usuarios.entity';

@Entity('asignaciones')
export class Asignaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  equipo_id: number;

  @Column({ type: 'int' })
  usuario_id: number;

  @Column({ type: 'int' })
  responsable_id: number;

  @Column({ type: 'varchar' })
  tipo_asignacion: string;

  @Column({ type: 'text', nullable: true })
  motivo: string;

  @Column({ type: 'date' })
  fecha_asignacion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_devolucion: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Equipos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipos;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'responsable_id' })
  responsable: Usuarios;
}