import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateEquipoDto {
  @IsOptional()
  @IsString()
  codigo_interno?: string;

  @IsOptional()
  @IsString()
  tipo_equipo?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  numero_serie?: string;

  @IsOptional()
  @IsString()
  ram?: string;

  @IsOptional()
  @IsString()
  disco?: string;

  @IsOptional()
  @IsString()
  procesador?: string;

  @IsOptional()
  @IsNumber()
  categoria_id?: number;

  @IsOptional()
  @IsNumber()
  subcategoria_id?: number;

  @IsOptional()
  @IsNumber()
  modalidad_adquisicion_id?: number;

  @IsOptional()
  @IsNumber()
  proveedor_id?: number;

  @IsOptional()
  @IsNumber()
  licitacion_id?: number;

  @IsOptional()
  @IsNumber()
  ubicacion_id?: number;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDateString()
  fecha_ingreso?: string;

  @IsOptional()
  @IsDateString()
  fecha_baja?: string;

  @IsOptional()
  @IsString()
  motivo_baja?: string;

  @IsOptional()
  @IsBoolean()
  es_temporal?: boolean;

  @IsOptional()
  @IsString()
  nota?: string;
}