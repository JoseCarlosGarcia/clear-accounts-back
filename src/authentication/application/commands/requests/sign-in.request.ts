import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
