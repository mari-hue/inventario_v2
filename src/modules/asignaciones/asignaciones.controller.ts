import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Post()
  create(@Body() createAsignacionDto: CreateAsignacionDto) {
    return this.asignacionesService.create(createAsignacionDto);
  }

  @Get()
  findAll(
    @Query('usuario') usuario?: string,
    @Query('equipo') equipo?: string,
  ) {
    if (usuario) {
      return this.asignacionesService.findByUsuario(parseInt(usuario));
    }
    if (equipo) {
      return this.asignacionesService.findByEquipo(parseInt(equipo));
    }
    return this.asignacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAsignacionDto: UpdateAsignacionDto,
  ) {
    return this.asignacionesService.update(id, updateAsignacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.remove(id);
  }
}