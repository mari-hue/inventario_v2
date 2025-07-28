import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, MaxLength, IsEmail } from 'class-validator';

export class CreateUbicacionDto {
  @IsNotEmpty({ message: 'El código de ubicación es obligatorio' })
  @IsString()
  @MaxLength(20)
  codigoUbicacion: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  pais?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigoPostal?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un número válido' })
  latitud?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un número válido' })
  longitud?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  zonaHoraria?: string;

  @IsOptional()
  @IsBoolean()
  esActiva?: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;
}