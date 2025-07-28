import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubicaciones } from '../../entities/ubicaciones.entity';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectRepository(Ubicaciones)
    private readonly ubicacionesRepository: Repository<Ubicaciones>,
  ) {}

  async create(data: Partial<Ubicaciones>): Promise<Ubicaciones> {
    const ubicacion = this.ubicacionesRepository.create(data);
    return await this.ubicacionesRepository.save(ubicacion);
  }

  async findAll(): Promise<Ubicaciones[]> {
    return await this.ubicacionesRepository.find({
      relations: ['bodega', 'ubicacion_padre'],
    });
  }

  async findOne(id: number): Promise<Ubicaciones> {
    const ubicacion = await this.ubicacionesRepository.findOne({
      where: { id },
      relations: ['bodega', 'ubicacion_padre'],
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }

    return ubicacion;
  }

  async findByBodega(bodegaId: number): Promise<Ubicaciones[]> {
    return await this.ubicacionesRepository.find({
      where: { bodega_id: bodegaId },
      relations: ['bodega', 'ubicacion_padre'],
    });
  }

  async update(id: number, data: Partial<Ubicaciones>): Promise<Ubicaciones> {
    const ubicacion = await this.findOne(id);
    Object.assign(ubicacion, data);
    return await this.ubicacionesRepository.save(ubicacion);
  }

  async remove(id: number): Promise<void> {
    const ubicacion = await this.findOne(id);
    await this.ubicacionesRepository.remove(ubicacion);
  }
}