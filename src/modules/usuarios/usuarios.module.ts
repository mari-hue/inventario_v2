import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from '../../entities/usuarios.entity';
import { Perfiles } from '../../entities/perfiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios, Perfiles])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}