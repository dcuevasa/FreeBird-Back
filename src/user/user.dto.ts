

import { IsNotEmpty,  IsString, IsStrongPassword, Length } from "class-validator";

export class UserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15) // Ejemplo: para un número de teléfono válido.
  phone: string;

  @IsNotEmpty()
  @IsString()
  profilePic: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}