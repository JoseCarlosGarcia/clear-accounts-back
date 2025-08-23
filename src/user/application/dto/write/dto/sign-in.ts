import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail({ host_blacklist: [] })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
