import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  usuario_id: number;

  @Column({ type: 'varchar' })
  accion: string;

  @Column({ type: 'varchar' })
  entidad: string;

  @Column({ type: 'int' })
  entidad_id: number;

  @Column({ type: 'text', nullable: true })
  detalle: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;
}