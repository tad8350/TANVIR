# Backend Setup Guide

This guide will help you set up the backend with the new product creation system.

## Step 1: Run the Database Migration

### Option A: Using psql command line
```bash
# Navigate to your project directory
cd fashion-ecommerce-backend

# Run the migration (replace 'tad' with your actual database name)
psql -U postgres -d tad -f migration.sql
```

### Option B: Using pgAdmin
1. Open pgAdmin
2. Connect to your database
3. Open the Query Tool
4. Copy and paste the contents of `migration.sql`
5. Execute the script

### Option C: Manual execution
If you get errors, you can run the commands manually one by one:

```sql
-- Make brand_id nullable
ALTER TABLE products ALTER COLUMN brand_id DROP NOT NULL;

-- Add new columns
ALTER TABLE products ADD COLUMN title text;
ALTER TABLE products ADD COLUMN short_description text;
ALTER TABLE products ADD COLUMN price numeric;
-- ... (continue with all other columns)

-- Add sample data
INSERT INTO colors (name) SELECT 'Red' WHERE NOT EXISTS (SELECT 1 FROM colors WHERE name = 'Red');
-- ... (continue with all other inserts)
```

## Step 2: Verify the Migration

Connect to your database and check if the new columns were added:

```sql
-- Check the products table structure
\d products

-- Check if sample data was inserted
SELECT * FROM colors LIMIT 5;
SELECT * FROM sizes LIMIT 5;
SELECT * FROM categories LIMIT 5;
```

## Step 3: Start the Backend Server

```bash
# Navigate to backend directory
cd fashion-ecommerce-backend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run start:dev
```

The server should start on `http://localhost:3001`

## Step 4: Test the API

### Option A: Using the test script
```bash
# Install axios if not already installed
npm install axios

# Run the test script
node test-product-api.js
```

### Option B: Using curl
```bash
# Test brands endpoint
curl http://localhost:3001/products/brands/list

# Test colors endpoint
curl http://localhost:3001/products/colors/list

# Test sizes endpoint
curl http://localhost:3001/products/sizes/list
```

### Option C: Using Postman
1. Open Postman
2. Create a new request
3. Set method to GET
4. Enter URL: `http://localhost:3001/products/brands/list`
5. Send the request

## Step 5: Test Product Creation

Create a test product using curl:

```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "title": "Test Product Title",
    "price": "29.99",
    "sku": "TEST-001",
    "brand": "Test Brand",
    "status": "active",
    "categoryLevel1": "men",
    "categoryLevel2": "clothing",
    "categoryLevel3": "T-shirts",
    "category": "men-clothing-tshirts",
    "colorBlocks": [
      {
        "id": "block-1",
        "color": "Black",
        "newColor": "",
        "images": [],
        "sizes": [
          {
            "id": "size-1",
            "size": "M",
            "quantity": "50"
          }
        ]
      }
    ],
    "images": ["https://example.com/test.jpg"],
    "hasVariants": true,
    "variantType": "color",
    "variants": [],
    "tags": ["test"],
    "trackInventory": true,
    "allowBackorders": false,
    "freeShipping": false
  }'
```

## Troubleshooting

### Common Issues:

1. **Migration errors**: 
   - Make sure you're connected to the right database
   - Check if columns already exist before adding them
   - Use the manual approach if automatic fails

2. **Connection errors**:
   - Verify PostgreSQL is running
   - Check your database credentials
   - Ensure the database exists

3. **Backend server errors**:
   - Check if all dependencies are installed
   - Verify database connection in your config
   - Check the console for error messages

4. **API errors**:
   - Make sure the server is running on port 3001
   - Check if CORS is configured properly
   - Verify the endpoints are accessible

### Debug Commands:

```bash
# Check if PostgreSQL is running
pg_isready

# List all databases
psql -U postgres -c "\l"

# Connect to your database
psql -U postgres -d tad

# Check table structure
\d products
\d colors
\d sizes
\d categories
```

## Next Steps

Once the backend is working:

1. **Test the frontend integration**:
   - Set up the frontend environment variables
   - Test the product creation form
   - Verify data is being saved correctly

2. **Add more features**:
   - File upload functionality
   - Image processing
   - Bulk operations
   - Advanced search

3. **Production deployment**:
   - Set up proper environment variables
   - Configure production database
   - Set up monitoring and logging

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify database connectivity
3. Test individual endpoints
4. Check the migration script syntax
5. Ensure all dependencies are installed
