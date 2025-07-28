import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perfil } from './entities/perfil.entity';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
  ) {}

  create(dto: CreatePerfilDto) {
    return this.perfilRepository.save(dto);
  }

  findAll() {
    return this.perfilRepository.find();
  }

  findOne(id: number) {
    return this.perfilRepository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdatePerfilDto) {
    return this.perfilRepository.update(id, dto);
  }

  remove(id: number) {
    return this.perfilRepository.delete(id);
  }
}
