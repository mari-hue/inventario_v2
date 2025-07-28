// src/ldap/ldap.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LdapService } from './ldap.service';
import { MockLdapService } from './ldap.mock';

// ← Mientras esperas tu cuenta de servicio en AD, mantén esto a `true`
const USE_MOCK = true;

@Module({
  imports: [
    ConfigModule,  // para inyectar tus vars de entorno AD_*
  ],
  providers: [
    {
      provide: LdapService,
      // si USE_MOCK es true, inyectamos el mock; si no, el LdapService real
      useClass: USE_MOCK ? MockLdapService : LdapService,
    },
  ],
  exports: [
    LdapService,   // así lo pueden usar PersonaModule, etc.
  ],
})
export class LdapModule {}
