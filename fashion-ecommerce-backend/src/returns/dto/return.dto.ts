import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Order item ID', example: 1 })
  @IsNumber()
  order_item_id: number;

  @ApiProperty({ description: 'Return status', example: 'pending', enum: ['pending', 'approved', 'rejected', 'processing', 'completed'] })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Return reason', example: 'Wrong size', enum: ['wrong_size', 'defective', 'not_as_described', 'changed_mind', 'other'] })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Refund status', example: 'pending', enum: ['pending', 'processing', 'completed', 'rejected'] })
  @IsString()
  refund_status: string;
}

export class UpdateReturnDto {
  @ApiProperty({ description: 'Return status', example: 'approved', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Return reason', example: 'Wrong size', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Refund status', example: 'processing', required: false })
  @IsOptional()
  @IsString()
  refund_status?: string;
}

export class ReturnResponseDto {
  @ApiProperty({ description: 'Return ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Order ID', example: 1 })
  order_id: number;

  @ApiProperty({ description: 'Order item ID', example: 1 })
  order_item_id: number;

  @ApiProperty({ description: 'Return status', example: 'pending' })
  status: string;

  @ApiProperty({ description: 'Return reason', example: 'Wrong size' })
  reason: string;

  @ApiProperty({ description: 'Refund status', example: 'pending' })
  refund_status: string;

  @ApiProperty({ description: 'Requested date' })
  requested_at: Date;

  @ApiProperty({ description: 'Updated date' })
  updated_at: Date;

  @ApiProperty({ description: 'Order information' })
  order: any;

  @ApiProperty({ description: 'Order item information' })
  order_item: any;
} 