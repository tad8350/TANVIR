import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Product variant ID', example: 1 })
  @IsNumber()
  product_variant_id: number;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: 'Quantity', example: 3 })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CartItemResponseDto {
  @ApiProperty({ description: 'Cart item ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Product variant ID', example: 1 })
  product_variant_id: number;

  @ApiProperty({ description: 'Quantity', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Added date' })
  added_at: Date;

  @ApiProperty({ description: 'Product variant details' })
  product_variant: any;
}

export class CartResponseDto {
  @ApiProperty({ description: 'Cart items', type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty({ description: 'Total items', example: 5 })
  total_items: number;

  @ApiProperty({ description: 'Total price', example: 299.99 })
  total_price: number;
} 