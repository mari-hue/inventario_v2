import { IsString, IsOptional, IsNotEmpty, IsDate, IsNumber, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEquipoDto {
  @IsString()
  @IsNotEmpty({ message: 'El modelo es obligatorio.' })
  @Length(1, 100)
  modelo: string;

  @IsString()
  @IsNotEmpty({ message: 'La marca es obligatoria.' })
  @Length(1, 100)
  marca: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de serie es obligatorio.' })
  @Length(1, 50)
  serie_id: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  estado?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de ingreso debe ser una fecha válida.' })
  fecha_ingreso?: Date;

  @IsNumber({}, { message: 'El tipo de producto debe ser un número.' })
  id_tipo_producto: number;
}
