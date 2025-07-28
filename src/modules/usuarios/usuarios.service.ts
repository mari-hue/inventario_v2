import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../../entities/usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    const usuario = this.usuariosRepository.create(createUsuarioDto);
    return await this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuarios[]> {
    return await this.usuariosRepository.find({
      relations: ['perfil'],
    });
  }

  async findOne(id: number): Promise<Usuarios> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['perfil'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuarios> {
    const usuario = await this.findOne(id);
    Object.assign(usuario, updateUsuarioDto);
    return await this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.remove(usuario);
  }

  async findByPerfil(perfilId: number): Promise<Usuarios[]> {
    return await this.usuariosRepository.find({
      where: { perfil_id: perfilId },
      relations: ['perfil'],
    });
  }

  async findByEmail(email: string): Promise<Usuarios | null> {
    return await this.usuariosRepository.findOne({
      where: { email },
      relations: ['perfil'],
    });
  }
}