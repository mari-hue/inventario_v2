import { IsNotEmpty, IsInt, IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreateTransferenciaDetalleDto {
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productoId: number;

  @IsNotEmpty({ message: 'La cantidad solicitada es obligatoria' })
  @IsInt({ message: 'La cantidad solicitada debe ser un número entero' })
  @Min(1, { message: 'La cantidad solicitada debe ser mayor a 0' })
  cantidadSolicitada: number;

  @IsNotEmpty({ message: 'El costo unitario es obligatorio' })
  @IsNumber({}, { message: 'El costo unitario debe ser un número válido' })
  @Min(0, { message: 'El costo unitario debe ser mayor o igual a 0' })
  costoUnitario: number;

  @IsOptional()
  @IsInt({ message: 'El ID del lote debe ser un número entero' })
  loteId?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class CreateTransferenciaDto {
  @IsNotEmpty({ message: 'El ID de la bodega origen es obligatorio' })
  @IsInt({ message: 'El ID de la bodega origen debe ser un número entero' })
  bodegaOrigenId: number;

  @IsNotEmpty({ message: 'El ID de la bodega destino es obligatorio' })
  @IsInt({ message: 'El ID de la bodega destino debe ser un número entero' })
  bodegaDestinoId: number;

  @IsNotEmpty({ message: 'El ID del usuario que solicita es obligatorio' })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  usuarioSolicitaId: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty({ message: 'Los detalles son obligatorios' })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreateTransferenciaDetalleDto)
  detalles: CreateTransferenciaDetalleDto[];
}