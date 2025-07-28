import { Injectable } from '@nestjs/common';
import { LdapService } from '../ldap/ldap.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  constructor(
    private readonly ldap: LdapService,
    @InjectRepository(Persona)
    private readonly repo: Repository<Persona>,
  ) {}

  // 1) Traer datos desde AD
  async importarDesdeAd(rut: string): Promise<Persona[]> {
    // Ajusta el filtro según tu esquema, por ejemplo (sAMAccountName=rut)
    const filter = `(sAMAccountName=${rut})`;
    const attrs = ['cn', 'mail', 'telephoneNumber', 'streetAddress'];
    const resultados = await this.ldap.search(filter, attrs);
    // Mapear a tu entidad Persona
    return resultados.map(obj => {
      const p = new Persona();
      p.nombre = obj.cn;
      p.email = obj.mail;
      p.telefono = obj.telephoneNumber;
      p.direccion = obj.streetAddress;
      return p;
    });
  }

  // 2) Guardar en tu BD
  async crearDesdeAd(rut: string): Promise<Persona> {
    const [personaAd] = await this.importarDesdeAd(rut);
    // Opcional: controla duplicados antes de insertar
    return this.repo.save(personaAd);
  }
}
