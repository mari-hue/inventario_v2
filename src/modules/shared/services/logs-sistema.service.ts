import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsSistema } from '../../../entities/logs-sistema.entity';

@Injectable()
export class LogsSistemaService {
  constructor(
    @InjectRepository(LogsSistema)
    private readonly logsRepository: Repository<LogsSistema>,
  ) {}

  async registrarLog(
    usuarioId: number | null,
    accion: string,
    ipOrigen?: string,
  ): Promise<LogsSistema> {
    const log = this.logsRepository.create({
      usuario_id: usuarioId,
      accion,
      fecha: new Date(),
      ip_origen: ipOrigen,
    });

    return await this.logsRepository.save(log);
  }

  async obtenerLogsPorUsuario(usuarioId: number): Promise<LogsSistema[]> {
    return await this.logsRepository.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async obtenerLogsRecientes(limite: number = 100): Promise<LogsSistema[]> {
    return await this.logsRepository.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' },
      take: limite,
    });
  }
}