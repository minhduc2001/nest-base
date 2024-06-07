import { Trim } from '@/base/decorators/common.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsString({
    message: i18nValidationMessage('validation.is_string', {
      name: 'username',
    }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.is_required', {
      name: 'username',
    }),
  })
  @Trim()
  @ApiProperty({ example: 'admin' })
  username: string;

  @IsString({
    message: i18nValidationMessage('validation.is_string', {
      name: 'password',
    }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.is_required', {
      name: 'password',
    }),
  })
  @ApiPropertyOptional({ example: '123123' })
  password: string;
}
