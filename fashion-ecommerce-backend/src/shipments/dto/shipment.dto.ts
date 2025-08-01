import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Courier name', example: 'FedEx' })
  @IsString()
  courier_name: string;

  @ApiProperty({ description: 'Tracking number', example: '1234567890' })
  @IsString()
  tracking_number: string;

  @ApiProperty({ description: 'Shipment status', example: 'shipped', enum: ['pending', 'shipped', 'in_transit', 'delivered', 'failed'] })
  @IsString()
  status: string;
}

export class UpdateShipmentDto {
  @ApiProperty({ description: 'Courier name', example: 'FedEx', required: false })
  @IsOptional()
  @IsString()
  courier_name?: string;

  @ApiProperty({ description: 'Tracking number', example: '1234567890', required: false })
  @IsOptional()
  @IsString()
  tracking_number?: string;

  @ApiProperty({ description: 'Shipment status', example: 'delivered', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class ShipmentResponseDto {
  @ApiProperty({ description: 'Shipment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Order ID', example: 1 })
  order_id: number;

  @ApiProperty({ description: 'Courier name', example: 'FedEx' })
  courier_name: string;

  @ApiProperty({ description: 'Tracking number', example: '1234567890' })
  tracking_number: string;

  @ApiProperty({ description: 'Shipment status', example: 'delivered' })
  status: string;

  @ApiProperty({ description: 'Shipped date' })
  shipped_at: Date;

  @ApiProperty({ description: 'Delivered date' })
  delivered_at: Date;

  @ApiProperty({ description: 'Order information' })
  order: any;
} 