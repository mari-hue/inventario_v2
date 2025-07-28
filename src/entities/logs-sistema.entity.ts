import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';

@Entity('logs_sistema')
export class LogsSistema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  usuario_id: number;

  @Column({ type: 'varchar' })
  accion: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'varchar', nullable: true })
  ip_origen: string;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;
}