import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipos } from './equipos.entity';
import { Ubicaciones } from './ubicaciones.entity';
import { Usuarios } from './usuarios.entity';

@Entity('movimientos_fisicos')
export class MovimientosFisicos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  equipo_id: number;

  @Column({ type: 'int', nullable: true })
  ubicacion_origen_id: number;

  @Column({ type: 'int' })
  ubicacion_destino_id: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'int' })
  usuario_id: number;

  @Column({ type: 'text', nullable: true })
  observacion: string;

  @ManyToOne(() => Equipos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipos;

  @ManyToOne(() => Ubicaciones, { nullable: true })
  @JoinColumn({ name: 'ubicacion_origen_id' })
  ubicacion_origen: Ubicaciones;

  @ManyToOne(() => Ubicaciones)
  @JoinColumn({ name: 'ubicacion_destino_id' })
  ubicacion_destino: Ubicaciones;

  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuarios;
}