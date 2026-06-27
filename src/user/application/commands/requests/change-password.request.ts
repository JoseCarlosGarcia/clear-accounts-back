import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}