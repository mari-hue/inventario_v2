import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('productoId') productoId?: number,
  ) {
    return this.lotesService.findAll(page, limit, search, productoId);
  }

  @Get('activos')
  findActivos() {
    return this.lotesService.findActivos();
  }

  @Get('vencen-pronto')
  findVencenPronto(@Query('dias') dias = 30) {
    return this.lotesService.findVencenPronto(dias);
  }

  @Get('vencidos')
  findVencidos() {
    return this.lotesService.findVencidos();
  }

  @Get('producto/:productoId')
  findByProducto(@Param('productoId') productoId: string) {
    return this.lotesService.findByProducto(+productoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotesService.findOne(+id);
  }

  @Get('numero/:numeroLote')
  findByNumero(@Param('numeroLote') numeroLote: string) {
    return this.lotesService.findByNumero(numeroLote);
  }

  @Get(':id/inventario')
  findInventarioLote(@Param('id') id: string) {
    return this.lotesService.findInventarioLote(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoteDto: UpdateLoteDto) {
    return this.lotesService.update(+id, updateLoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotesService.remove(+id);
  }
}