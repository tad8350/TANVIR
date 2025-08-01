import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePromoCodeDto {
  @IsString()
  code: string;

  @IsString()
  type: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  usage_limit?: number;

  @IsDateString()
  valid_from: string;

  @IsDateString()
  valid_to: string;

  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @IsOptional()
  @IsNumber()
  campaign_id?: number;
} 