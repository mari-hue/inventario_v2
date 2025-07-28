import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignaciones } from '../../entities/asignaciones.entity';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignaciones)
    private readonly asignacionesRepository: Repository<Asignaciones>,
  ) {}

  async create(createAsignacionDto: CreateAsignacionDto): Promise<Asignaciones> {
    const asignacion = this.asignacionesRepository.create(createAsignacionDto);
    return await this.asignacionesRepository.save(asignacion);
  }

  async findAll(): Promise<Asignaciones[]> {
    return await this.asignacionesRepository.find({
      relations: ['equipo', 'usuario', 'responsable'],
    });
  }

  async findOne(id: number): Promise<Asignaciones> {
    const asignacion = await this.asignacionesRepository.findOne({
      where: { id },
      relations: ['equipo', 'usuario', 'responsable'],
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }

  async update(id: number, updateAsignacionDto: UpdateAsignacionDto): Promise<Asignaciones> {
    const asignacion = await this.findOne(id);
    Object.assign(asignacion, updateAsignacionDto);
    return await this.asignacionesRepository.save(asignacion);
  }

  async remove(id: number): Promise<void> {
    const asignacion = await this.findOne(id);
    await this.asignacionesRepository.remove(asignacion);
  }

  async findByUsuario(usuarioId: number): Promise<Asignaciones[]> {
    return await this.asignacionesRepository.find({
      where: { usuario_id: usuarioId },
      relations: ['equipo', 'usuario', 'responsable'],
    });
  }

  async findByEquipo(equipoId: number): Promise<Asignaciones[]> {
    return await this.asignacionesRepository.find({
      where: { equipo_id: equipoId },
      relations: ['equipo', 'usuario', 'responsable'],
    });
  }
}