import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { StringToArray } from '@base/decorators/common.decorator';

export class ListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  sortBy?: [string, string][];

  @ApiProperty({ required: false })
  @IsOptional()
  @StringToArray()
  searchBy?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, type: 'text' })
  @IsOptional()
  filter?: { [column: string]: string | string[] };

  @ApiProperty({ required: false })
  @IsOptional()
  select?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  path: string;
}
