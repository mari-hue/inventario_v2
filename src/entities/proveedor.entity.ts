import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { OrdenCompra } from './orden-compra.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;

  @Column({ name: 'razon_social', length: 255, nullable: true })
  razonSocial: string;

  @Column({ length: 20, unique: true })
  rut: string;

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

  @Column({ name: 'dias_plazo_entrega', type: 'int', default: 7 })
  diasPlazoEntrega: number;

  @Column({ name: 'forma_pago', length: 100, nullable: true })
  formaPago: string;

  @Column({ name: 'es_activo', type: 'boolean', default: true })
  esActivo: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @OneToMany(() => Producto, (producto) => producto.proveedorPrincipal)
  productos: Producto[];

  @OneToMany(() => OrdenCompra, (orden) => orden.proveedor)
  ordenesCompra: OrdenCompra[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}