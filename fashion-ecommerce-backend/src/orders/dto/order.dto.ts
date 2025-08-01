import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ description: 'Product variant ID', example: 1 })
  @IsNumber()
  product_variant_id: number;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Shipping address ID', example: 1 })
  @IsNumber()
  shipping_address_id: number;

  @ApiProperty({ description: 'Order items', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Order status', example: 'processing', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  @IsString()
  status: string;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Order status', example: 'processing' })
  status: string;

  @ApiProperty({ description: 'Total amount', example: 299.99 })
  total_amount: number;

  @ApiProperty({ description: 'Payment status', example: 'paid' })
  payment_status: string;

  @ApiProperty({ description: 'Shipping address ID', example: 1 })
  shipping_address_id: number;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Order items', type: [Object] })
  items: any[];

  @ApiProperty({ description: 'Shipping address', type: Object })
  shipping_address: any;
} 