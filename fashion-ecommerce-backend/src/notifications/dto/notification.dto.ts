import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Notification type', example: 'order_update', enum: ['order_update', 'shipping', 'payment', 'promotional', 'system'] })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Notification channel', example: 'email', enum: ['email', 'sms', 'push', 'in_app'] })
  @IsString()
  channel: string;

  @ApiProperty({ description: 'Notification subject', example: 'Order Shipped' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Notification message', example: 'Your order #12345 has been shipped!' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Notification status', example: 'pending', enum: ['pending', 'sent', 'failed'] })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Additional metadata', example: { order_id: 1 }, required: false })
  @IsOptional()
  @IsObject()
  meta?: any;
}

export class UpdateNotificationDto {
  @ApiProperty({ description: 'Notification status', example: 'sent', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class NotificationResponseDto {
  @ApiProperty({ description: 'Notification ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Notification type', example: 'order_update' })
  type: string;

  @ApiProperty({ description: 'Notification channel', example: 'email' })
  channel: string;

  @ApiProperty({ description: 'Notification subject', example: 'Order Shipped' })
  subject: string;

  @ApiProperty({ description: 'Notification message', example: 'Your order #12345 has been shipped!' })
  message: string;

  @ApiProperty({ description: 'Notification status', example: 'sent' })
  status: string;

  @ApiProperty({ description: 'Sent date' })
  sent_at: Date;

  @ApiProperty({ description: 'Additional metadata' })
  meta: any;

  @ApiProperty({ description: 'User information' })
  user: any;
} 