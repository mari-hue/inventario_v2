import { IsEmail, IsBoolean, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @Length(2, 100)
  nombre: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsInt()
  perfil_id: number;

  @IsInt()
  persona_id: number;
}
