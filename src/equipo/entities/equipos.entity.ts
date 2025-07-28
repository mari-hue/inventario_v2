import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/*
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Subcategoria } from '../../subcategorias/entities/subcategoria.entity';
import { ModalidadAdquisicion } from '../../modalidades-adquisicion/entities/modalidad-adquisicion.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Licitacion } from '../../licitaciones/entities/licitacion.entity';
import { Ubicacion } from '../../ubicaciones/entities/ubicacion.entity';
*/

@Entity({ name: 'equipos' })
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_interno', length: 255, nullable: true })
  codigoInterno: string;

  @Column({ name: 'tipo_equipo', length: 255, nullable: true })
  tipoEquipo: string;

  @Column({ length: 255, nullable: true })
  marca: string;

  @Column({ length: 255, nullable: true })
  modelo: string;

  @Column({ name: 'numero_serie', length: 255, nullable: true, unique: true })
  numeroSerie: string;

  @Column({ length: 255, nullable: true })
  ram: string;

  @Column({ length: 255, nullable: true })
  disco: string;

  @Column({ length: 255, nullable: true })
  procesador: string;

  @Column({ length: 255, nullable: true })
  estado: string;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fechaIngreso: Date;

  @Column({ name: 'fecha_baja', type: 'date', nullable: true })
  fechaBaja: Date;

  @Column({ name: 'motivo_baja', length: 255, nullable: true })
  motivoBaja: string;

  @Column({ name: 'es_temporal', type: 'boolean', default: false })
  esTemporal: boolean;

  @Column({ type: 'text', nullable: true })
  nota: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
