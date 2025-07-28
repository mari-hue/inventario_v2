// src/persona/persona.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persona } from './entities/persona.entity';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';

//  ← importa tu módulo LDAP
import { LdapModule } from '../ldap/ldap.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Persona]),
    LdapModule,       // ← aquí
  ],
  providers: [PersonaService],
  controllers: [PersonaController],
})
export class PersonaModule {}
