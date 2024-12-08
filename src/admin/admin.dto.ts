import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty} from 'class-validator';

export class AdminDTO {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly profilePic: string;

}
