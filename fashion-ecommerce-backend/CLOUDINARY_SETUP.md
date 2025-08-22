# Cloudinary Integration Setup Guide

This guide explains how to set up and use Cloudinary for image management in your Fashion E-commerce platform.

## Prerequisites

- Cloudinary account with the following credentials:
  - Cloud Name: `dgrmlche4`
  - API Key: `197247279183821`
  - API Secret: (your secret key)

## Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=dgrmlche4
CLOUDINARY_API_KEY=197247279183821
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Backend Setup

### 1. Dependencies Installed
- `cloudinary` - Core Cloudinary SDK
- `multer` - File upload middleware
- `@types/multer` - TypeScript types for multer

### 2. Configuration Files
- `src/config/cloudinary.config.ts` - Cloudinary initialization
- `src/common/services/cloudinary.service.ts` - Core Cloudinary operations

### 3. New API Endpoints
- `POST /image-upload/product` - Upload product images
- `POST /image-upload/brand-logo` - Upload brand logos
- `POST /image-upload/brand-banner` - Upload brand banners
- `POST /image-upload/delete` - Delete images

### 4. Database Changes
Run the migration: `add-cloudinary-fields.sql`

## Frontend Setup

### 1. Dependencies Installed
- `next-cloudinary` - Next.js Cloudinary integration
- `cloudinary` - Core Cloudinary SDK

### 2. Configuration Files
- `src/lib/cloudinary.ts` - Cloudinary utilities and functions
- `src/components/ui/image-upload.tsx` - Reusable image upload component

### 3. API Routes
- `src/app/api/cloudinary/delete/route.ts` - Frontend API for image deletion

## Usage Examples

### Backend - Upload Product Image

```typescript
import { CloudinaryService } from '../services/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadProductImage(buffer: Buffer) {
    const result = await this.cloudinaryService.uploadImage(buffer, {
      folder: 'fashion-ecommerce/products',
      transformation: {
        quality: 'auto',
        fetch_format: 'auto',
      },
    });
    
    return result;
  }
}
```

### Frontend - Upload Image

```typescript
import { ImageUpload } from '@/components/ui/image-upload';
import { uploadProductImage } from '@/lib/cloudinary';

function ProductForm() {
  const handleImageUpload = async (result) => {
    console.log('Uploaded:', result.public_id, result.secure_url);
    // Store the result in your form state
  };

  return (
    <ImageUpload
      onImageUpload={handleImageUpload}
      folder="fashion-ecommerce/products"
      label="Product Image"
      maxSize={5}
    />
  );
}
```

### Display Optimized Images

```typescript
import { CldImage } from 'next-cloudinary';

function ProductCard({ publicId }) {
  return (
    <CldImage
      src={publicId}
      alt="Product"
      width={300}
      height={300}
      crop="fill"
      quality="auto"
    />
  );
}
```

## Image Transformations

### Product Images
- **Thumbnail**: 150x150px, fill crop
- **Medium**: 400x400px, fill crop  
- **Large**: 800x800px, fill crop

### Brand Logos
- **Small**: 100x100px, fill crop
- **Medium**: 200x200px, fill crop
- **Large**: 400x400px, fill crop

### Brand Banners
- **Default**: 1200x400px, 3:1 aspect ratio, fill crop

## Folder Structure

```
fashion-ecommerce/
├── products/          # Product images
├── brands/
│   ├── logos/        # Brand logos
│   └── banners/      # Brand banners
└── reviews/          # Review images (future)
```

## Security Features

- File type validation (images only)
- File size limits (configurable)
- Role-based access control
- Secure upload presets
- Automatic image optimization

## Performance Optimizations

- Automatic format selection (WebP when supported)
- Quality optimization
- Responsive image sizes
- CDN delivery
- Lazy loading support

## Error Handling

- Upload failures
- Invalid file types
- Size limit exceeded
- Network errors
- Cloudinary API errors

## Monitoring

- Upload success/failure logs
- File size tracking
- Storage usage monitoring
- Performance metrics

## Troubleshooting

### Common Issues

1. **Upload Failed**
   - Check API credentials
   - Verify upload preset exists
   - Check file size limits

2. **Images Not Displaying**
   - Verify public_id format
   - Check Cloudinary account status
   - Validate transformation parameters

3. **Performance Issues**
   - Use appropriate image sizes
   - Enable lazy loading
   - Optimize transformation parameters

### Support

- Cloudinary Documentation: https://cloudinary.com/documentation
- Next.js Cloudinary: https://next-cloudinary.spacejelly.dev/
- NestJS File Upload: https://docs.nestjs.com/techniques/file-upload

## Future Enhancements

- Video upload support
- Advanced transformations
- AI-powered image optimization
- Bulk upload operations
- Image analytics and insights
