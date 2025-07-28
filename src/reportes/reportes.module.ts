import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Producto } from '../entities/producto.entity';
import { Inventario } from '../entities/inventario.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { LoteProducto } from '../entities/lote-producto.entity';
import { InventarioLote } from '../entities/inventario-lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Producto, 
    Inventario, 
    MovimientoInventario, 
    LoteProducto, 
    InventarioLote
  ])],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}