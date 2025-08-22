# Search Functionality Setup Guide

This guide explains how to set up and use the comprehensive search functionality for TAD Fashion E-commerce platform.

## 🚀 What We've Implemented

### 1. **PostgreSQL Full-Text Search (FTS) with GIN indexes**
- Fast text search with relevance ranking
- Weighted field scoring (name > title > brand > category > tags > description)
- Handles up to 50k-100k products with sub-250ms response times

### 2. **Trigram Indexes for Typo Tolerance**
- Fuzzy search using PostgreSQL's `pg_trgm` extension
- Handles typos and partial matches
- Great for brand names, SKUs, and product names

### 3. **Denormalized Search Table Approach**
- `product_search` table for optimized search performance
- Automatic synchronization with main products table
- Real-time updates via database triggers

## 📋 Prerequisites

- PostgreSQL 12+ with `pg_trgm` extension
- NestJS backend running
- Database connection configured
- Some product data in the database

## 🗄️ Database Setup

### Step 1: Run the Search Migration

```bash
# Navigate to backend directory
cd fashion-ecommerce-backend

# Run the migration on your database (replace 'tad' with your database name)
psql -U postgres -d tad -f search-migration.sql
```

### Step 2: Verify the Setup

Connect to your database and check:

```sql
-- Check if the search table was created
\d product_search

-- Check if indexes were created
\di idx_product_search*

-- Check if functions were created
\df search_products
\df fuzzy_search_products
\df get_search_suggestions

-- Check if triggers were created
\dft trigger_sync_product_to_search
```

### Step 3: Populate the Search Table

The migration automatically populates the search table, but you can manually refresh it:

```sql
-- Refresh the search table
SELECT populate_product_search_table();

-- Check the data
SELECT COUNT(*) FROM product_search;
SELECT * FROM product_search LIMIT 5;
```

## 🔧 Backend Setup

### Step 1: Install Dependencies

The search functionality uses existing dependencies. No additional packages needed.

### Step 2: Verify Entity Registration

Ensure `ProductSearch` is registered in your modules:

```typescript
// products.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductSearch, // ✅ This should be here
      // ... other entities
    ]),
  ],
  // ... rest of module config
})
```

### Step 3: Start the Backend

```bash
npm run start:dev
```

## 🧪 Testing the Search Functionality

### Option 1: Use the Test Script

```bash
# Install axios if not already installed
npm install axios

# Run the comprehensive test script
node test-search.js
```

### Option 2: Manual API Testing

#### Health Check
```bash
curl http://localhost:3001/search/health
```

#### Search Products
```bash
# Full-text search
curl -X POST http://localhost:3001/search/products \
  -H "Content-Type: application/json" \
  -d '{
    "query": "nike shoes",
    "type": "full_text",
    "page": 1,
    "limit": 10
  }'

# Fuzzy search
curl -X POST http://localhost:3001/search/products \
  -H "Content-Type: application/json" \
  -d '{
    "query": "nik",
    "type": "fuzzy",
    "page": 1,
    "limit": 10
  }'

# Exact search
curl -X POST http://localhost:3001/search/products \
  -H "Content-Type: application/json" \
  -d '{
    "query": "nike",
    "type": "exact",
    "page": 1,
    "limit": 10
  }'
```

#### Search Suggestions
```bash
# Simple suggestions
curl "http://localhost:3001/search/suggestions?query=nik&limit=5"

# Detailed suggestions
curl -X POST http://localhost:3001/search/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "query": "nik",
    "limit": 10
  }'
```

#### Admin Endpoints (Require Authentication)
```bash
# Get search analytics
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3001/search/analytics?daysBack=30"

# Get search table stats
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3001/search/stats"

# Refresh search table
curl -X POST -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3001/search/refresh"
```

## 📊 API Endpoints Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/search/products` | Advanced product search with filtering |
| `GET` | `/search/products` | Search via query parameters |
| `GET` | `/search/suggestions` | Get search suggestions |
| `POST` | `/search/suggestions` | Get detailed suggestions with types |
| `GET` | `/search/health` | Service health check |

### Admin Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/search/analytics` | Search analytics and popular queries |
| `POST` | `/search/refresh` | Manually refresh search table |
| `GET` | `/search/stats` | Search table statistics |

## 🔍 Search Types

### 1. **Full-Text Search (FTS)**
- **Use case**: General product search
- **Features**: Relevance ranking, weighted scoring
- **Performance**: Best for complex queries
- **Example**: `"nike running shoes"`

### 2. **Fuzzy Search**
- **Use case**: Typo tolerance, partial matches
- **Features**: Trigram similarity scoring
- **Performance**: Good for short queries
- **Example**: `"nik"` matches `"nike"`

### 3. **Exact Search**
- **Use case**: Precise matching
- **Features**: ILIKE with relevance scoring
- **Performance**: Fastest for exact matches
- **Example**: `"nike"` exact match

## 🎯 Search Parameters

### Basic Parameters
- `query`: Search term (required)
- `type`: Search type (`full_text`, `fuzzy`, `exact`)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)

### Filter Parameters
- `categoryId`: Filter by category
- `brandId`: Filter by brand
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `status`: Product status filter
- `includeInactive`: Include inactive products

### Sorting Parameters
- `sortBy`: Sort field (`relevance`, `price`, `name`)
- `sortOrder`: Sort direction (`asc`, `desc`)

## 📈 Performance Optimization

### Database Indexes
The migration creates optimized indexes:
- **GIN indexes** for full-text search
- **Trigram indexes** for fuzzy search
- **Composite indexes** for common filter combinations
- **B-tree indexes** for sorting and filtering

### Search Table Benefits
- **Denormalized structure** for fast queries
- **Automatic synchronization** via triggers
- **Optimized for search operations**
- **Reduced JOIN complexity**

## 🚨 Troubleshooting

### Common Issues

#### 1. **Migration Fails**
```bash
# Check PostgreSQL version
psql --version

# Ensure pg_trgm extension is available
psql -U postgres -d tad -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

#### 2. **Search Table Empty**
```sql
-- Check if products exist
SELECT COUNT(*) FROM products;

-- Manually populate search table
SELECT populate_product_search_table();

-- Check for errors in logs
SELECT * FROM product_search LIMIT 5;
```

#### 3. **Slow Search Performance**
```sql
-- Check index usage
EXPLAIN ANALYZE SELECT * FROM product_search WHERE search_document @@ plainto_tsquery('simple', 'nike');

-- Verify indexes exist
\di idx_product_search*

-- Check table statistics
SELECT * FROM pg_stat_user_tables WHERE tablename = 'product_search';
```

#### 4. **Triggers Not Working**
```sql
-- Check if triggers exist
\dft trigger_sync_product_to_search

-- Manually test trigger function
SELECT sync_product_to_search();

-- Check trigger events
SELECT * FROM information_schema.triggers WHERE trigger_name LIKE '%product_search%';
```

### Debug Commands

```sql
-- Check search table structure
\d product_search

-- Check function definitions
\df+ search_products
\df+ fuzzy_search_products

-- Check trigger definitions
\dft+

-- Monitor search performance
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM product_search WHERE search_document @@ plainto_tsquery('simple', 'nike');
```

## 🔮 Future Enhancements

### Phase 2: Advanced Features
- **Synonyms**: Product synonym mapping
- **Learning-to-rank**: ML-based result ranking
- **Search analytics**: User behavior tracking
- **A/B testing**: Search algorithm testing

### Phase 3: Scalability
- **Elasticsearch migration**: When product count > 100k
- **Redis caching**: Hot query caching
- **CDN integration**: Global search optimization
- **Multi-language support**: Internationalization

## 📚 Additional Resources

- [PostgreSQL Full-Text Search Documentation](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Trigram Extension](https://www.postgresql.org/docs/current/pgtrgm.html)
- [NestJS TypeORM Documentation](https://docs.nestjs.com/techniques/database)
- [Search Performance Best Practices](https://www.postgresql.org/docs/current/textsearch-features.html)

## 🎉 Success Metrics

Your search implementation is successful when:
- ✅ Search response times < 250ms for 10k+ products
- ✅ Typo tolerance works (e.g., "nik" finds "nike")
- ✅ Relevance ranking makes sense
- ✅ Filters work correctly
- ✅ Pagination is smooth
- ✅ Search suggestions are helpful

---

**Need Help?** Check the troubleshooting section above or run the test script to diagnose issues.
