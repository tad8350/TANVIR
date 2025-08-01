import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty({ description: 'Size name', example: '42' })
  @IsString()
  name: string;
}

export class UpdateSizeDto {
  @ApiProperty({ description: 'Size name', example: '42' })
  @IsString()
  name: string;
}

export class SizeResponseDto {
  @ApiProperty({ description: 'Size ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Size name', example: '42' })
  name: string;
} 