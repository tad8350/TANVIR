import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({ description: 'Color name', example: 'Black' })
  @IsString()
  name: string;
}

export class UpdateColorDto {
  @ApiProperty({ description: 'Color name', example: 'Black' })
  @IsString()
  name: string;
}

export class ColorResponseDto {
  @ApiProperty({ description: 'Color ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Color name', example: 'Black' })
  name: string;
} 