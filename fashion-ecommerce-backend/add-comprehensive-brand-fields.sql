-- Migration: Add comprehensive brand fields to brand_profiles table
-- This migration adds all the missing columns for comprehensive brand data

-- Add new columns for comprehensive brand information
ALTER TABLE brand_profiles 
ADD COLUMN IF NOT EXISTS category VARCHAR(255),
ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS region VARCHAR(255),
ADD COLUMN IF NOT EXISTS district VARCHAR(255),
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS tin_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS trade_license VARCHAR(255),
ADD COLUMN IF NOT EXISTS vat_registration VARCHAR(255),
ADD COLUMN IF NOT EXISTS import_export_license VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS warehouse_location TEXT,
ADD COLUMN IF NOT EXISTS physical_shops TEXT,
ADD COLUMN IF NOT EXISTS return_policy VARCHAR(255),
ADD COLUMN IF NOT EXISTS warranty_policy TEXT,
ADD COLUMN IF NOT EXISTS minimum_order_quantity VARCHAR(255),
ADD COLUMN IF NOT EXISTS shipping_zones TEXT,
ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(255),
ADD COLUMN IF NOT EXISTS commission_structure TEXT,
ADD COLUMN IF NOT EXISTS payment_schedule VARCHAR(255),
ADD COLUMN IF NOT EXISTS minimum_payout_amount VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_deduction_details TEXT,
ADD COLUMN IF NOT EXISTS owner_full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS owner_password VARCHAR(255),
ADD COLUMN IF NOT EXISTS api_keys TEXT,
ADD COLUMN IF NOT EXISTS webhook_urls TEXT,
ADD COLUMN IF NOT EXISTS integration_settings TEXT;

-- Update existing records to set default values for new columns
UPDATE brand_profiles SET 
  category = 'Other' WHERE category IS NULL,
  website_url = website WHERE website_url IS NULL AND website IS NOT NULL,
  contact_email = 'Not provided' WHERE contact_email IS NULL,
  phone_number = phone WHERE phone_number IS NULL AND phone IS NOT NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN brand_profiles.category IS 'Brand category (e.g., Fashion & Apparel, Electronics)';
COMMENT ON COLUMN brand_profiles.website_url IS 'Brand website URL';
COMMENT ON COLUMN brand_profiles.facebook_url IS 'Facebook page URL';
COMMENT ON COLUMN brand_profiles.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN brand_profiles.twitter_url IS 'Twitter profile URL';
COMMENT ON COLUMN brand_profiles.linkedin_url IS 'LinkedIn company page URL';
COMMENT ON COLUMN brand_profiles.contact_email IS 'Primary contact email for brand';
COMMENT ON COLUMN brand_profiles.phone_number IS 'Primary contact phone number';
COMMENT ON COLUMN brand_profiles.address IS 'Business address';
COMMENT ON COLUMN brand_profiles.region IS 'Business region/state';
COMMENT ON COLUMN brand_profiles.district IS 'Business district/city';
COMMENT ON COLUMN brand_profiles.registration_number IS 'Company registration number';
COMMENT ON COLUMN brand_profiles.tin_number IS 'Tax Identification Number';
COMMENT ON COLUMN brand_profiles.trade_license IS 'Trade license number';
COMMENT ON COLUMN brand_profiles.vat_registration IS 'VAT registration status';
COMMENT ON COLUMN brand_profiles.import_export_license IS 'Import/export license number';
COMMENT ON COLUMN brand_profiles.payment_method IS 'Preferred payment method';
COMMENT ON COLUMN brand_profiles.payment_phone IS 'Payment phone number';
COMMENT ON COLUMN brand_profiles.account_holder_name IS 'Payment account holder name';
COMMENT ON COLUMN brand_profiles.payment_email IS 'Payment notification email';
COMMENT ON COLUMN brand_profiles.warehouse_location IS 'Warehouse location';
COMMENT ON COLUMN brand_profiles.physical_shops IS 'Physical shop locations';
COMMENT ON COLUMN brand_profiles.return_policy IS 'Return policy details';
COMMENT ON COLUMN brand_profiles.warranty_policy IS 'Warranty policy details';
COMMENT ON COLUMN brand_profiles.minimum_order_quantity IS 'Minimum order quantity';
COMMENT ON COLUMN brand_profiles.shipping_zones IS 'Shipping zones covered';
COMMENT ON COLUMN brand_profiles.payment_terms IS 'Payment terms (e.g., Net 30)';
COMMENT ON COLUMN brand_profiles.commission_structure IS 'Detailed commission structure';
COMMENT ON COLUMN brand_profiles.payment_schedule IS 'Payment schedule (e.g., Monthly)';
COMMENT ON COLUMN brand_profiles.minimum_payout_amount IS 'Minimum payout amount';
COMMENT ON COLUMN brand_profiles.tax_deduction_details IS 'Tax deduction information';
COMMENT ON COLUMN brand_profiles.owner_full_name IS 'Brand owner full name';
COMMENT ON COLUMN brand_profiles.owner_email IS 'Brand owner email';
COMMENT ON COLUMN brand_profiles.owner_password IS 'Brand owner password';
COMMENT ON COLUMN brand_profiles.api_keys IS 'API keys for integration';
COMMENT ON COLUMN brand_profiles.webhook_urls IS 'Webhook URLs for notifications';
COMMENT ON COLUMN brand_profiles.integration_settings IS 'Integration settings and configurations';
