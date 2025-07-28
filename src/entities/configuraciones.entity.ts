import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('configuraciones')
export class Configuraciones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  clave: string;

  @Column({ type: 'text' })
  valor: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;
}