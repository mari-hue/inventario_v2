import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuraciones } from '../../../entities/configuraciones.entity';

@Injectable()
export class ConfiguracionesService {
  constructor(
    @InjectRepository(Configuraciones)
    private readonly configuracionesRepository: Repository<Configuraciones>,
  ) {}

  async obtenerConfiguracion(clave: string): Promise<string | null> {
    const config = await this.configuracionesRepository.findOne({
      where: { clave },
    });
    return config ? config.valor : null;
  }

  async establecerConfiguracion(
    clave: string,
    valor: string,
    descripcion?: string,
  ): Promise<Configuraciones> {
    let config = await this.configuracionesRepository.findOne({
      where: { clave },
    });

    if (config) {
      config.valor = valor;
      if (descripcion) config.descripcion = descripcion;
    } else {
      config = this.configuracionesRepository.create({
        clave,
        valor,
        descripcion,
      });
    }

    return await this.configuracionesRepository.save(config);
  }

  async obtenerTodasConfiguraciones(): Promise<Configuraciones[]> {
    return await this.configuracionesRepository.find();
  }
}