import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Cloudinary public ID', example: 'fashion-ecommerce/products/image123', required: false })
  @IsOptional()
  @IsString()
  cloudinary_public_id?: string;
}

export class UpdateProductImageDto {
  @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ description: 'Cloudinary public ID', example: 'fashion-ecommerce/products/image123', required: false })
  @IsOptional()
  @IsString()
  cloudinary_public_id?: string;
}

export class ProductImageResponseDto {
  @ApiProperty({ description: 'Image ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product ID', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  url: string;

  @ApiProperty({ description: 'Cloudinary public ID', example: 'fashion-ecommerce/products/image123' })
  cloudinary_public_id: string;
} 