import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_movimiento', length: 50 })
  tipoMovimiento: string; // entrada, salida, transferencia, ajuste

  @Column({ name: 'subtipo_movimiento', length: 50, nullable: true })
  subtipoMovimiento: string; // compra, venta, devolucion, merma, transferencia_entrada, transferencia_salida

  @Column({ name: 'numero_documento', length: 50, nullable: true })
  numeroDocumento: string;

  @Column({ name: 'cantidad_anterior', type: 'int' })
  cantidadAnterior: number;

  @Column({ name: 'cantidad_movimiento', type: 'int' })
  cantidadMovimiento: number;

  @Column({ name: 'cantidad_nueva', type: 'int' })
  cantidadNueva: number;

  @Column({ name: 'costo_unitario', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costoUnitario: number;

  @Column({ name: 'costo_total', type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoTotal: number;

  @Column({ name: 'motivo', type: 'text', nullable: true })
  motivo: string;

  @Column({ name: 'usuario_id', type: 'int', nullable: true })
  usuarioId: number;

  @Column({ name: 'orden_compra_id', type: 'int', nullable: true })
  ordenCompraId: number;

  @Column({ name: 'orden_venta_id', type: 'int', nullable: true })
  ordenVentaId: number;

  @Column({ name: 'transferencia_id', type: 'int', nullable: true })
  transferenciaId: number;

  @Column({ name: 'bodega_destino_id', type: 'int', nullable: true })
  bodegaDestinoId: number;

  // Relaciones
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Bodega)
  @JoinColumn({ name: 'bodega_id' })
  bodega: Bodega;

  @ManyToOne(() => Bodega)
  @JoinColumn({ name: 'bodega_destino_id' })
  bodegaDestino: Bodega;

  @CreateDateColumn({ name: 'fecha_movimiento', type: 'timestamp' })
  fechaMovimiento: Date;
}