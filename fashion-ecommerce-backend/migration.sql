-- Migration script to add new fields to products table
-- Run this script on your existing database to add the new fields

-- Make brand_id nullable (in case it's not already)
ALTER TABLE products ALTER COLUMN brand_id DROP NOT NULL;

-- Add new columns to products table (only if they don't exist)
DO $$
BEGIN
    -- Add SKU column first since other operations depend on it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        ALTER TABLE products ADD COLUMN sku text;
    END IF;
    -- Add columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'title') THEN
        ALTER TABLE products ADD COLUMN title text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'short_description') THEN
        ALTER TABLE products ADD COLUMN short_description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price') THEN
        ALTER TABLE products ADD COLUMN price numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sale_price') THEN
        ALTER TABLE products ADD COLUMN sale_price numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cost_price') THEN
        ALTER TABLE products ADD COLUMN cost_price numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'barcode') THEN
        ALTER TABLE products ADD COLUMN barcode text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_level1') THEN
        ALTER TABLE products ADD COLUMN category_level1 text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_level2') THEN
        ALTER TABLE products ADD COLUMN category_level2 text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_level3') THEN
        ALTER TABLE products ADD COLUMN category_level3 text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_level4') THEN
        ALTER TABLE products ADD COLUMN category_level4 text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE products ADD COLUMN category text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'low_stock_threshold') THEN
        ALTER TABLE products ADD COLUMN low_stock_threshold integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_title') THEN
        ALTER TABLE products ADD COLUMN meta_title text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_description') THEN
        ALTER TABLE products ADD COLUMN meta_description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'keywords') THEN
        ALTER TABLE products ADD COLUMN keywords text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE products ADD COLUMN tags text[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'shipping_weight') THEN
        ALTER TABLE products ADD COLUMN shipping_weight numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'shipping_length') THEN
        ALTER TABLE products ADD COLUMN shipping_length numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'shipping_width') THEN
        ALTER TABLE products ADD COLUMN shipping_width numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'shipping_height') THEN
        ALTER TABLE products ADD COLUMN shipping_height numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'free_shipping') THEN
        ALTER TABLE products ADD COLUMN free_shipping boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'shipping_class') THEN
        ALTER TABLE products ADD COLUMN shipping_class text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tax_class') THEN
        ALTER TABLE products ADD COLUMN tax_class text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tax_rate') THEN
        ALTER TABLE products ADD COLUMN tax_rate numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'track_inventory') THEN
        ALTER TABLE products ADD COLUMN track_inventory boolean DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'allow_backorders') THEN
        ALTER TABLE products ADD COLUMN allow_backorders boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'max_order_quantity') THEN
        ALTER TABLE products ADD COLUMN max_order_quantity integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'min_order_quantity') THEN
        ALTER TABLE products ADD COLUMN min_order_quantity integer DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_virtual') THEN
        ALTER TABLE products ADD COLUMN is_virtual boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_downloadable') THEN
        ALTER TABLE products ADD COLUMN is_downloadable boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'download_limit') THEN
        ALTER TABLE products ADD COLUMN download_limit integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'download_expiry') THEN
        ALTER TABLE products ADD COLUMN download_expiry integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'has_variants') THEN
        ALTER TABLE products ADD COLUMN has_variants boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'variant_type') THEN
        ALTER TABLE products ADD COLUMN variant_type text;
    END IF;
END $$;

-- Add unique constraint to SKU if it doesn't exist and if the column exists
DO $$
BEGIN
    -- Check if SKU column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        -- Check if the constraint already exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'products_sku_unique' 
            AND table_name = 'products'
        ) THEN
            ALTER TABLE products ADD CONSTRAINT products_sku_unique UNIQUE (sku);
        END IF;
    END IF;
END $$;

-- Insert some sample colors and sizes for testing
-- Use a more compatible approach for inserting data
INSERT INTO colors (name) 
SELECT 'Red' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Red');

INSERT INTO colors (name) 
SELECT 'Blue' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Blue');

INSERT INTO colors (name) 
SELECT 'Green' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Green');

INSERT INTO colors (name) 
SELECT 'Black' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Black');

INSERT INTO colors (name) 
SELECT 'White' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'White');

INSERT INTO colors (name) 
SELECT 'Gray' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Gray');

INSERT INTO colors (name) 
SELECT 'Navy' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Navy');

INSERT INTO colors (name) 
SELECT 'Brown' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Brown');

INSERT INTO colors (name) 
SELECT 'Pink' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Pink');

INSERT INTO colors (name) 
SELECT 'Purple' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Purple');

INSERT INTO colors (name) 
SELECT 'Yellow' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Yellow');

INSERT INTO colors (name) 
SELECT 'Orange' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Orange');

INSERT INTO colors (name) 
SELECT 'Beige' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Beige');

INSERT INTO colors (name) 
SELECT 'Maroon' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Maroon');

INSERT INTO colors (name) 
SELECT 'Teal' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Teal');

INSERT INTO colors (name) 
SELECT 'Cyan' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Cyan');

INSERT INTO colors (name) 
SELECT 'Magenta' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Magenta');

INSERT INTO colors (name) 
SELECT 'Lime' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Lime');

INSERT INTO colors (name) 
SELECT 'Olive' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Olive');

INSERT INTO colors (name) 
SELECT 'Silver' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Silver');

INSERT INTO colors (name) 
SELECT 'Gold' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Gold');

INSERT INTO colors (name) 
SELECT 'Indigo' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Indigo');

-- Insert sizes
INSERT INTO sizes (name) 
SELECT 'XS' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'XS');

INSERT INTO sizes (name) 
SELECT 'S' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'S');

INSERT INTO sizes (name) 
SELECT 'M' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'M');

INSERT INTO sizes (name) 
SELECT 'L' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'L');

INSERT INTO sizes (name) 
SELECT 'XL' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'XL');

INSERT INTO sizes (name) 
SELECT 'XXL' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'XXL');

INSERT INTO sizes (name) 
SELECT 'XXXL' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = 'XXXL');

INSERT INTO sizes (name) 
SELECT '2T' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '2T');

INSERT INTO sizes (name) 
SELECT '3T' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '3T');

INSERT INTO sizes (name) 
SELECT '4T' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '4T');

INSERT INTO sizes (name) 
SELECT '5T' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '5T');

INSERT INTO sizes (name) 
SELECT '6T' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '6T');

INSERT INTO sizes (name) 
SELECT '7' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '7');

INSERT INTO sizes (name) 
SELECT '8' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '8');

INSERT INTO sizes (name) 
SELECT '9' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '9');

INSERT INTO sizes (name) 
SELECT '10' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '10');

INSERT INTO sizes (name) 
SELECT '11' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '11');

INSERT INTO sizes (name) 
SELECT '12' WHERE NOT EXISTS (SELECT 1 FROM sizes WHERE name = '12');

-- Insert some sample categories
INSERT INTO categories (name, parent_id) 
SELECT 'MEN', NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'MEN');

INSERT INTO categories (name, parent_id) 
SELECT 'WOMEN', NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'WOMEN');

INSERT INTO categories (name, parent_id) 
SELECT 'KIDS', NULL WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'KIDS');

-- Insert subcategories for MEN
INSERT INTO categories (name, parent_id) 
SELECT 'Clothing', (SELECT id FROM categories WHERE name = 'MEN')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Clothing' AND parent_id = (SELECT id FROM categories WHERE name = 'MEN'));

INSERT INTO categories (name, parent_id) 
SELECT 'Shoes', (SELECT id FROM categories WHERE name = 'MEN')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Shoes' AND parent_id = (SELECT id FROM categories WHERE name = 'MEN'));

INSERT INTO categories (name, parent_id) 
SELECT 'Accessories', (SELECT id FROM categories WHERE name = 'MEN')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'MEN'));

-- Insert subcategories for WOMEN
INSERT INTO categories (name, parent_id) 
SELECT 'Clothing', (SELECT id FROM categories WHERE name = 'WOMEN')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Clothing' AND parent_id = (SELECT id FROM categories WHERE name = 'WOMEN'));

INSERT INTO categories (name, parent_id) 
SELECT 'Shoes', (SELECT id FROM categories WHERE name = 'WOMEN')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Shoes' AND parent_id = (SELECT id FROM categories WHERE name = 'WOMEN'));

INSERT INTO categories (name, parent_id) 
SELECT 'Accessories', (SELECT id FROM categories WHERE name = 'WOMEN')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'WOMEN'));

-- Insert subcategories for KIDS
INSERT INTO categories (name, parent_id) 
SELECT 'Clothing', (SELECT id FROM categories WHERE name = 'KIDS')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Clothing' AND parent_id = (SELECT id FROM categories WHERE name = 'KIDS'));

INSERT INTO categories (name, parent_id) 
SELECT 'Shoes', (SELECT id FROM categories WHERE name = 'KIDS')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Shoes' AND parent_id = (SELECT id FROM categories WHERE name = 'KIDS'));

INSERT INTO categories (name, parent_id) 
SELECT 'Accessories', (SELECT id FROM categories WHERE name = 'KIDS')
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'KIDS'));
