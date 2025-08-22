-- Search Functionality Migration for TAD Fashion E-commerce
-- This migration implements:
-- 1. PostgreSQL Full-Text Search (FTS) with GIN indexes
-- 2. Trigram Indexes for Typo Tolerance
-- 3. Denormalized Search Table Approach

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 2: Add search document column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_document tsvector;

-- Step 3: Create a denormalized search table for better performance
CREATE TABLE IF NOT EXISTS product_search (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    short_description TEXT,
    brand_name TEXT,
    brand_id INTEGER,
    category_name TEXT,
    category_id INTEGER,
    category_level1 TEXT,
    category_level2 TEXT,
    category_level3 TEXT,
    category_level4 TEXT,
    tags TEXT[],
    keywords TEXT,
    price NUMERIC(10,2),
    sale_price NUMERIC(10,2),
    sku TEXT,
    barcode TEXT,
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    search_document tsvector,
    search_rank NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_product_search_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_search_brand FOREIGN KEY (brand_id) REFERENCES brand_profiles(id) ON DELETE SET NULL,
    CONSTRAINT fk_product_search_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Step 4: Create indexes for the search table
CREATE INDEX IF NOT EXISTS idx_product_search_product_id ON product_search(product_id);
CREATE INDEX IF NOT EXISTS idx_product_search_brand_id ON product_search(brand_id);
CREATE INDEX IF NOT EXISTS idx_product_search_category_id ON product_search(category_id);
CREATE INDEX IF NOT EXISTS idx_product_search_status ON product_search(status);
CREATE INDEX IF NOT EXISTS idx_product_search_price ON product_search(price);
CREATE INDEX IF NOT EXISTS idx_product_search_sale_price ON product_search(sale_price);

-- Step 5: Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_product_search_document ON product_search USING GIN (search_document);

-- Step 6: Create trigram indexes for typo tolerance
CREATE INDEX IF NOT EXISTS idx_product_search_name_trgm ON product_search USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_search_title_trgm ON product_search USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_search_brand_name_trgm ON product_search USING GIN (brand_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_search_sku_trgm ON product_search USING GIN (sku gin_trgm_ops);

-- Step 7: Create composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_product_search_category_status ON product_search(category_id, status);
CREATE INDEX IF NOT EXISTS idx_product_search_brand_status ON product_search(brand_id, status);
CREATE INDEX IF NOT EXISTS idx_product_search_price_status ON product_search(price, status);

-- Step 8: Create function to update search document
CREATE OR REPLACE FUNCTION update_product_search_document()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the search document with weighted fields
    NEW.search_document := 
        setweight(to_tsvector('simple', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.brand_name, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.category_name, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.category_level1, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.category_level2, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.category_level3, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.category_level4, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.tags::text, '')), 'C') ||
        setweight(to_tsvector('simple', COALESCE(NEW.keywords, '')), 'C') ||
        setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'D') ||
        setweight(to_tsvector('simple', COALESCE(NEW.short_description, '')), 'D');
    
    -- Update timestamp
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Create trigger to automatically update search document
DROP TRIGGER IF EXISTS trigger_update_product_search_document ON product_search;
CREATE TRIGGER trigger_update_product_search_document
    BEFORE INSERT OR UPDATE ON product_search
    FOR EACH ROW
    EXECUTE FUNCTION update_product_search_document();

-- Step 10: Create function to populate search table from products
CREATE OR REPLACE FUNCTION populate_product_search_table()
RETURNS void AS $$
BEGIN
    -- Clear existing data
    DELETE FROM product_search;
    
    -- Insert data from products table with joined information
    INSERT INTO product_search (
        product_id, name, title, description, short_description,
        brand_name, brand_id, category_name, category_id,
        category_level1, category_level2, category_level3, category_level4,
        tags, keywords, price, sale_price, sku, barcode, status, is_active
    )
    SELECT 
        p.id,
        p.name,
        p.title,
        p.description,
        p.short_description,
        bp.brand_name,
        p.brand_id,
        c.name as category_name,
        p.category_id,
        p.category_level1,
        p.category_level2,
        p.category_level3,
        p.category_level4,
        p.tags,
        p.keywords,
        p.price,
        p.sale_price,
        p.sku,
        p.barcode,
        p.status,
        p.is_active
    FROM products p
    LEFT JOIN brand_profiles bp ON p.brand_id = bp.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status != 'deleted';
    
    -- Update search documents for all inserted records
    UPDATE product_search SET search_document = NULL;
    UPDATE product_search SET search_document = NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create function for advanced search with ranking
CREATE OR REPLACE FUNCTION search_products(
    search_query TEXT,
    category_filter INTEGER DEFAULT NULL,
    brand_filter INTEGER DEFAULT NULL,
    min_price NUMERIC DEFAULT NULL,
    max_price NUMERIC DEFAULT NULL,
    status_filter TEXT DEFAULT 'active',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    product_id INTEGER,
    name TEXT,
    title TEXT,
    brand_name TEXT,
    category_name TEXT,
    price NUMERIC,
    sale_price NUMERIC,
    search_rank NUMERIC,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.product_id,
        ps.name,
        ps.title,
        ps.brand_name,
        ps.category_name,
        ps.price,
        ps.sale_price,
        ts_rank(ps.search_document, plainto_tsquery('simple', search_query)) as search_rank,
        CASE 
            WHEN ps.name ILIKE '%' || search_query || '%' THEN 1.0
            WHEN ps.title ILIKE '%' || search_query || '%' THEN 0.9
            WHEN ps.brand_name ILIKE '%' || search_query || '%' THEN 0.8
            WHEN ps.category_name ILIKE '%' || search_query || '%' THEN 0.7
            WHEN ps.tags::text ILIKE '%' || search_query || '%' THEN 0.6
            ELSE 0.5
        END as relevance_score
    FROM product_search ps
    WHERE 
        ps.search_document @@ plainto_tsquery('simple', search_query)
        AND (category_filter IS NULL OR ps.category_id = category_filter)
        AND (brand_filter IS NULL OR ps.brand_id = brand_filter)
        AND (min_price IS NULL OR ps.price >= min_price)
        AND (max_price IS NULL OR ps.price <= max_price)
        AND ps.status = status_filter
        AND ps.is_active = true
    ORDER BY 
        relevance_score DESC,
        search_rank DESC,
        ps.updated_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Step 12: Create function for fuzzy search with trigram similarity
CREATE OR REPLACE FUNCTION fuzzy_search_products(
    search_term TEXT,
    similarity_threshold NUMERIC DEFAULT 0.3,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
    product_id INTEGER,
    name TEXT,
    title TEXT,
    brand_name TEXT,
    category_name TEXT,
    price NUMERIC,
    sale_price NUMERIC,
    similarity_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.product_id,
        ps.name,
        ps.title,
        ps.brand_name,
        ps.category_name,
        ps.price,
        ps.sale_price,
        GREATEST(
            similarity(ps.name, search_term),
            similarity(ps.title, search_term),
            similarity(ps.brand_name, search_term),
            similarity(ps.sku, search_term)
        ) as similarity_score
    FROM product_search ps
    WHERE 
        (ps.name % search_term OR 
         ps.title % search_term OR 
         ps.brand_name % search_term OR 
         ps.sku % search_term)
        AND ps.status = 'active'
        AND ps.is_active = true
    ORDER BY similarity_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Create function to get search suggestions
CREATE OR REPLACE FUNCTION get_search_suggestions(
    partial_query TEXT,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
    suggestion TEXT,
    suggestion_type TEXT,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    (
        -- Product name suggestions
        SELECT DISTINCT
            ps.name as suggestion,
            'product' as suggestion_type,
            similarity(ps.name, partial_query) as relevance_score
        FROM product_search ps
        WHERE ps.name ILIKE partial_query || '%'
            AND ps.status = 'active'
            AND ps.is_active = true
        
        UNION
        
        -- Brand name suggestions
        SELECT DISTINCT
            ps.brand_name as suggestion,
            'brand' as suggestion_type,
            similarity(ps.brand_name, partial_query) as relevance_score
        FROM product_search ps
        WHERE ps.brand_name ILIKE partial_query || '%'
            AND ps.status = 'active'
            AND ps.is_active = true
        
        UNION
        
        -- Category suggestions
        SELECT DISTINCT
            ps.category_name as suggestion,
            'category' as suggestion_type,
            similarity(ps.category_name, partial_query) as relevance_score
        FROM product_search ps
        WHERE ps.category_name ILIKE partial_query || '%'
            AND ps.status = 'active'
            AND ps.is_active = true
        
        UNION
        
        -- Tag suggestions
        SELECT DISTINCT
            unnest(ps.tags) as suggestion,
            'tag' as suggestion_type,
            0.5 as relevance_score
        FROM product_search ps
        WHERE unnest(ps.tags) ILIKE partial_query || '%'
            AND ps.status = 'active'
            AND ps.is_active = true
    )
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Step 14: Create function to log search queries
CREATE OR REPLACE FUNCTION log_search_query(
    user_id_param INTEGER,
    query_text TEXT,
    results_count_param INTEGER
)
RETURNS void AS $$
BEGIN
    INSERT INTO search_logs (user_id, query, results_count, searched_at)
    VALUES (user_id_param, query_text, results_count_param, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Step 15: Create function to get search analytics
CREATE OR REPLACE FUNCTION get_search_analytics(
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    query TEXT,
    search_count BIGINT,
    avg_results_count NUMERIC,
    last_searched TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sl.query,
        COUNT(*) as search_count,
        AVG(sl.results_count) as avg_results_count,
        MAX(sl.searched_at) as last_searched
    FROM search_logs sl
    WHERE sl.searched_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY sl.query
    ORDER BY search_count DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Step 16: Populate the search table with existing data
SELECT populate_product_search_table();

-- Step 17: Create indexes on the original products table for the search document
CREATE INDEX IF NOT EXISTS idx_products_search_document ON products USING GIN (search_document);

-- Step 18: Create function to sync product changes to search table
CREATE OR REPLACE FUNCTION sync_product_to_search()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        DELETE FROM product_search WHERE product_id = OLD.id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Update search table
        UPDATE product_search SET
            name = NEW.name,
            title = NEW.title,
            description = NEW.description,
            short_description = NEW.short_description,
            brand_id = NEW.brand_id,
            category_id = NEW.category_id,
            category_level1 = NEW.category_level1,
            category_level2 = NEW.category_level2,
            category_level3 = NEW.category_level3,
            category_level4 = NEW.category_level4,
            tags = NEW.tags,
            keywords = NEW.keywords,
            price = NEW.price,
            sale_price = NEW.sale_price,
            sku = NEW.sku,
            barcode = NEW.barcode,
            status = NEW.status,
            is_active = NEW.is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.id;
        
        -- If no rows were updated, insert new record
        IF NOT FOUND THEN
            INSERT INTO product_search (
                product_id, name, title, description, short_description,
                brand_name, brand_id, category_name, category_id,
                category_level1, category_level2, category_level3, category_level4,
                tags, keywords, price, sale_price, sku, barcode, status, is_active
            )
            SELECT 
                NEW.id,
                NEW.name,
                NEW.title,
                NEW.description,
                NEW.short_description,
                bp.brand_name,
                NEW.brand_id,
                c.name as category_name,
                NEW.category_id,
                NEW.category_level1,
                NEW.category_level2,
                NEW.category_level3,
                NEW.category_level4,
                NEW.tags,
                NEW.keywords,
                NEW.price,
                NEW.sale_price,
                NEW.sku,
                NEW.barcode,
                NEW.status,
                NEW.is_active
            FROM products p
            LEFT JOIN brand_profiles bp ON p.brand_id = bp.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = NEW.id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        -- Insert new record into search table
        INSERT INTO product_search (
            product_id, name, title, description, short_description,
            brand_name, brand_id, category_name, category_id,
            category_level1, category_level2, category_level3, category_level4,
            tags, keywords, price, sale_price, sku, barcode, status, is_active
        )
        SELECT 
            NEW.id,
            NEW.name,
            NEW.title,
            NEW.description,
            NEW.short_description,
            bp.brand_name,
            NEW.brand_id,
            c.name as category_name,
            NEW.category_id,
            NEW.category_level1,
            NEW.category_level2,
            NEW.category_level3,
            NEW.category_level4,
            NEW.tags,
            NEW.keywords,
            NEW.price,
            NEW.sale_price,
            NEW.sku,
            NEW.barcode,
            NEW.status,
            NEW.is_active
        FROM products p
        LEFT JOIN brand_profiles bp ON p.brand_id = bp.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = NEW.id;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 19: Create trigger to automatically sync product changes
DROP TRIGGER IF EXISTS trigger_sync_product_to_search ON products;
CREATE TRIGGER trigger_sync_product_to_search
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION sync_product_to_search();

-- Step 20: Create trigger to sync brand profile changes
CREATE OR REPLACE FUNCTION sync_brand_profile_to_search()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Update brand name in search table when brand profile changes
        UPDATE product_search 
        SET brand_name = NEW.brand_name
        WHERE brand_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 21: Create trigger for brand profile changes
DROP TRIGGER IF EXISTS trigger_sync_brand_profile_to_search ON brand_profiles;
CREATE TRIGGER trigger_sync_brand_profile_to_search
    AFTER UPDATE ON brand_profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_brand_profile_to_search();

-- Step 22: Create trigger to sync category changes
CREATE OR REPLACE FUNCTION sync_category_to_search()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Update category name in search table when category changes
        UPDATE product_search 
        SET category_name = NEW.name
        WHERE category_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 23: Create trigger for category changes
DROP TRIGGER IF EXISTS trigger_sync_category_to_search ON categories;
CREATE TRIGGER trigger_sync_category_to_search
    AFTER UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION sync_category_to_search();

-- Step 24: Add comments for documentation
COMMENT ON TABLE product_search IS 'Denormalized search table for fast product search with FTS and trigram indexes';
COMMENT ON COLUMN product_search.search_document IS 'Full-text search document with weighted fields (A=name/title, B=brand/category, C=tags/keywords, D=description)';
COMMENT ON COLUMN product_search.search_rank IS 'PostgreSQL FTS ranking score';
COMMENT ON FUNCTION search_products IS 'Advanced product search with filtering and ranking';
COMMENT ON FUNCTION fuzzy_search_products IS 'Fuzzy search using trigram similarity for typo tolerance';
COMMENT ON FUNCTION get_search_suggestions IS 'Get search suggestions for autocomplete';
COMMENT ON FUNCTION log_search_query IS 'Log search queries for analytics';
COMMENT ON FUNCTION get_search_analytics IS 'Get search analytics and popular queries';

-- Step 25: Grant necessary permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON product_search TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- Migration completed successfully!
-- Your database now supports:
-- 1. ✅ PostgreSQL Full-Text Search (FTS) with GIN indexes
-- 2. ✅ Trigram Indexes for Typo Tolerance  
-- 3. ✅ Denormalized Search Table Approach
-- 4. ✅ Automatic synchronization between products and search table
-- 5. ✅ Advanced search functions with ranking and filtering
-- 6. ✅ Fuzzy search with similarity scoring
-- 7. ✅ Search suggestions and autocomplete
-- 8. ✅ Search analytics and logging
