import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from '../entities/producto.entity';
import { Categoria } from '../entities/categoria.entity';
import { Inventario } from '../entities/inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria, Inventario])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService]
})
export class ProductosModule {}