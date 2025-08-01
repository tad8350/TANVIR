import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Product variant ID', example: 1 })
  @IsNumber()
  product_variant_id: number;
}

export class FavoriteResponseDto {
  @ApiProperty({ description: 'Favorite ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Product variant ID', example: 1 })
  product_variant_id: number;

  @ApiProperty({ description: 'Created date' })
  created_at: Date;

  @ApiProperty({ description: 'Product variant information' })
  product_variant: any;
} 