import { Controller, Get, Param, Post } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { Persona } from './entities/persona.entity';

@Controller('persona')
export class PersonaController {
  constructor(private readonly service: PersonaService) {}

  // GET /persona/ad/12345678-9  → trae info desde AD, sin guardar
  @Get('ad/:rut')
  async buscarEnAd(@Param('rut') rut: string): Promise<Partial<Persona>> {
    const personas = await this.service.importarDesdeAd(rut);
    return personas[0] || {};
  }

  // POST /persona/ad/12345678-9 → importa y guarda la persona
  @Post('ad/:rut')
  async importarYGuardar(@Param('rut') rut: string): Promise<Persona> {
    return this.service.crearDesdeAd(rut);
  }
}
