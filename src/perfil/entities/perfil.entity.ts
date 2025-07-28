import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  permisos: string;

  @OneToMany(() => Usuario, usuario => usuario.perfil)
  usuarios: Usuario[];
}
