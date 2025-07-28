import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Perfiles } from './perfiles.entity';

@Entity('usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'int' })
  perfil_id: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ManyToOne(() => Perfiles)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfiles;
}