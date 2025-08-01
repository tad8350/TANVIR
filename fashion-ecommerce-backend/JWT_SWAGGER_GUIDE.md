# JWT Authentication in Swagger - Complete Guide

## ✅ Authentication is Now Working!

The JWT authentication has been fixed and is working properly. Here's how to use it in Swagger:

## 🔧 What Was Fixed

1. **Swagger Bearer Auth Configuration**: Updated the Swagger configuration in `main.ts` to properly set up bearer authentication
2. **Added `@ApiBearerAuth()` Decorators**: Added the required decorators to protected endpoints
3. **Improved JWT Strategy**: Enhanced error handling in the JWT strategy
4. **Made Public Endpoints**: Added `@Public()` decorator to endpoints that don't require authentication
5. **Fixed Products/Categories/Brands**: Made GET endpoints public for better e-commerce experience

## 🚀 How to Use JWT Authentication in Swagger

### Step 1: Access Swagger UI
1. Start your server: `npm run start:dev`
2. Open Swagger UI: `http://localhost:3001/api`

### Step 2: Get a JWT Token
1. **Register a new user** (if you don't have one):
   - Go to the `Authentication` section
   - Use the `POST /auth/register` endpoint
   - Send this JSON:
   ```json
   {
     "email": "your-email@example.com",
     "password": "your-password",
     "user_type": "customer"
   }
   ```

2. **Or login with existing user**:
   - Use the `POST /auth/login` endpoint
   - Send this JSON:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Copy the access_token** from the response

### Step 3: Authorize in Swagger
1. Click the **"Authorize"** button at the top of the Swagger UI
2. In the authorization popup, enter your token in the format: `Bearer YOUR_TOKEN_HERE`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **"Authorize"**
4. Close the popup

### Step 4: Test Protected Endpoints
Now you can test any protected endpoint:
- `GET /auth/test` - Test authentication
- `GET /users/profile` - Get user profile
- `GET /users` - Get all users
- `POST /cart/add` - Add to cart
- And many more...

## 🔍 Testing Authentication

### Public Endpoints (No Auth Required)
- `GET /` - Hello world
- `GET /auth/health` - Health check
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /products` - Get all products (NEW!)
- `GET /products/:id` - Get product by ID (NEW!)
- `GET /categories` - Get all categories (NEW!)
- `GET /categories/:id` - Get category by ID (NEW!)
- `GET /brands` - Get all brands (NEW!)
- `GET /brands/:id` - Get brand by ID (NEW!)

### Protected Endpoints (Auth Required)
- `GET /auth/test` - Test authentication
- `GET /users/profile` - Get user profile
- `GET /users` - Get all users
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)
- `POST /categories` - Create category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)
- `POST /brands` - Create brand (Admin only)
- `PUT /brands/:id` - Update brand (Admin only)
- `DELETE /brands/:id` - Delete brand (Admin only)
- All cart, orders, payments endpoints

## 🛠️ Troubleshooting

### If you get 401 errors:

1. **Check your token format**:
   - Make sure it starts with `Bearer `
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

2. **Check token expiration**:
   - Tokens expire after 24 hours by default
   - Get a new token by logging in again

3. **Check server logs**:
   - Look for JWT strategy logs in the console
   - Check for any error messages

### If Swagger shows 401 for all endpoints:

1. **Make sure you're authorized**:
   - Click the "Authorize" button
   - Enter your token correctly
   - Close the popup

2. **Check the endpoint**:
   - Some endpoints are public and don't need auth
   - Look for the lock icon 🔒 in Swagger UI

## 📝 Code Changes Made

### 1. Updated `main.ts`
```typescript
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  },
  'JWT-auth', // This name is important for references
)
```

### 2. Added `@ApiBearerAuth()` to Controllers
```typescript
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  // ...
}
```

### 3. Made Public Endpoints
```typescript
@Get()
@Public()
getHello(): string {
  return this.appService.getHello();
}
```

### 4. Fixed Products/Categories/Brands
```typescript
// Public GET endpoints for e-commerce
@Get()
@Public()
async findAll() {
  // Get products without auth
}

// Protected admin operations
@Post()
@ApiBearerAuth('JWT-auth')
async create() {
  // Create product with auth
}
```

## 🎯 Quick Test

You can run the test scripts to verify everything works:

```bash
# Test authentication
node test-auth.js

# Test products endpoints
node test-products.js
```

This will test the complete authentication flow and public endpoints.

## 🔐 Security Notes

- JWT tokens expire after 24 hours
- Tokens are stored in the Authorization header
- All protected endpoints require valid JWT tokens
- Public endpoints are marked with `@Public()` decorator
- E-commerce browsing (products, categories, brands) is public
- Admin operations (create, update, delete) require authentication

## 📚 API Documentation

- **Swagger UI**: `http://localhost:3001/api`
- **Health Check**: `http://localhost:3001/auth/health`
- **Server**: `http://localhost:3001`

## 🛒 E-commerce Features

The following endpoints are now **public** (no authentication required):
- **Products**: Browse and search products
- **Categories**: View product categories
- **Brands**: View product brands

This allows customers to browse your e-commerce catalog without needing to log in first!

The authentication system is now fully functional and ready for use! 🎉 