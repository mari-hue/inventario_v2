import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionesController } from './asignaciones.controller';
import { AsignacionesService } from './asignaciones.service';
import { Asignaciones } from '../../entities/asignaciones.entity';
import { Equipos } from '../../entities/equipos.entity';
import { Usuarios } from '../../entities/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asignaciones, Equipos, Usuarios])],
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  exports: [AsignacionesService],
})
export class AsignacionesModule {}