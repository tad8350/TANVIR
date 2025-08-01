import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Payment method', example: 'credit_card', enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'] })
  @IsString()
  method: string;

  @ApiProperty({ description: 'Payment status', example: 'pending', enum: ['pending', 'processing', 'completed', 'failed', 'refunded'] })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Transaction ID', example: 'TXN123456789', required: false })
  @IsOptional()
  @IsString()
  transaction_id?: string;
}

export class UpdatePaymentDto {
  @ApiProperty({ description: 'Payment method', example: 'credit_card', required: false })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiProperty({ description: 'Payment status', example: 'completed', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Transaction ID', example: 'TXN123456789', required: false })
  @IsOptional()
  @IsString()
  transaction_id?: string;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Order ID', example: 1 })
  order_id: number;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  method: string;

  @ApiProperty({ description: 'Payment status', example: 'completed' })
  status: string;

  @ApiProperty({ description: 'Transaction ID', example: 'TXN123456789' })
  transaction_id: string;

  @ApiProperty({ description: 'Paid date' })
  paid_at: Date;

  @ApiProperty({ description: 'Order information' })
  order: any;
} 