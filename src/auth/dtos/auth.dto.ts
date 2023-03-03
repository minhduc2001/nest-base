import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'username không được để trống' })
  @Transform(({ value }) => value && value.trim())
  @IsString()
  // @MinLength(1, { message: 'username không ít hơn 1 ký tự' })
  // @MaxLength(30, { message: 'username không quá 30 ký tự' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'USER011101' })
  @IsString()
  // @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  // @MaxLength(30, { message: 'password không quá 30 ký tự' })
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'email không được để trống' })
  @Transform(({ value }) => value && value.trim())
  @IsString()
  // @MinLength(1, { message: 'email không ít hơn 1 ký tự' })
  // @MaxLength(30, { message: 'email không quá 30 ký tự' })
  email: string;
}
