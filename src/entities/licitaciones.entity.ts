import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('licitaciones')
export class Licitaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  numero_expediente: string;

  @Column({ type: 'date', nullable: true })
  fecha_adjudicacion: Date;

  @Column({ type: 'text', nullable: true })
  contrato_url: string;
}