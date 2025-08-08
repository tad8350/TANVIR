# Product Creation System Setup Guide

This guide explains how to set up and use the updated product creation system that supports comprehensive product management with color blocks, variants, and advanced options.

## Database Setup

### 1. Run the Migration Script

First, run the migration script to add the new fields to your existing database:

```bash
# Navigate to the backend directory
cd fashion-ecommerce-backend

# Run the migration script on your database
psql -d your_database_name -f migration.sql
```

Or if you're using a different database system, execute the SQL commands from `migration.sql` manually.

### 2. Verify Database Schema

The migration adds the following new fields to the `products` table:

- **Basic Information**: `title`, `short_description`, `price`, `sale_price`, `cost_price`, `barcode`
- **Category Hierarchy**: `category_level1`, `category_level2`, `category_level3`, `category_level4`, `category`
- **Inventory**: `low_stock_threshold`, `track_inventory`, `allow_backorders`, `max_order_quantity`, `min_order_quantity`
- **SEO & Marketing**: `meta_title`, `meta_description`, `keywords`, `tags`
- **Shipping**: `shipping_weight`, `shipping_length`, `shipping_width`, `shipping_height`, `free_shipping`, `shipping_class`
- **Tax**: `tax_class`, `tax_rate`
- **Advanced**: `is_virtual`, `is_downloadable`, `download_limit`, `download_expiry`, `has_variants`, `variant_type`

## Backend API Endpoints

### Product Creation

**POST** `/products`

Creates a new product with all its variants and images.

**Request Body:**
```json
{
  "name": "Nike Air Max",
  "title": "Nike Air Max 2024",
  "description": "Comfortable running shoes",
  "shortDescription": "Premium running shoes",
  "price": "99.99",
  "salePrice": "79.99",
  "costPrice": "50.00",
  "sku": "NIKE-AIR-MAX-001",
  "barcode": "1234567890123",
  "brand": "Nike",
  "status": "active",
  "categoryLevel1": "men",
  "categoryLevel2": "clothing",
  "categoryLevel3": "T-shirts",
  "categoryLevel4": "Basic T-shirts",
  "category": "men-clothing-tshirts-basic",
  "colorBlocks": [
    {
      "id": "block-1",
      "color": "Red",
      "newColor": "",
      "images": [],
      "sizes": [
        {
          "id": "size-1",
          "size": "M",
          "quantity": "100"
        },
        {
          "id": "size-2",
          "size": "L",
          "quantity": "50"
        }
      ]
    }
  ],
  "images": ["https://example.com/image1.jpg"],
  "hasVariants": true,
  "variantType": "color",
  "variants": [],
  "metaTitle": "Nike Air Max Running Shoes",
  "metaDescription": "Premium running shoes for athletes",
  "keywords": "running, shoes, nike, air max",
  "tags": ["running", "shoes", "nike"],
  "shippingWeight": "0.5",
  "shippingDimensions": {
    "length": "30",
    "width": "20",
    "height": "10"
  },
  "freeShipping": false,
  "shippingClass": "standard",
  "taxClass": "standard",
  "taxRate": "10.00",
  "trackInventory": true,
  "allowBackorders": false,
  "maxOrderQuantity": "10",
  "minOrderQuantity": "1",
  "isVirtual": false,
  "isDownloadable": false,
  "downloadLimit": "5",
  "downloadExpiry": "30"
}
```

### Dropdown Data Endpoints

**GET** `/products/brands/list` - Get all brands for dropdown
**GET** `/products/colors/list` - Get all colors for dropdown  
**GET** `/products/sizes/list` - Get all sizes for dropdown

## Frontend Integration

### 1. Environment Variables

Add the backend API URL to your frontend environment:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. API Service

The frontend uses the `apiService` from `@/lib/api` to communicate with the backend:

```typescript
import { apiService } from '@/lib/api';

// Create a product
const response = await apiService.createProduct(productData);

// Get dropdown data
const brands = await apiService.getBrands();
const colors = await apiService.getColors();
const sizes = await apiService.getSizes();
```

### 3. Form Validation

The frontend form includes comprehensive validation for:

- Required fields (name, title, price, brand, sku)
- Category selection (all levels must be completed)
- Color blocks (at least one required)
- Sizes and quantities (valid numbers required)

### 4. File Upload

Currently, the system handles image URLs. For file uploads, you would need to:

1. Implement a file upload endpoint in the backend
2. Update the frontend to upload files and get URLs
3. Pass the URLs in the `images` array

## Usage Examples

### Creating a Simple Product

```typescript
const productData = {
  name: "Basic T-Shirt",
  title: "Cotton Basic T-Shirt",
  price: "29.99",
  sku: "TSHIRT-001",
  brand: "Fashion Forward",
  status: "active",
  categoryLevel1: "men",
  categoryLevel2: "clothing", 
  categoryLevel3: "T-shirts",
  category: "men-clothing-tshirts",
  colorBlocks: [
    {
      id: "block-1",
      color: "Black",
      newColor: "",
      images: [],
      sizes: [
        { id: "size-1", size: "M", quantity: "50" },
        { id: "size-2", size: "L", quantity: "30" }
      ]
    }
  ],
  images: ["https://example.com/tshirt.jpg"],
  hasVariants: true,
  variantType: "color",
  variants: [],
  tags: ["t-shirt", "cotton", "basic"],
  trackInventory: true,
  allowBackorders: false,
  freeShipping: false
};

const response = await apiService.createProduct(productData);
```

### Creating a Complex Product with Multiple Colors

```typescript
const productData = {
  name: "Premium Sneakers",
  title: "Premium Athletic Sneakers",
  price: "129.99",
  salePrice: "99.99",
  sku: "SNEAKERS-001",
  brand: "Sports Elite",
  status: "active",
  categoryLevel1: "men",
  categoryLevel2: "shoes",
  categoryLevel3: "Sneakers",
  category: "men-shoes-sneakers",
  colorBlocks: [
    {
      id: "block-1",
      color: "White",
      newColor: "",
      images: [],
      sizes: [
        { id: "size-1", size: "8", quantity: "25" },
        { id: "size-2", size: "9", quantity: "30" },
        { id: "size-3", size: "10", quantity: "20" }
      ]
    },
    {
      id: "block-2", 
      color: "Black",
      newColor: "",
      images: [],
      sizes: [
        { id: "size-4", size: "8", quantity: "15" },
        { id: "size-5", size: "9", quantity: "20" },
        { id: "size-6", size: "10", quantity: "25" }
      ]
    }
  ],
  images: ["https://example.com/sneakers-white.jpg", "https://example.com/sneakers-black.jpg"],
  hasVariants: true,
  variantType: "color",
  variants: [],
  metaTitle: "Premium Athletic Sneakers - Comfort & Style",
  metaDescription: "High-quality athletic sneakers perfect for sports and casual wear",
  keywords: "sneakers, athletic, sports, running, shoes",
  tags: ["sneakers", "athletic", "sports", "running"],
  shippingWeight: "0.8",
  shippingDimensions: {
    length: "35",
    width: "25", 
    height: "15"
  },
  freeShipping: true,
  shippingClass: "express",
  taxClass: "standard",
  taxRate: "8.50",
  trackInventory: true,
  allowBackorders: false,
  maxOrderQuantity: "5",
  minOrderQuantity: "1",
  isVirtual: false,
  isDownloadable: false
};

const response = await apiService.createProduct(productData);
```

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Form validation prevents submission with invalid data
- **API Errors**: Network and server errors are caught and displayed to users
- **Database Errors**: Unique constraint violations (e.g., duplicate SKU) are handled
- **Loading States**: UI shows loading indicators during API calls

## Testing

### Backend Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Test product creation
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d @product-data.json

# Test dropdown endpoints
curl http://localhost:3001/products/brands/list
curl http://localhost:3001/products/colors/list
curl http://localhost:3001/products/sizes/list
```

### Frontend Testing

1. Fill out the product form with valid data
2. Submit the form
3. Verify the product is created in the database
4. Check that variants are created for each color/size combination
5. Verify images are saved correctly

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure your database is running and accessible
2. **Migration Errors**: Check that all new columns were added successfully
3. **API Errors**: Verify the backend is running on the correct port
4. **CORS Issues**: Ensure CORS is configured properly in the backend
5. **Validation Errors**: Check that all required fields are filled correctly

### Debug Tips

1. Check browser console for frontend errors
2. Check backend logs for API errors
3. Verify database schema with `\d products` (PostgreSQL)
4. Test API endpoints directly with Postman
5. Use browser dev tools to inspect network requests

## Next Steps

1. **File Upload**: Implement proper file upload functionality
2. **Image Processing**: Add image resizing and optimization
3. **Bulk Operations**: Add bulk product import/export
4. **Advanced Search**: Implement product search with filters
5. **Inventory Management**: Add stock alerts and reorder points
6. **Analytics**: Add product performance tracking
