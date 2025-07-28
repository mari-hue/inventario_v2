import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('proveedores')
export class Proveedores {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  rut: string;

  @Column({ type: 'varchar', nullable: true })
  contacto: string;

  @Column({ type: 'varchar', nullable: true })
  correo: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;
}