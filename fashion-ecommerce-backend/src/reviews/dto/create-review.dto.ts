import { IsNumber, IsString, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  customer_id: number;

  @IsNumber()
  product_id: number;

  @IsOptional()
  @IsNumber()
  order_id?: number;

  @IsOptional()
  @IsString()
  review_text?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  star_rating: number;

  @IsOptional()
  @IsBoolean()
  is_verified_purchase?: boolean;

  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;
} 