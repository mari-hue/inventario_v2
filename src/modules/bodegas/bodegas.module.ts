import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegasController } from './bodegas.controller';
import { BodegasService } from './bodegas.service';
import { UbicacionesController } from './ubicaciones.controller';
import { UbicacionesService } from './ubicaciones.service';
import { Bodegas } from '../../entities/bodegas.entity';
import { Ubicaciones } from '../../entities/ubicaciones.entity';
import { Usuarios } from '../../entities/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bodegas, Ubicaciones, Usuarios])],
  controllers: [BodegasController, UbicacionesController],
  providers: [BodegasService, UbicacionesService],
  exports: [BodegasService, UbicacionesService],
})
export class BodegasModule {}