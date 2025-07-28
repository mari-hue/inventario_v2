import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Perfil } from '../../perfil/entities/perfil.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  email: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Perfil, perfil => perfil.usuarios, { eager: true })
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
}
