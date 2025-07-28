import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipos } from './equipos.entity';
import { Usuarios } from './usuarios.entity';

@Entity('movimientos')
export class Movimientos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  equipo_id: number;

  @Column({ type: 'varchar' })
  evento: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'int', nullable: true })
  usuario_id: number;

  @ManyToOne(() => Equipos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipos;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;
}