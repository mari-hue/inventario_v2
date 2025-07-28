import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';

@Entity('bodegas')
export class Bodegas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  ubicacion_geografica: string;

  @Column({ type: 'int', nullable: true })
  responsable_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'responsable_id' })
  responsable: Usuarios;
}