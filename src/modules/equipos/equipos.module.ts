import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';
import { Equipos } from '../../entities/equipos.entity';
import { Categorias } from '../../entities/categorias.entity';
import { Subcategorias } from '../../entities/subcategorias.entity';
import { ModalidadesAdquisicion } from '../../entities/modalidades-adquisicion.entity';
import { Proveedores } from '../../entities/proveedores.entity';
import { Licitaciones } from '../../entities/licitaciones.entity';
import { Ubicaciones } from '../../entities/ubicaciones.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Equipos,
      Categorias,
      Subcategorias,
      ModalidadesAdquisicion,
      Proveedores,
      Licitaciones,
      Ubicaciones,
    ]),
  ],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule {}