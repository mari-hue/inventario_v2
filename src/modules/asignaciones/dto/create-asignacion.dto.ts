import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAsignacionDto {
  @IsNotEmpty()
  @IsNumber()
  equipo_id: number;

  @IsNotEmpty()
  @IsNumber()
  usuario_id: number;

  @IsNotEmpty()
  @IsNumber()
  responsable_id: number;

  @IsNotEmpty()
  @IsString()
  tipo_asignacion: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_asignacion: string;

  @IsOptional()
  @IsDateString()
  fecha_devolucion?: string;
}