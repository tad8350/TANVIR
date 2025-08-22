-- Add Cloudinary fields to product_images table
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255);

-- Add Cloudinary fields to brand_profiles table
ALTER TABLE brand_profiles 
ADD COLUMN IF NOT EXISTS logo_cloudinary_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS banner_cloudinary_id VARCHAR(255);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_images_cloudinary_id ON product_images(cloudinary_public_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_logo_cloudinary_id ON brand_profiles(logo_cloudinary_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_banner_cloudinary_id ON brand_profiles(banner_cloudinary_id);

-- Update existing records to have default values (optional)
UPDATE product_images SET cloudinary_public_id = NULL WHERE cloudinary_public_id IS NULL;
UPDATE brand_profiles SET logo_cloudinary_id = NULL WHERE logo_cloudinary_id IS NULL;
UPDATE brand_profiles SET banner_cloudinary_id = NULL WHERE banner_cloudinary_id IS NULL;
