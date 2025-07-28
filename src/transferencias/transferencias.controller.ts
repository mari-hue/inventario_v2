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
import { TransferenciasService } from './transferencias.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';

@Controller('transferencias')
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}

  @Post()
  create(@Body() createTransferenciaDto: CreateTransferenciaDto) {
    return this.transferenciasService.create(createTransferenciaDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('estado') estado?: string,
    @Query('bodegaOrigenId') bodegaOrigenId?: number,
    @Query('bodegaDestinoId') bodegaDestinoId?: number,
  ) {
    return this.transferenciasService.findAll(page, limit, estado, bodegaOrigenId, bodegaDestinoId);
  }

  @Get('pendientes')
  findPendientes() {
    return this.transferenciasService.findPendientes();
  }

  @Get('en-transito')
  findEnTransito() {
    return this.transferenciasService.findEnTransito();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciasService.findOne(+id);
  }

  @Get('numero/:numero')
  findByNumero(@Param('numero') numero: string) {
    return this.transferenciasService.findByNumero(numero);
  }

  @Post(':id/enviar')
  enviar(@Param('id') id: string, @Body() body: { usuarioAutorizaId: number }) {
    return this.transferenciasService.enviar(+id, body.usuarioAutorizaId);
  }

  @Post(':id/recibir')
  recibir(@Param('id') id: string, @Body() body: { usuarioRecibeId: number }) {
    return this.transferenciasService.recibir(+id, body.usuarioRecibeId);
  }

  @Post(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.transferenciasService.cancelar(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferenciaDto: UpdateTransferenciaDto) {
    return this.transferenciasService.update(+id, updateTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciasService.remove(+id);
  }
}