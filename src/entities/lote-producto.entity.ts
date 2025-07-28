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
import { Producto } from './producto.entity';
import { Proveedor } from './proveedor.entity';
import { InventarioLote } from './inventario-lote.entity';

@Entity('lotes_producto')
export class LoteProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'numero_lote', length: 100, unique: true })
  numeroLote: string;

  @Column({ name: 'fecha_fabricacion', type: 'date', nullable: true })
  fechaFabricacion: Date;

  @Column({ name: 'fecha_vencimiento', type: 'date', nullable: true })
  fechaVencimiento: Date;

  @Column({ name: 'cantidad_inicial', type: 'int' })
  cantidadInicial: number;

  @Column({ name: 'cantidad_actual', type: 'int', default: 0 })
  cantidadActual: number;

  @Column({ name: 'costo_unitario', type: 'decimal', precision: 10, scale: 2 })
  costoUnitario: number;

  @Column({ name: 'numero_orden_compra', length: 50, nullable: true })
  numeroOrdenCompra: string;

  @Column({ name: 'certificado_calidad', length: 255, nullable: true })
  certificadoCalidad: string;

  @Column({ name: 'es_activo', type: 'boolean', default: true })
  esActivo: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relaciones
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @OneToMany(() => InventarioLote, (inventarioLote) => inventarioLote.lote)
  inventarios: InventarioLote[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}