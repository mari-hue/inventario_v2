import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipo } from '../../equipo/entities/equipos.entity';
import { Bodega } from '../../bodega/entities/bodega.entity';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn({ name: 'id_stock' })
  id: number;

 // @ManyToOne(() => Equipo, (producto) => equipo.stock)
  //@JoinColumn({ name: 'id_producto' }) // 👈 importante
  producto: Equipo;

 // @ManyToOne(() => Bodega, (bodega) => bodega.stock)
 // @JoinColumn({ name: 'bodega_id' }) // 👈 importante
  bodega: Bodega;

  @Column()
  cantidad: number;
}
