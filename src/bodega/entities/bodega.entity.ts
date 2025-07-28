import { Entity,PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Persona } from '../../persona/entities/persona.entity';
import { Stock } from '../../stock/entities/stock.entity';
import { RegistroProducto } from '../../registro-producto/entities/registro-producto.entity';
import { Inventario } from '../../entities/inventario.entity';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Ubicacion } from '../../entities/ubicacion.entity';

@Entity('bodegas')
export class Bodega {
  @PrimaryGeneratedColumn({ name: 'id_bodega' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ name: 'telefono_contacto', length: 20, nullable: true })
  telefonoContacto: string;

  @Column({ name: 'codigo_bodega', length: 20, unique: true, nullable: true })
  codigoBodega: string;

  @Column({ name: 'tipo_bodega', length: 50, default: 'general' })
  tipoBodega: string; // general, refrigerada, especial

  @Column({ name: 'capacidad_maxima', type: 'int', nullable: true })
  capacidadMaxima: number;

  @Column({ name: 'es_activa', type: 'boolean', default: true })
  esActiva: boolean;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Relación con Persona (encargado)
  @ManyToOne(() => Persona, (persona) => persona.bodegasEncargadas)
  @JoinColumn({ name: 'encargado_id' })
  encargado: Persona;

  // Relación con Ubicacion
  @ManyToOne(() => Ubicacion, (ubicacion) => ubicacion.bodegas)
  @JoinColumn({ name: 'ubicacion_id' })
  ubicacion: Ubicacion;

  // Relación con Stock
  @OneToMany(() => Stock, (stock) => stock.bodega)
  stock: Stock[];

  // Relación con RegistroProducto (origen del movimiento)
  @OneToMany(() => RegistroProducto, (registro) => registro.bodegaOrigen)
  registros: RegistroProducto[];

  // Nuevas relaciones para el sistema de inventario
  @OneToMany(() => Inventario, (inventario) => inventario.bodega)
  inventarios: Inventario[];

  @OneToMany(() => MovimientoInventario, (movimiento) => movimiento.bodega)
  movimientos: MovimientoInventario[];

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'timestamp' })
  fechaActualizacion: Date;
}
