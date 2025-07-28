import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categorias } from './categorias.entity';

@Entity('subcategorias')
export class Subcategorias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  categoria_id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @ManyToOne(() => Categorias)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categorias;
}