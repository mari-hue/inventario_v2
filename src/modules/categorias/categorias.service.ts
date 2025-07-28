import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorias } from '../../entities/categorias.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categorias)
    private readonly categoriasRepository: Repository<Categorias>,
  ) {}

  async create(nombre: string): Promise<Categorias> {
    const categoria = this.categoriasRepository.create({ nombre });
    return await this.categoriasRepository.save(categoria);
  }

  async findAll(): Promise<Categorias[]> {
    return await this.categoriasRepository.find();
  }

  async findOne(id: number): Promise<Categorias> {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async update(id: number, nombre: string): Promise<Categorias> {
    const categoria = await this.findOne(id);
    categoria.nombre = nombre;
    return await this.categoriasRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriasRepository.remove(categoria);
  }
}