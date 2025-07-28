import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Ubicacion } from '../entities/ubicacion.entity';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
  ) {}

  async create(createUbicacionDto: CreateUbicacionDto): Promise<Ubicacion> {
    try {
      const ubicacion = this.ubicacionRepository.create(createUbicacionDto);
      return await this.ubicacionRepository.save(ubicacion);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El código de ubicación ya existe');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.ubicacionRepository
      .createQueryBuilder('ubicacion')
      .leftJoinAndSelect('ubicacion.bodegas', 'bodegas');

    if (search) {
      queryBuilder.where(
        'ubicacion.nombre ILIKE :search OR ubicacion.codigoUbicacion ILIKE :search OR ubicacion.ciudad ILIKE :search',
        { search: `%${search}%` }
      );
    }

    const [ubicaciones, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('ubicacion.nombre', 'ASC')
      .getManyAndCount();

    return {
      data: ubicaciones,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActivas(): Promise<Ubicacion[]> {
    return this.ubicacionRepository.find({
      where: { esActiva: true },
      relations: ['bodegas'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionRepository.findOne({
      where: { id },
      relations: ['bodegas'],
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${id} no encontrada`);
    }

    return ubicacion;
  }

  async findByCodigo(codigo: string): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionRepository.findOne({
      where: { codigoUbicacion: codigo },
      relations: ['bodegas'],
    });

    if (!ubicacion) {
      throw new NotFoundException(`Ubicación con código ${codigo} no encontrada`);
    }

    return ubicacion;
  }

  async update(id: number, updateUbicacionDto: UpdateUbicacionDto): Promise<Ubicacion> {
    const ubicacion = await this.findOne(id);
    
    try {
      Object.assign(ubicacion, updateUbicacionDto);
      return await this.ubicacionRepository.save(ubicacion);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El código de ubicación ya existe');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const ubicacion = await this.findOne(id);
    ubicacion.esActiva = false;
    await this.ubicacionRepository.save(ubicacion);
  }
}