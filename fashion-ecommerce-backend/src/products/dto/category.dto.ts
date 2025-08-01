import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Shoes' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Parent category ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  parent_id?: number;
}

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Shoes', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Parent category ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  parent_id?: number;
}

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category name', example: 'Shoes' })
  name: string;

  @ApiProperty({ description: 'Parent category ID', example: 1 })
  parent_id: number;

  @ApiProperty({ description: 'Subcategories', type: [CategoryResponseDto] })
  subcategories?: CategoryResponseDto[];
} 