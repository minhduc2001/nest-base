import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  username: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  password: string;
}
