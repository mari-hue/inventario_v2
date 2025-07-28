import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from '../../../entities/auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async registrarAccion(
    usuarioId: number,
    accion: string,
    entidad: string,
    entidadId: number,
    detalle?: string,
  ): Promise<Auditoria> {
    const registro = this.auditoriaRepository.create({
      usuario_id: usuarioId,
      accion,
      entidad,
      entidad_id: entidadId,
      detalle,
      fecha: new Date(),
    });

    return await this.auditoriaRepository.save(registro);
  }

  async obtenerAuditoriaPorEntidad(
    entidad: string,
    entidadId?: number,
  ): Promise<Auditoria[]> {
    const where: any = { entidad };
    if (entidadId) {
      where.entidad_id = entidadId;
    }

    return await this.auditoriaRepository.find({
      where,
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async obtenerAuditoriaPorUsuario(usuarioId: number): Promise<Auditoria[]> {
    return await this.auditoriaRepository.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }
}