import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { MovimientoInventarioDto, AjusteInventarioDto, TransferenciaInventarioDto } from './dto/movimiento-inventario.dto';

@Controller('inventarios')
export class InventariosController {
  constructor(private readonly inventariosService: InventariosService) {}

  @Get('resumen')
  getResumenInventario() {
    return this.inventariosService.getResumenInventario();
  }

  @Get('bodega/:bodegaId')
  findInventarioPorBodega(@Param('bodegaId', ParseIntPipe) bodegaId: number) {
    return this.inventariosService.findInventarioPorBodega(bodegaId);
  }

  @Get('producto/:productoId')
  findInventarioPorProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.inventariosService.findInventarioPorProducto(productoId);
  }

  @Get('producto/:productoId/bodega/:bodegaId')
  findInventarioProductoBodega(
    @Param('productoId', ParseIntPipe) productoId: number,
    @Param('bodegaId', ParseIntPipe) bodegaId: number,
  ) {
    return this.inventariosService.findInventarioProductoBodega(productoId, bodegaId);
  }

  @Post('movimiento')
  @HttpCode(HttpStatus.CREATED)
  registrarMovimiento(@Body() movimientoDto: MovimientoInventarioDto) {
    return this.inventariosService.registrarMovimiento(movimientoDto);
  }

  @Post('ajuste')
  @HttpCode(HttpStatus.CREATED)
  ajustarInventario(@Body() ajusteDto: AjusteInventarioDto) {
    return this.inventariosService.ajustarInventario(ajusteDto);
  }

  @Post('transferencia')
  @HttpCode(HttpStatus.CREATED)
  transferirInventario(@Body() transferenciaDto: TransferenciaInventarioDto) {
    return this.inventariosService.transferirInventario(transferenciaDto);
  }

  @Get('movimientos')
  getHistorialMovimientos(
    @Query('productoId') productoId?: string,
    @Query('bodegaId') bodegaId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const productoIdNum = productoId ? parseInt(productoId, 10) : undefined;
    const bodegaIdNum = bodegaId ? parseInt(bodegaId, 10) : undefined;
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinDate = fechaFin ? new Date(fechaFin) : undefined;
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.inventariosService.getHistorialMovimientos(
      productoIdNum,
      bodegaIdNum,
      fechaInicioDate,
      fechaFinDate,
      pageNum,
      limitNum,
    );
  }
}