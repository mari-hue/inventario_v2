import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ name: 'razon_social', length: 255, nullable: true })
  razonSocial: string;

  @Column({ length: 20, unique: true })
  rut: string;

  @Column({ name: 'tipo_cliente', length: 50, default: 'natural' }) // natural, juridico
  tipoCliente: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  ciudad: string;

  @Column({ length: 50, nullable: true })
  pais: string;

  @Column({ length: 15, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'contacto_principal', length: 100, nullable: true })
  contactoPrincipal: string;

  @Column({ name: 'telefono_contacto', length: 15, nullable: true })
  telefonoContacto: string;

  @Column({ name: 'email_contacto', length: 100, nullable: true })
  emailContacto: string;

  @Column({ name: 'limite_credito', type: 'decimal', precision: 12, scale: 2, default: 0 })
  limiteCredito: number;

  @Column({ name: 'dias_credito', type: 'int', default: 0 })
  diasCredito: number;

  @Column({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 })
  descuentoPorcentaje: number;

  @Column({ name: 'es_activo', type: 'boolean', default: true })
  esActivo: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @OneToMany(() => OrdenVenta, (orden) => orden.cliente)
  ordenesVenta: OrdenVenta[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}