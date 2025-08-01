import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Color ID', example: 1 })
  @IsNumber()
  color_id: number;

  @ApiProperty({ description: 'Size ID', example: 1 })
  @IsNumber()
  size_id: number;

  @ApiProperty({ description: 'Stock quantity', example: 100 })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({ description: 'Price', example: 99.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Discount price', example: 79.99, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discount_price?: number;

  @ApiProperty({ description: 'SKU', example: 'NIKE-AIR-MAX-42-BLACK' })
  @IsString()
  sku: string;
}

export class UpdateProductVariantDto {
  @ApiProperty({ description: 'Color ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  color_id?: number;

  @ApiProperty({ description: 'Size ID', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  size_id?: number;

  @ApiProperty({ description: 'Stock quantity', example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;

  @ApiProperty({ description: 'Price', example: 99.99, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({ description: 'Discount price', example: 79.99, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discount_price?: number;

  @ApiProperty({ description: 'SKU', example: 'NIKE-AIR-MAX-42-BLACK', required: false })
  @IsOptional()
  @IsString()
  sku?: string;
}

export class ProductVariantResponseDto {
  @ApiProperty({ description: 'Variant ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product ID', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Color ID', example: 1 })
  color_id: number;

  @ApiProperty({ description: 'Size ID', example: 1 })
  size_id: number;

  @ApiProperty({ description: 'Stock quantity', example: 100 })
  stock: number;

  @ApiProperty({ description: 'Price', example: 99.99 })
  price: number;

  @ApiProperty({ description: 'Discount price', example: 79.99 })
  discount_price: number;

  @ApiProperty({ description: 'SKU', example: 'NIKE-AIR-MAX-42-BLACK' })
  sku: string;

  @ApiProperty({ description: 'Color information' })
  color: any;

  @ApiProperty({ description: 'Size information' })
  size: any;
} 