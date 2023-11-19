import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// SHARED
import { ListDto } from '@/shared/dtos/common.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value && value.trim())
  password: string;
}

export class ListUserDto extends ListDto {}

export class UploadAvatarDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  file: string[];
}

export class UploadImagesDto {
  @ApiProperty({
    required: false,
    type: 'array',
    // format: 'binary',
    description: 'File to upload',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images: string[];
}
