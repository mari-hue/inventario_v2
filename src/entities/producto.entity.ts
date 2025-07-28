import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { Proveedor } from './proveedor.entity';
import { Inventario } from './inventario.entity';
import { DetalleOrdenCompra } from './detalle-orden-compra.entity';
import { DetalleOrdenVenta } from './detalle-orden-venta.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_producto', length: 100, unique: true })
  codigoProducto: string;

  @Column({ name: 'codigo_barras', length: 100, nullable: true, unique: true })
  codigoBarras: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'precio_costo', type: 'decimal', precision: 10, scale: 2 })
  precioCosto: number;

  @Column({ name: 'precio_venta', type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ name: 'stock_minimo', type: 'int', default: 0 })
  stockMinimo: number;

  @Column({ name: 'stock_maximo', type: 'int', default: 0 })
  stockMaximo: number;

  @Column({ name: 'punto_reorden', type: 'int', default: 0 })
  puntoReorden: number;

  @Column({ name: 'unidad_medida', length: 50, default: 'unidad' })
  unidadMedida: string;

  @Column({ name: 'peso_kg', type: 'decimal', precision: 8, scale: 3, nullable: true })
  pesoKg: number;

  @Column({ name: 'dimensiones', length: 100, nullable: true })
  dimensiones: string;

  @Column({ name: 'requiere_refrigeracion', type: 'boolean', default: false })
  requiereRefrigeracion: boolean;

  @Column({ name: 'es_activo', type: 'boolean', default: true })
  esActivo: boolean;

  @Column({ name: 'imagen_url', type: 'text', nullable: true })
  imagenUrl: string;

  // Relaciones
  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.productos)
  @JoinColumn({ name: 'proveedor_principal_id' })
  proveedorPrincipal: Proveedor;

  @OneToMany(() => Inventario, (inventario) => inventario.producto)
  inventarios: Inventario[];

  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.producto)
  detallesCompra: DetalleOrdenCompra[];

  @OneToMany(() => DetalleOrdenVenta, (detalle) => detalle.producto)
  detallesVenta: DetalleOrdenVenta[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}