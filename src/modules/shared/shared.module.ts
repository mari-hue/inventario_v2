import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuraciones } from '../../entities/configuraciones.entity';
import { Auditoria } from '../../entities/auditoria.entity';
import { LogsSistema } from '../../entities/logs-sistema.entity';
import { Perfiles } from '../../entities/perfiles.entity';
import { ConfiguracionesService } from './services/configuraciones.service';
import { AuditoriaService } from './services/auditoria.service';
import { LogsSistemaService } from './services/logs-sistema.service';
import { PerfilesService } from './services/perfiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Configuraciones,
      Auditoria,
      LogsSistema,
      Perfiles,
    ]),
  ],
  providers: [
    ConfiguracionesService,
    AuditoriaService,
    LogsSistemaService,
    PerfilesService,
  ],
  exports: [
    ConfiguracionesService,
    AuditoriaService,
    LogsSistemaService,
    PerfilesService,
  ],
})
export class SharedModule {}