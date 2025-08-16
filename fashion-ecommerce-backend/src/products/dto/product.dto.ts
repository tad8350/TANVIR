import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsUrl, IsBoolean, IsPositive, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ColorBlockSizeDto {
  @ApiProperty({ description: 'Size ID', example: 'size-1', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Size name', example: 'M', required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ description: 'Quantity in stock', example: '100', required: false })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiProperty({ description: 'Low stock threshold', example: '10', required: false })
  @IsOptional()
  @IsString()
  lowStockThreshold?: string;

  @ApiProperty({ description: 'Base price for this size', example: '99.99', required: false })
  @IsOptional()
  @IsString()
  basePrice?: string;

  @ApiProperty({ description: 'Sale price for this size', example: '79.99', required: false })
  @IsOptional()
  @IsString()
  salePrice?: string;

  @ApiProperty({ description: 'Cost price for this size', example: '50.00', required: false })
  @IsOptional()
  @IsString()
  costPrice?: string;
}

export class ColorBlockDto {
  @ApiProperty({ description: 'Color block ID', example: 'block-1', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Selected color', example: 'Red', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'New color name', example: 'Crimson Red', required: false })
  @IsOptional()
  @IsString()
  newColor?: string;

  @ApiProperty({ description: 'Images for this color', type: [File], required: false })
  @IsOptional()
  @IsArray()
  images?: File[];

  @ApiProperty({ description: 'Sizes and quantities', type: [ColorBlockSizeDto], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => ColorBlockSizeDto)
  sizes?: ColorBlockSizeDto[];
}

export class ShippingDimensionsDto {
  @ApiProperty({ description: 'Length', example: '10' })
  @IsOptional()
  @IsString()
  length?: string;

  @ApiProperty({ description: 'Width', example: '5' })
  @IsOptional()
  @IsString()
  width?: string;

  @ApiProperty({ description: 'Height', example: '3' })
  @IsOptional()
  @IsString()
  height?: string;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Nike Air Max', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Product title', example: 'Nike Air Max 2024', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Short description', example: 'Premium running shoes', required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ description: 'Base price', example: '99.99', required: false })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ description: 'Sale price', example: '79.99', required: false })
  @IsOptional()
  @IsString()
  salePrice?: string;

  @ApiProperty({ description: 'Cost price', example: '50.00', required: false })
  @IsOptional()
  @IsString()
  costPrice?: string;

  @ApiProperty({ description: 'SKU', example: 'NIKE-AIR-MAX-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Barcode', example: '1234567890123', required: false })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ description: 'Brand name', example: 'Nike', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Product status', example: 'active', enum: ['active', 'inactive', 'draft'], required: false })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'draft'])
  status?: string;

  // Category fields
  @ApiProperty({ description: 'Category level 1 (audience)', example: 'men', required: false })
  @IsOptional()
  @IsString()
  categoryLevel1?: string;

  @ApiProperty({ description: 'Category level 2 (type)', example: 'clothing', required: false })
  @IsOptional()
  @IsString()
  categoryLevel2?: string;

  @ApiProperty({ description: 'Category level 3 (sub-type)', example: 'T-shirts', required: false })
  @IsOptional()
  @IsString()
  categoryLevel3?: string;

  @ApiProperty({ description: 'Category level 4 (specific)', example: 'Basic T-shirts', required: false })
  @IsOptional()
  @IsString()
  categoryLevel4?: string;

  @ApiProperty({ description: 'Final category value', example: 'men-clothing-tshirts-basic', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  // Inventory fields
  @ApiProperty({ description: 'Low stock threshold', example: '10', required: false })
  @IsOptional()
  @IsString()
  lowStockThreshold?: string;

  // Color blocks
  @ApiProperty({ description: 'Color blocks with sizes and stock', type: [ColorBlockDto], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => ColorBlockDto)
  colorBlocks?: ColorBlockDto[];

  // Images
  @ApiProperty({ description: 'Product images', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ description: 'Main image', example: 'https://example.com/main.jpg', required: false })
  @IsOptional()
  @IsString()
  mainImage?: string;

  // Variants
  @ApiProperty({ description: 'Has variants', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @ApiProperty({ description: 'Variant type', example: 'color', required: false })
  @IsOptional()
  @IsString()
  variantType?: string;

  @ApiProperty({ description: 'Product variants', type: [Object], required: false })
  @IsOptional()
  @IsArray()
  variants?: any[];

  // SEO & Marketing
  @ApiProperty({ description: 'SEO title', example: 'Nike Air Max Running Shoes', required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ description: 'SEO description', example: 'Premium running shoes for athletes', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'Keywords', example: 'running, shoes, nike, air max', required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  // Shipping
  @ApiProperty({ description: 'Shipping weight in kg', example: '0.5', required: false })
  @IsOptional()
  @IsString()
  shippingWeight?: string;

  @ApiProperty({ description: 'Shipping dimensions', type: ShippingDimensionsDto, required: false })
  @IsOptional()
  @Type(() => ShippingDimensionsDto)
  shippingDimensions?: ShippingDimensionsDto;

  @ApiProperty({ description: 'Free shipping', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @ApiProperty({ description: 'Shipping class', example: 'standard', required: false })
  @IsOptional()
  @IsString()
  shippingClass?: string;

  // Tax & Legal
  @ApiProperty({ description: 'Tax class', example: 'standard', required: false })
  @IsOptional()
  @IsString()
  taxClass?: string;

  @ApiProperty({ description: 'Tax rate percentage', example: '10.00', required: false })
  @IsOptional()
  @IsString()
  taxRate?: string;

  // Inventory
  @ApiProperty({ description: 'Track inventory', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiProperty({ description: 'Allow backorders', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  allowBackorders?: boolean;

  @ApiProperty({ description: 'Maximum order quantity', example: '10', required: false })
  @IsOptional()
  @IsString()
  maxOrderQuantity?: string;

  @ApiProperty({ description: 'Minimum order quantity', example: '1', required: false })
  @IsOptional()
  @IsString()
  minOrderQuantity?: string;

  // Advanced
  @ApiProperty({ description: 'Is virtual product', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;

  @ApiProperty({ description: 'Is downloadable product', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDownloadable?: boolean;

  @ApiProperty({ description: 'Download limit', example: '5', required: false })
  @IsOptional()
  @IsString()
  downloadLimit?: string;

  @ApiProperty({ description: 'Download expiry days', example: '30', required: false })
  @IsOptional()
  @IsString()
  downloadExpiry?: string;
}

export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Nike Air Max', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Product title', example: 'Nike Air Max 2024', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Short description', example: 'Premium running shoes', required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ description: 'Base price', example: '99.99', required: false })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ description: 'Sale price', example: '79.99', required: false })
  @IsOptional()
  @IsString()
  salePrice?: string;

  @ApiProperty({ description: 'Cost price', example: '50.00', required: false })
  @IsOptional()
  @IsString()
  costPrice?: string;

  @ApiProperty({ description: 'SKU', example: 'NIKE-AIR-MAX-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Barcode', example: '1234567890123', required: false })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ description: 'Brand name', example: 'Nike', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Product status', example: 'active', required: false })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'draft'])
  status?: string;

  // Category fields
  @ApiProperty({ description: 'Category level 1 (audience)', example: 'men', required: false })
  @IsOptional()
  @IsString()
  categoryLevel1?: string;

  @ApiProperty({ description: 'Category level 2 (type)', example: 'clothing', required: false })
  @IsOptional()
  @IsString()
  categoryLevel2?: string;

  @ApiProperty({ description: 'Category level 3 (sub-type)', example: 'T-shirts', required: false })
  @IsOptional()
  @IsString()
  categoryLevel3?: string;

  @ApiProperty({ description: 'Category level 4 (specific)', example: 'Basic T-shirts', required: false })
  @IsOptional()
  @IsString()
  categoryLevel4?: string;

  @ApiProperty({ description: 'Final category value', example: 'men-clothing-tshirts-basic', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  // Inventory fields
  @ApiProperty({ description: 'Low stock threshold', example: '10', required: false })
  @IsOptional()
  @IsString()
  lowStockThreshold?: string;

  // Color blocks
  @ApiProperty({ description: 'Color blocks with sizes and stock', type: [ColorBlockDto], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => ColorBlockDto)
  colorBlocks?: ColorBlockDto[];

  // Images
  @ApiProperty({ description: 'Product images', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ description: 'Main image', example: 'https://example.com/main.jpg', required: false })
  @IsOptional()
  @IsString()
  mainImage?: string;

  // Variants
  @ApiProperty({ description: 'Has variants', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @ApiProperty({ description: 'Variant type', example: 'color', required: false })
  @IsOptional()
  @IsString()
  variantType?: string;

  @ApiProperty({ description: 'Product variants', type: [Object], required: false })
  @IsOptional()
  @IsArray()
  variants?: any[];

  // SEO & Marketing
  @ApiProperty({ description: 'SEO title', example: 'Nike Air Max Running Shoes', required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ description: 'SEO description', example: 'Premium running shoes for athletes', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'Keywords', example: 'running, shoes, nike, air max', required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ description: 'Tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  // Shipping
  @ApiProperty({ description: 'Shipping weight in kg', example: '0.5', required: false })
  @IsOptional()
  @IsString()
  shippingWeight?: string;

  @ApiProperty({ description: 'Shipping dimensions', type: ShippingDimensionsDto, required: false })
  @IsOptional()
  @Type(() => ShippingDimensionsDto)
  shippingDimensions?: ShippingDimensionsDto;

  @ApiProperty({ description: 'Free shipping', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @ApiProperty({ description: 'Shipping class', example: 'standard', required: false })
  @IsOptional()
  @IsString()
  shippingClass?: string;

  // Tax & Legal
  @ApiProperty({ description: 'Tax class', example: 'standard', required: false })
  @IsOptional()
  @IsString()
  taxClass?: string;

  @ApiProperty({ description: 'Tax rate percentage', example: '10.00', required: false })
  @IsOptional()
  @IsString()
  taxRate?: string;

  // Inventory
  @ApiProperty({ description: 'Track inventory', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @ApiProperty({ description: 'Allow backorders', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  allowBackorders?: boolean;

  @ApiProperty({ description: 'Maximum order quantity', example: '10', required: false })
  @IsOptional()
  @IsString()
  maxOrderQuantity?: string;

  @ApiProperty({ description: 'Minimum order quantity', example: '1', required: false })
  @IsOptional()
  @IsString()
  minOrderQuantity?: string;

  // Advanced
  @ApiProperty({ description: 'Is virtual product', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;

  @ApiProperty({ description: 'Is downloadable product', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDownloadable?: boolean;

  @ApiProperty({ description: 'Download limit', example: '5', required: false })
  @IsOptional()
  @IsString()
  downloadLimit?: string;

  @ApiProperty({ description: 'Download expiry days', example: '30', required: false })
  @IsOptional()
  @IsString()
  downloadExpiry?: string;
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product name', example: 'Nike Air Max' })
  name: string;

  @ApiProperty({ description: 'Product title', example: 'Nike Air Max 2024' })
  title: string;

  @ApiProperty({ description: 'Product description', example: 'Comfortable running shoes' })
  description: string;

  @ApiProperty({ description: 'Short description', example: 'Premium running shoes' })
  shortDescription: string;

  @ApiProperty({ description: 'Base price', example: '99.99' })
  price: string;

  @ApiProperty({ description: 'Sale price', example: '79.99' })
  salePrice: string;

  @ApiProperty({ description: 'Cost price', example: '50.00' })
  costPrice: string;

  @ApiProperty({ description: 'SKU', example: 'NIKE-AIR-MAX-001' })
  sku: string;

  @ApiProperty({ description: 'Barcode', example: '1234567890123' })
  barcode: string;

  @ApiProperty({ description: 'Brand name', example: 'Nike' })
  brand: string;

  @ApiProperty({ description: 'Product status', example: 'active' })
  status: string;

  @ApiProperty({ description: 'Category information' })
  category: any;

  @ApiProperty({ description: 'Color blocks', type: [ColorBlockDto] })
  colorBlocks: ColorBlockDto[];

  @ApiProperty({ description: 'Product images', type: [String] })
  images: string[];

  @ApiProperty({ description: 'Main image', example: 'https://example.com/main.jpg' })
  mainImage: string;

  @ApiProperty({ description: 'Has variants', example: true })
  hasVariants: boolean;

  @ApiProperty({ description: 'Variant type', example: 'color' })
  variantType: string;

  @ApiProperty({ description: 'Product variants', type: [Object] })
  variants: any[];

  @ApiProperty({ description: 'SEO title', example: 'Nike Air Max Running Shoes' })
  metaTitle: string;

  @ApiProperty({ description: 'SEO description', example: 'Premium running shoes for athletes' })
  metaDescription: string;

  @ApiProperty({ description: 'Keywords', example: 'running, shoes, nike, air max' })
  keywords: string;

  @ApiProperty({ description: 'Tags', type: [String] })
  tags: string[];

  @ApiProperty({ description: 'Shipping weight in kg', example: '0.5' })
  shippingWeight: string;

  @ApiProperty({ description: 'Shipping dimensions', type: ShippingDimensionsDto })
  shippingDimensions: ShippingDimensionsDto;

  @ApiProperty({ description: 'Free shipping', example: false })
  freeShipping: boolean;

  @ApiProperty({ description: 'Shipping class', example: 'standard' })
  shippingClass: string;

  @ApiProperty({ description: 'Tax class', example: 'standard' })
  taxClass: string;

  @ApiProperty({ description: 'Tax rate percentage', example: '10.00' })
  taxRate: string;

  @ApiProperty({ description: 'Track inventory', example: true })
  trackInventory: boolean;

  @ApiProperty({ description: 'Allow backorders', example: false })
  allowBackorders: boolean;

  @ApiProperty({ description: 'Maximum order quantity', example: '10' })
  maxOrderQuantity: string;

  @ApiProperty({ description: 'Minimum order quantity', example: '1' })
  minOrderQuantity: string;

  @ApiProperty({ description: 'Is virtual product', example: false })
  isVirtual: boolean;

  @ApiProperty({ description: 'Is downloadable product', example: false })
  isDownloadable: boolean;

  @ApiProperty({ description: 'Download limit', example: '5' })
  downloadLimit: string;

  @ApiProperty({ description: 'Download expiry days', example: '30' })
  downloadExpiry: string;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;
} 