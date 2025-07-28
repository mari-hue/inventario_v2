import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesController } from './lotes.controller';
import { LotesService } from './lotes.service';
import { LoteProducto } from '../entities/lote-producto.entity';
import { InventarioLote } from '../entities/inventario-lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoteProducto, InventarioLote])],
  controllers: [LotesController],
  providers: [LotesService],
  exports: [LotesService],
})
export class LotesModule {}