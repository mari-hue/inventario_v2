import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipos } from '../../entities/equipos.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipos)
    private readonly equiposRepository: Repository<Equipos>,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipos> {
    const equipo = this.equiposRepository.create(createEquipoDto);
    return await this.equiposRepository.save(equipo);
  }

  async findAll(): Promise<Equipos[]> {
    return await this.equiposRepository.find({
      relations: [
        'categoria',
        'subcategoria',
        'modalidad_adquisicion',
        'proveedor',
        'licitacion',
        'ubicacion',
      ],
    });
  }

  async findOne(id: number): Promise<Equipos> {
    const equipo = await this.equiposRepository.findOne({
      where: { id },
      relations: [
        'categoria',
        'subcategoria',
        'modalidad_adquisicion',
        'proveedor',
        'licitacion',
        'ubicacion',
      ],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipo;
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto): Promise<Equipos> {
    const equipo = await this.findOne(id);
    Object.assign(equipo, updateEquipoDto);
    return await this.equiposRepository.save(equipo);
  }

  async remove(id: number): Promise<void> {
    const equipo = await this.findOne(id);
    await this.equiposRepository.remove(equipo);
  }

  async findByEstado(estado: string): Promise<Equipos[]> {
    return await this.equiposRepository.find({
      where: { estado },
      relations: [
        'categoria',
        'subcategoria',
        'modalidad_adquisicion',
        'proveedor',
        'licitacion',
        'ubicacion',
      ],
    });
  }

  async findByCategoria(categoriaId: number): Promise<Equipos[]> {
    return await this.equiposRepository.find({
      where: { categoria_id: categoriaId },
      relations: [
        'categoria',
        'subcategoria',
        'modalidad_adquisicion',
        'proveedor',
        'licitacion',
        'ubicacion',
      ],
    });
  }
}