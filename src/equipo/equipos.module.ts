import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipos.entity';
import { EquipoService } from './equipos.service';
import { EquipoController } from './equipos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo])], 
  controllers: [EquipoController],
  providers: [EquipoService],
})
export class EquipoModule {}
