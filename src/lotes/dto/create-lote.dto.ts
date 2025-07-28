import { IsNotEmpty, IsString, IsOptional, IsInt, IsNumber, IsDate, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoteDto {
  @IsNotEmpty({ message: 'El número de lote es obligatorio' })
  @IsString()
  @MaxLength(100)
  numeroLote: string;

  @IsOptional()
  @IsDate({ message: 'La fecha de fabricación debe ser una fecha válida' })
  @Type(() => Date)
  fechaFabricacion?: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha de vencimiento debe ser una fecha válida' })
  @Type(() => Date)
  fechaVencimiento?: Date;

  @IsNotEmpty({ message: 'La cantidad inicial es obligatoria' })
  @IsInt({ message: 'La cantidad inicial debe ser un número entero' })
  @Min(1, { message: 'La cantidad inicial debe ser mayor a 0' })
  cantidadInicial: number;

  @IsNotEmpty({ message: 'El costo unitario es obligatorio' })
  @IsNumber({}, { message: 'El costo unitario debe ser un número válido' })
  @Min(0, { message: 'El costo unitario debe ser mayor o igual a 0' })
  costoUnitario: number;

  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productoId: number;

  @IsOptional()
  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  proveedorId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroOrdenCompra?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  certificadoCalidad?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}