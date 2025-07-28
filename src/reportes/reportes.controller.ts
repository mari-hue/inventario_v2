import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('inventario-general')
  getInventarioGeneral() {
    return this.reportesService.getInventarioGeneral();
  }

  @Get('productos-bajo-stock')
  getProductosBajoStock() {
    return this.reportesService.getProductosBajoStock();
  }

  @Get('productos-sin-movimiento')
  getProductosSinMovimiento(@Query('dias') dias = 90) {
    return this.reportesService.getProductosSinMovimiento(dias);
  }

  @Get('lotes-vencen-pronto')
  getLotesVencenPronto(@Query('dias') dias = 30) {
    return this.reportesService.getLotesVencenPronto(dias);
  }

  @Get('lotes-vencidos')
  getLotesVencidos() {
    return this.reportesService.getLotesVencidos();
  }

  @Get('valoracion-inventario')
  getValoracionInventario(@Query('bodegaId') bodegaId?: number) {
    return this.reportesService.getValoracionInventario(bodegaId);
  }

  @Get('movimientos-periodo')
  getMovimientosPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('bodegaId') bodegaId?: number,
  ) {
    return this.reportesService.getMovimientosPeriodo(
      new Date(fechaInicio),
      new Date(fechaFin),
      bodegaId,
    );
  }

  @Get('dashboard')
  getDashboard() {
    return this.reportesService.getDashboard();
  }

  @Get('inventario-por-categoria')
  getInventarioPorCategoria() {
    return this.reportesService.getInventarioPorCategoria();
  }

  @Get('inventario-por-bodega')
  getInventarioPorBodega() {
    return this.reportesService.getInventarioPorBodega();
  }
}