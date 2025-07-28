import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  perfil_id: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}