import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('modalidades_adquisicion')
export class ModalidadesAdquisicion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  tipo: string;

  @Column({ type: 'varchar', nullable: true })
  plazo_contrato: string;
}