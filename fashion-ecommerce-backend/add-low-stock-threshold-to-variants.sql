-- Add low_stock_threshold column to product_variants table
-- Support Tickets (ID: 5922694)

ALTER TABLE product_variants 
ADD COLUMN low_stock_threshold INTEGER;

-- Update existing records to have a default value
UPDATE product_variants 
SET low_stock_threshold = 10 
WHERE low_stock_threshold IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE product_variants 
ALTER COLUMN low_stock_threshold SET NOT NULL;

-- Add comment to the column
COMMENT ON COLUMN product_variants.low_stock_threshold IS 'Low stock threshold for this variant';
