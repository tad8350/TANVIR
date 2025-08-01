import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Contact name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Address line', example: '123 Main Street' })
  @IsString()
  address_line: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Postal code', example: '10001' })
  @IsString()
  postal_code: string;

  @ApiProperty({ description: 'Address type', example: 'home', enum: ['home', 'work', 'other'] })
  @IsString()
  type: string;
}

export class UpdateAddressDto {
  @ApiProperty({ description: 'Contact name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Address line', example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  address_line?: string;

  @ApiProperty({ description: 'City', example: 'New York', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Postal code', example: '10001', required: false })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({ description: 'Address type', example: 'home', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}

export class AddressResponseDto {
  @ApiProperty({ description: 'Address ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  user_id: number;

  @ApiProperty({ description: 'Contact name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  phone: string;

  @ApiProperty({ description: 'Address line', example: '123 Main Street' })
  address_line: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  city: string;

  @ApiProperty({ description: 'Postal code', example: '10001' })
  postal_code: string;

  @ApiProperty({ description: 'Address type', example: 'home' })
  type: string;
} 