import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bodegas } from '../../entities/bodegas.entity';

@Injectable()
export class BodegasService {
  constructor(
    @InjectRepository(Bodegas)
    private readonly bodegasRepository: Repository<Bodegas>,
  ) {}

  async create(data: Partial<Bodegas>): Promise<Bodegas> {
    const bodega = this.bodegasRepository.create(data);
    return await this.bodegasRepository.save(bodega);
  }

  async findAll(): Promise<Bodegas[]> {
    return await this.bodegasRepository.find({
      relations: ['responsable'],
    });
  }

  async findOne(id: number): Promise<Bodegas> {
    const bodega = await this.bodegasRepository.findOne({
      where: { id },
      relations: ['responsable'],
    });

    if (!bodega) {
      throw new NotFoundException(`Bodega con ID ${id} no encontrada`);
    }

    return bodega;
  }

  async update(id: number, data: Partial<Bodegas>): Promise<Bodegas> {
    const bodega = await this.findOne(id);
    Object.assign(bodega, data);
    return await this.bodegasRepository.save(bodega);
  }

  async remove(id: number): Promise<void> {
    const bodega = await this.findOne(id);
    await this.bodegasRepository.remove(bodega);
  }
}