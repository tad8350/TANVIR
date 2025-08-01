import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  @IsUrl()
  url: string;
}

export class UpdateProductImageDto {
  @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  @IsUrl()
  url: string;
}

export class ProductImageResponseDto {
  @ApiProperty({ description: 'Image ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product ID', example: 1 })
  product_id: number;

  @ApiProperty({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  url: string;
} 