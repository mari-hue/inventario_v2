import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categorias } from './categorias.entity';
import { Subcategorias } from './subcategorias.entity';
import { ModalidadesAdquisicion } from './modalidades-adquisicion.entity';
import { Proveedores } from './proveedores.entity';
import { Licitaciones } from './licitaciones.entity';
import { Ubicaciones } from './ubicaciones.entity';

@Entity('equipos')
export class Equipos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  codigo_interno: string;

  @Column({ type: 'varchar', nullable: true })
  tipo_equipo: string;

  @Column({ type: 'varchar', nullable: true })
  marca: string;

  @Column({ type: 'varchar', nullable: true })
  modelo: string;

  @Column({ type: 'varchar', nullable: true })
  numero_serie: string;

  @Column({ type: 'varchar', nullable: true })
  ram: string;

  @Column({ type: 'varchar', nullable: true })
  disco: string;

  @Column({ type: 'varchar', nullable: true })
  procesador: string;

  @Column({ type: 'int', nullable: true })
  categoria_id: number;

  @Column({ type: 'int', nullable: true })
  subcategoria_id: number;

  @Column({ type: 'int', nullable: true })
  modalidad_adquisicion_id: number;

  @Column({ type: 'int', nullable: true })
  proveedor_id: number;

  @Column({ type: 'int', nullable: true })
  licitacion_id: number;

  @Column({ type: 'int', nullable: true })
  ubicacion_id: number;

  @Column({ type: 'varchar', nullable: true })
  estado: string;

  @Column({ type: 'date', nullable: true })
  fecha_ingreso: Date;

  @Column({ type: 'date', nullable: true })
  fecha_baja: Date;

  @Column({ type: 'varchar', nullable: true })
  motivo_baja: string;

  @Column({ type: 'boolean', default: false })
  es_temporal: boolean;

  @Column({ type: 'text', nullable: true })
  nota: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Categorias)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categorias;

  @ManyToOne(() => Subcategorias)
  @JoinColumn({ name: 'subcategoria_id' })
  subcategoria: Subcategorias;

  @ManyToOne(() => ModalidadesAdquisicion)
  @JoinColumn({ name: 'modalidad_adquisicion_id' })
  modalidad_adquisicion: ModalidadesAdquisicion;

  @ManyToOne(() => Proveedores)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedores;

  @ManyToOne(() => Licitaciones)
  @JoinColumn({ name: 'licitacion_id' })
  licitacion: Licitaciones;

  @ManyToOne(() => Ubicaciones, { nullable: true })
  @JoinColumn({ name: 'ubicacion_id' })
  ubicacion: Ubicaciones;
}