import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Brand ID', example: 1 })
  @IsNumber()
  brand_id: number;

  @ApiProperty({ description: 'Product name', example: 'Nike Air Max' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Category ID', example: 1 })
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: 'Product status', example: 'active', enum: ['active', 'inactive', 'draft'] })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Product images', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}

export class UpdateProductDto {
  @ApiProperty({ description: 'Brand ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @ApiProperty({ description: 'Product name', example: 'Nike Air Max', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({ description: 'Product status', example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Brand ID', example: 1 })
  brand_id: number;

  @ApiProperty({ description: 'Product name', example: 'Nike Air Max' })
  name: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes' })
  description: string;

  @ApiProperty({ description: 'Category ID', example: 1 })
  category_id: number;

  @ApiProperty({ description: 'Product status', example: 'active' })
  status: string;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;

  @ApiProperty({ description: 'Brand information' })
  brand: any;

  @ApiProperty({ description: 'Category information' })
  category: any;

  @ApiProperty({ description: 'Product variants', type: [Object] })
  variants: any[];

  @ApiProperty({ description: 'Product images', type: [Object] })
  images: any[];
} 