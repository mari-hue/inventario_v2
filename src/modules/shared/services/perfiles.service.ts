import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perfiles } from '../../../entities/perfiles.entity';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfiles)
    private readonly perfilesRepository: Repository<Perfiles>,
  ) {}

  async create(nombre: string, permisos?: string): Promise<Perfiles> {
    const perfil = this.perfilesRepository.create({ nombre, permisos });
    return await this.perfilesRepository.save(perfil);
  }

  async findAll(): Promise<Perfiles[]> {
    return await this.perfilesRepository.find();
  }

  async findOne(id: number): Promise<Perfiles> {
    const perfil = await this.perfilesRepository.findOne({ where: { id } });
    if (!perfil) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
    return perfil;
  }

  async update(id: number, nombre?: string, permisos?: string): Promise<Perfiles> {
    const perfil = await this.findOne(id);
    if (nombre) perfil.nombre = nombre;
    if (permisos) perfil.permisos = permisos;
    return await this.perfilesRepository.save(perfil);
  }

  async remove(id: number): Promise<void> {
    const perfil = await this.findOne(id);
    await this.perfilesRepository.remove(perfil);
  }
}