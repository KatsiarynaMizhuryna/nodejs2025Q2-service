import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class LoginDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  refreshToken: string;
}
