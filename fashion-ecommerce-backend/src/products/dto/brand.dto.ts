import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ description: 'Brand name', example: 'Nike' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Brand description', example: 'Just Do It', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Brand logo URL', example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  logo_url?: string;
}

export class UpdateBrandDto {
  @ApiProperty({ description: 'Brand name', example: 'Nike', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Brand description', example: 'Just Do It', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Brand logo URL', example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  logo_url?: string;
}

export class BrandResponseDto {
  @ApiProperty({ description: 'Brand ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Brand name', example: 'Nike' })
  name: string;

  @ApiProperty({ description: 'Brand description', example: 'Just Do It' })
  description: string;

  @ApiProperty({ description: 'Brand logo URL', example: 'https://example.com/logo.png' })
  logo_url: string;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;
} 