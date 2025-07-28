import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('perfiles')
export class Perfiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  permisos: string;
}