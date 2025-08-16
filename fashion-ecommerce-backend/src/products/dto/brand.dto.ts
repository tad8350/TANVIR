import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsNumber, IsEnum } from 'class-validator';

export class CreateBrandDto {
  // Basic Information
  @ApiProperty({ description: 'Brand name', example: 'Ecstasy' })
  @IsString()
  brand_name: string;

  @ApiProperty({ description: 'Business name', example: 'Ecstasy Business Ltd', required: false })
  @IsOptional()
  @IsString()
  business_name?: string;

  @ApiProperty({ description: 'Brand description', example: 'Brief description of the brand', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Brand logo URL or file path', example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiProperty({ description: 'Brand logo Cloudinary ID', example: 'fashion-ecommerce/brands/logos/logo123', required: false })
  @IsOptional()
  @IsString()
  logo_cloudinary_id?: string;

  @ApiProperty({ description: 'Brand banner URL or file path', example: 'https://example.com/banner.png', required: false })
  @IsOptional()
  @IsString()
  banner_url?: string;

  @ApiProperty({ description: 'Brand banner Cloudinary ID', example: 'fashion-ecommerce/brands/banners/banner123', required: false })
  @IsOptional()
  @IsString()
  banner_cloudinary_id?: string;

  @ApiProperty({ description: 'Website URL', example: 'https://example.com', required: false })
  @IsOptional()
  @IsString()
  website_url?: string;

  @ApiProperty({ description: 'Website', example: 'https://example.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Brand category', example: 'Fashion & Apparel', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  // Social Media Links
  @ApiProperty({ description: 'Facebook URL', example: 'https://facebook.com/brand', required: false })
  @IsOptional()
  @IsString()
  facebook_url?: string;

  @ApiProperty({ description: 'Instagram URL', example: 'https://instagram.com/brand', required: false })
  @IsOptional()
  @IsString()
  instagram_url?: string;

  @ApiProperty({ description: 'Twitter URL', example: 'https://twitter.com/brand', required: false })
  @IsOptional()
  @IsString()
  twitter_url?: string;

  @ApiProperty({ description: 'LinkedIn URL', example: 'https://linkedin.com/company/brand', required: false })
  @IsOptional()
  @IsString()
  linkedin_url?: string;

  // Contact Information
  @ApiProperty({ description: 'Contact email for brand login', example: 'brand@ecstasy.com' })
  @IsString()
  contact_email: string;

  @ApiProperty({ description: 'Contact phone number', example: '+8801675482644', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ description: 'Contact person name', example: 'Mr John Doe', required: false })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @ApiProperty({ description: 'Alternative phone number', example: '+8801675482644', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Business address', example: 'boishudhoara 12/a', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Region', example: 'Dhaka Division', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: 'District', example: 'Dhaka', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  // Business Details
  @ApiProperty({ description: 'Company registration number', example: '45474756', required: false })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @ApiProperty({ description: 'Business license number', example: '45764324', required: false })
  @IsOptional()
  @IsString()
  business_license?: string;

  @ApiProperty({ description: 'Tax ID/VAT number', example: '67868', required: false })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @ApiProperty({ description: 'TIN number', example: '235424345', required: false })
  @IsOptional()
  @IsString()
  tin_number?: string;

  @ApiProperty({ description: 'Trade license', example: '8076534', required: false })
  @IsOptional()
  @IsString()
  trade_license?: string;

  @ApiProperty({ description: 'VAT registration status', example: 'Registered', required: false })
  @IsOptional()
  @IsString()
  vat_registration?: string;

  @ApiProperty({ description: 'Import/export license', example: 'License number', required: false })
  @IsOptional()
  @IsString()
  import_export_license?: string;

  // Payment Info
  @ApiProperty({ description: 'Preferred payment method', example: 'bKash', required: false })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({ description: 'Payment phone number', example: '016952452855', required: false })
  @IsOptional()
  @IsString()
  payment_phone?: string;

  @ApiProperty({ description: 'Account holder name', example: 'Mr Tanjim', required: false })
  @IsOptional()
  @IsString()
  account_holder_name?: string;

  @ApiProperty({ description: 'Payment notification email', example: 'payment@brand.com', required: false })
  @IsOptional()
  @IsString()
  payment_email?: string;

  // Operational Details
  @ApiProperty({ description: 'Warehouse location', example: 'Bosundhoira', required: false })
  @IsOptional()
  @IsString()
  warehouse_location?: string;

  @ApiProperty({ description: 'Physical shops/locations', example: 'qushan, banani', required: false })
  @IsOptional()
  @IsString()
  physical_shops?: string;

  @ApiProperty({ description: 'Return policy', example: '3 days', required: false })
  @IsOptional()
  @IsString()
  return_policy?: string;

  @ApiProperty({ description: 'Warranty policy', example: '1 year warranty', required: false })
  @IsOptional()
  @IsString()
  warranty_policy?: string;

  @ApiProperty({ description: 'Minimum order quantity', example: '10', required: false })
  @IsOptional()
  @IsString()
  minimum_order_quantity?: string;

  @ApiProperty({ description: 'Shipping zones', example: 'Dhaka, Chittagong', required: false })
  @IsOptional()
  @IsString()
  shipping_zones?: string;

  // Partnership Settings
  @ApiProperty({ description: 'Commission rate percentage', example: 25, required: false })
  @IsOptional()
  @IsNumber()
  commission_rate?: number;

  @ApiProperty({ description: 'Payment terms', example: 'Net 30', required: false })
  @IsOptional()
  @IsString()
  payment_terms?: string;

  @ApiProperty({ description: 'Commission structure details', example: 'Detailed commission structure', required: false })
  @IsOptional()
  @IsString()
  commission_structure?: string;

  @ApiProperty({ description: 'Payment schedule', example: 'Monthly', required: false })
  @IsOptional()
  @IsString()
  payment_schedule?: string;

  @ApiProperty({ description: 'Minimum payout amount', example: '1000', required: false })
  @IsOptional()
  @IsString()
  minimum_payout_amount?: string;

  @ApiProperty({ description: 'Tax deduction details', example: 'Tax deduction information', required: false })
  @IsOptional()
  @IsString()
  tax_deduction_details?: string;

  // Brand Owner Account
  @ApiProperty({ description: 'Owner full name', example: 'Mr Tanjim', required: false })
  @IsOptional()
  @IsString()
  owner_full_name?: string;

  @ApiProperty({ description: 'Owner email', example: 'owner@brand.com', required: false })
  @IsOptional()
  @IsString()
  owner_email?: string;

  @ApiProperty({ description: 'Owner password', example: 'Generated password', required: false })
  @IsOptional()
  @IsString()
  owner_password?: string;

  // Technical & Integration
  @ApiProperty({ description: 'API keys for integration', example: 'API keys', required: false })
  @IsOptional()
  @IsString()
  api_keys?: string;

  @ApiProperty({ description: 'Webhook URLs for notifications', example: 'Webhook URLs', required: false })
  @IsOptional()
  @IsString()
  webhook_urls?: string;

  @ApiProperty({ description: 'Integration settings', example: 'Integration configurations', required: false })
  @IsOptional()
  @IsString()
  integration_settings?: string;
}

export class UpdateBrandDto {
  // Basic Information
  @ApiProperty({ description: 'Brand name', example: 'Ecstasy', required: false })
  @IsOptional()
  @IsString()
  brand_name?: string;

  @ApiProperty({ description: 'Business name', example: 'Ecstasy Business Ltd', required: false })
  @IsOptional()
  @IsString()
  business_name?: string;

  @ApiProperty({ description: 'Brand description', example: 'Brief description of the brand', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Brand logo URL or file path', example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiProperty({ description: 'Brand logo Cloudinary ID', example: 'fashion-ecommerce/brands/logos/logo123', required: false })
  @IsOptional()
  @IsString()
  logo_cloudinary_id?: string;

  @ApiProperty({ description: 'Brand banner URL or file path', example: 'https://example.com/banner.png', required: false })
  @IsOptional()
  @IsString()
  banner_url?: string;

  @ApiProperty({ description: 'Brand banner Cloudinary ID', example: 'fashion-ecommerce/brands/banners/banner123', required: false })
  @IsOptional()
  @IsString()
  banner_cloudinary_id?: string;

  @ApiProperty({ description: 'Website URL', example: 'https://example.com', required: false })
  @IsOptional()
  @IsString()
  website_url?: string;

  @ApiProperty({ description: 'Website', example: 'https://example.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Brand category', example: 'Fashion & Apparel', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  // Social Media Links
  @ApiProperty({ description: 'Facebook URL', example: 'https://facebook.com/brand', required: false })
  @IsOptional()
  @IsString()
  facebook_url?: string;

  @ApiProperty({ description: 'Instagram URL', example: 'https://instagram.com/brand', required: false })
  @IsOptional()
  @IsString()
  instagram_url?: string;

  @ApiProperty({ description: 'Twitter URL', example: 'https://twitter.com/brand', required: false })
  @IsOptional()
  @IsString()
  twitter_url?: string;

  @ApiProperty({ description: 'LinkedIn URL', example: 'https://linkedin.com/company/brand', required: false })
  @IsOptional()
  @IsString()
  linkedin_url?: string;

  // Contact Information
  @ApiProperty({ description: 'Contact email for brand login', example: 'brand@ecstasy.com', required: false })
  @IsOptional()
  @IsString()
  contact_email?: string;

  @ApiProperty({ description: 'Contact phone number', example: '+8801675482644', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ description: 'Contact person name', example: 'Mr John Doe', required: false })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @ApiProperty({ description: 'Alternative phone number', example: '+8801675482644', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Business address', example: 'boishudhoara 12/a', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Region', example: 'Dhaka Division', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: 'District', example: 'Dhaka', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  // Business Details
  @ApiProperty({ description: 'Company registration number', example: '45474756', required: false })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @ApiProperty({ description: 'Business license number', example: '45764324', required: false })
  @IsOptional()
  @IsString()
  business_license?: string;

  @ApiProperty({ description: 'Tax ID/VAT number', example: '67868', required: false })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @ApiProperty({ description: 'TIN number', example: '235424345', required: false })
  @IsOptional()
  @IsString()
  tin_number?: string;

  @ApiProperty({ description: 'Trade license', example: '8076534', required: false })
  @IsOptional()
  @IsString()
  trade_license?: string;

  @ApiProperty({ description: 'VAT registration status', example: 'Registered', required: false })
  @IsOptional()
  @IsString()
  vat_registration?: string;

  @ApiProperty({ description: 'Import/export license', example: 'License number', required: false })
  @IsOptional()
  @IsString()
  import_export_license?: string;

  // Payment Info
  @ApiProperty({ description: 'Preferred payment method', example: 'bKash', required: false })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({ description: 'Payment phone number', example: '016952452855', required: false })
  @IsOptional()
  @IsString()
  payment_phone?: string;

  @ApiProperty({ description: 'Account holder name', example: 'Mr Tanjim', required: false })
  @IsOptional()
  @IsString()
  account_holder_name?: string;

  @ApiProperty({ description: 'Payment notification email', example: 'payment@brand.com', required: false })
  @IsOptional()
  @IsString()
  payment_email?: string;

  // Operational Details
  @ApiProperty({ description: 'Warehouse location', example: 'Bosundhoira', required: false })
  @IsOptional()
  @IsString()
  warehouse_location?: string;

  @ApiProperty({ description: 'Physical shops/locations', example: 'qushan, banani', required: false })
  @IsOptional()
  @IsString()
  physical_shops?: string;

  @ApiProperty({ description: 'Return policy', example: '3 days', required: false })
  @IsOptional()
  @IsString()
  return_policy?: string;

  @ApiProperty({ description: 'Warranty policy', example: '1 year warranty', required: false })
  @IsOptional()
  @IsString()
  warranty_policy?: string;

  @ApiProperty({ description: 'Minimum order quantity', example: '10', required: false })
  @IsOptional()
  @IsString()
  minimum_order_quantity?: string;

  @ApiProperty({ description: 'Shipping zones', example: 'Dhaka, Chittagong', required: false })
  @IsOptional()
  @IsString()
  shipping_zones?: string;

  // Partnership Settings
  @ApiProperty({ description: 'Commission rate percentage', example: 25, required: false })
  @IsOptional()
  @IsNumber()
  commission_rate?: number;

  @ApiProperty({ description: 'Payment terms', example: 'Net 30', required: false })
  @IsOptional()
  @IsString()
  payment_terms?: string;

  @ApiProperty({ description: 'Commission structure details', example: 'Detailed commission structure', required: false })
  @IsOptional()
  @IsString()
  commission_structure?: string;

  @ApiProperty({ description: 'Payment schedule', example: 'Monthly', required: false })
  @IsOptional()
  @IsString()
  payment_schedule?: string;

  @ApiProperty({ description: 'Minimum payout amount', example: '1000', required: false })
  @IsOptional()
  @IsString()
  minimum_payout_amount?: string;

  @ApiProperty({ description: 'Tax deduction details', example: 'Tax deduction information', required: false })
  @IsOptional()
  @IsString()
  tax_deduction_details?: string;

  // Brand Owner Account
  @ApiProperty({ description: 'Owner full name', example: 'Mr Tanjim', required: false })
  @IsOptional()
  @IsString()
  owner_full_name?: string;

  @ApiProperty({ description: 'Owner email', example: 'owner@brand.com', required: false })
  @IsOptional()
  @IsString()
  owner_email?: string;

  @ApiProperty({ description: 'Owner password', example: 'Generated password', required: false })
  @IsOptional()
  @IsString()
  owner_password?: string;

  // Technical & Integration
  @ApiProperty({ description: 'API keys for integration', example: 'API keys', required: false })
  @IsOptional()
  @IsString()
  api_keys?: string;

  @ApiProperty({ description: 'Webhook URLs for notifications', example: 'Webhook URLs', required: false })
  @IsOptional()
  @IsString()
  webhook_urls?: string;

  @ApiProperty({ description: 'Integration settings', example: 'Integration configurations', required: false })
  @IsOptional()
  @IsString()
  integration_settings?: string;
}

export class BrandResponseDto {
  @ApiProperty({ description: 'Brand ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 27 })
  user_id: number;

  // Basic Information
  @ApiProperty({ description: 'Brand name', example: 'Ecstasy' })
  brand_name: string;

  @ApiProperty({ description: 'Business name', example: 'Ecstasy Business Ltd' })
  business_name: string;

  @ApiProperty({ description: 'Brand description', example: 'Brief description of the brand' })
  description: string;

  @ApiProperty({ description: 'Brand logo URL or file path', example: 'https://example.com/logo.png' })
  logo_url: string;

  @ApiProperty({ description: 'Brand logo Cloudinary ID', example: 'fashion-ecommerce/brands/logos/logo123' })
  logo_cloudinary_id: string;

  @ApiProperty({ description: 'Brand banner URL or file path', example: 'https://example.com/banner.png' })
  banner_url: string;

  @ApiProperty({ description: 'Brand banner Cloudinary ID', example: 'fashion-ecommerce/brands/banners/banner123' })
  banner_cloudinary_id: string;

  @ApiProperty({ description: 'Website URL', example: 'https://example.com' })
  website_url: string;

  @ApiProperty({ description: 'Website', example: 'https://example.com' })
  website: string;

  @ApiProperty({ description: 'Brand category', example: 'Fashion & Apparel' })
  category: string;

  // Social Media Links
  @ApiProperty({ description: 'Facebook URL', example: 'https://facebook.com/brand' })
  facebook_url: string;

  @ApiProperty({ description: 'Instagram URL', example: 'https://instagram.com/brand' })
  instagram_url: string;

  @ApiProperty({ description: 'Twitter URL', example: 'https://twitter.com/brand' })
  twitter_url: string;

  @ApiProperty({ description: 'LinkedIn URL', example: 'https://linkedin.com/company/brand' })
  linkedin_url: string;

  // Contact Information
  @ApiProperty({ description: 'Contact email for brand login', example: 'brand@ecstasy.com' })
  contact_email: string;

  @ApiProperty({ description: 'Contact phone number', example: '+8801675482644' })
  phone_number: string;

  @ApiProperty({ description: 'Contact person name', example: 'Mr John Doe' })
  contact_person: string;

  @ApiProperty({ description: 'Alternative phone number', example: '+8801675482644' })
  phone: string;

  @ApiProperty({ description: 'Business address', example: 'boishudhoara 12/a' })
  address: string;

  @ApiProperty({ description: 'Region', example: 'Dhaka Division' })
  region: string;

  @ApiProperty({ description: 'District', example: 'Dhaka' })
  district: string;

  // Business Details
  @ApiProperty({ description: 'Company registration number', example: '45474756' })
  registration_number: string;

  @ApiProperty({ description: 'Business license number', example: '45764324' })
  business_license: string;

  @ApiProperty({ description: 'Tax ID/VAT number', example: '67868' })
  tax_id: string;

  @ApiProperty({ description: 'TIN number', example: '235424345' })
  tin_number: string;

  @ApiProperty({ description: 'Trade license', example: '8076534' })
  trade_license: string;

  @ApiProperty({ description: 'VAT registration status', example: 'Registered' })
  vat_registration: string;

  @ApiProperty({ description: 'Import/export license', example: 'License number' })
  import_export_license: string;

  // Payment Info
  @ApiProperty({ description: 'Preferred payment method', example: 'bKash' })
  payment_method: string;

  @ApiProperty({ description: 'Payment phone number', example: '016952452855' })
  payment_phone: string;

  @ApiProperty({ description: 'Account holder name', example: 'Mr Tanjim' })
  account_holder_name: string;

  @ApiProperty({ description: 'Payment notification email', example: 'payment@brand.com' })
  payment_email: string;

  // Operational Details
  @ApiProperty({ description: 'Warehouse location', example: 'Bosundhoira' })
  warehouse_location: string;

  @ApiProperty({ description: 'Physical shops/locations', example: 'qushan, banani' })
  physical_shops: string;

  @ApiProperty({ description: 'Return policy', example: '3 days' })
  return_policy: string;

  @ApiProperty({ description: 'Warranty policy', example: '1 year warranty' })
  warranty_policy: string;

  @ApiProperty({ description: 'Minimum order quantity', example: '10' })
  minimum_order_quantity: string;

  @ApiProperty({ description: 'Shipping zones', example: 'Dhaka, Chittagong' })
  shipping_zones: string;

  // Partnership Settings
  @ApiProperty({ description: 'Commission rate percentage', example: 25 })
  commission_rate: number;

  @ApiProperty({ description: 'Payment terms', example: 'Net 30' })
  payment_terms: string;

  @ApiProperty({ description: 'Commission structure details', example: 'Tiered commission structure' })
  commission_structure: string;

  @ApiProperty({ description: 'Payment schedule', example: 'Monthly' })
  payment_schedule: string;

  @ApiProperty({ description: 'Minimum payout amount', example: '1000' })
  minimum_payout_amount: string;

  @ApiProperty({ description: 'Tax deduction details', example: 'Standard tax deduction' })
  tax_deduction_details: string;

  // Brand Owner Account
  @ApiProperty({ description: 'Owner full name', example: 'Mr John Doe' })
  owner_full_name: string;

  @ApiProperty({ description: 'Owner email', example: 'owner@brand.com' })
  owner_email: string;

  @ApiProperty({ description: 'Owner password', example: 'secure_password' })
  owner_password: string;

  // Technical & Integration
  @ApiProperty({ description: 'API keys for integration', example: 'api_key_123' })
  api_keys: string;

  @ApiProperty({ description: 'Webhook URLs for notifications', example: 'https://webhook.com/endpoint' })
  webhook_urls: string;

  @ApiProperty({ description: 'Integration settings and configurations', example: 'Custom integration settings' })
  integration_settings: string;

  // System fields
  @ApiProperty({ description: 'Payment methods configuration', example: {} })
  payment_methods: any;

  @ApiProperty({ description: 'Shipping methods configuration', example: {} })
  shipping_methods: any;

  @ApiProperty({ description: 'Verification status', example: false })
  is_verified: boolean;

  @ApiProperty({ description: 'Bank account details', example: {} })
  bank_account: any;

  @ApiProperty({ description: 'Creation timestamp', example: '2025-08-14T21:43:28.759Z' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2025-08-14T21:43:28.759Z' })
  updated_at: Date;
} 