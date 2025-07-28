import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventariosController } from './inventarios.controller';
import { InventariosService } from './inventarios.service';
import { Inventario } from '../entities/inventario.entity';
import { Producto } from '../entities/producto.entity';
import { Bodega } from '../bodega/entities/bodega.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, Producto, Bodega, MovimientoInventario])
  ],
  controllers: [InventariosController],
  providers: [InventariosService],
  exports: [InventariosService]
})
export class InventariosModule {}