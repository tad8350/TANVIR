import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User type', example: 'customer', enum: ['customer', 'admin', 'brand'] })
  @IsString()
  user_type: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Email address', example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Password', example: 'password123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'User type', example: 'customer', required: false })
  @IsOptional()
  @IsString()
  user_type?: string;

  @ApiProperty({ description: 'Verification status', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  @ApiProperty({ description: 'Active status', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'Verification status', example: true })
  is_verified: boolean;

  @ApiProperty({ description: 'Active status', example: true })
  is_active: boolean;

  @ApiProperty({ description: 'Last login date' })
  last_login: Date;

  @ApiProperty({ description: 'User type', example: 'customer' })
  user_type: string;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;
} 