// src/ldap/ldap.mock.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockLdapService {
  /**
   * Simula una búsqueda en AD y devuelve siempre un usuario de ejemplo
   */
  async search(filter: string, attributes: string[] = []): Promise<any[]> {
    console.log('🔥 MockLdapService.search invoked', { filter, attributes });
    return [
      {
        cn: 'Juan ',
        ap: 'Pérez',
        mail: 'juan.perez@ejemplo.com',
        telephoneNumber: '+56912345678',
        streetAddress: 'Av. Siempre Viva 742',
      },
    ];
  }
}
