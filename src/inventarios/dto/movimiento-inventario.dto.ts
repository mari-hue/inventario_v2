import { IsString, IsNumber, IsOptional, IsPositive, IsIn } from 'class-validator';

export class MovimientoInventarioDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  bodegaId: number;

  @IsString()
  @IsIn(['entrada', 'salida', 'transferencia', 'ajuste'])
  tipoMovimiento: string;

  @IsOptional()
  @IsString()
  subtipoMovimiento?: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  costoUnitario?: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  numeroDocumento?: string;

  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @IsOptional()
  @IsNumber()
  bodegaDestinoId?: number; // Para transferencias

  @IsOptional()
  @IsNumber()
  ordenCompraId?: number;

  @IsOptional()
  @IsNumber()
  ordenVentaId?: number;
}

export class AjusteInventarioDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  bodegaId: number;

  @IsNumber()
  cantidadNueva: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsNumber()
  usuarioId?: number;
}

export class TransferenciaInventarioDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  bodegaOrigenId: number;

  @IsNumber()
  bodegaDestinoId: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsNumber()
  usuarioId?: number;
}