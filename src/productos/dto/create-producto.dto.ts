import { IsString, IsNumber, IsOptional, IsBoolean, IsPositive, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  codigoProducto: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  precioCosto: number;

  @IsNumber()
  @IsPositive()
  precioVenta: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMaximo?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  puntoReorden?: number = 0;

  @IsOptional()
  @IsString()
  unidadMedida?: string = 'unidad';

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pesoKg?: number;

  @IsOptional()
  @IsString()
  dimensiones?: string;

  @IsOptional()
  @IsBoolean()
  requiereRefrigeracion?: boolean = false;

  @IsOptional()
  @IsBoolean()
  esActivo?: boolean = true;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsNumber()
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  proveedorPrincipalId?: number;
}