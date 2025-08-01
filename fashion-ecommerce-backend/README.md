# Fashion E-Commerce Backend

A NestJS-based backend for a fashion e-commerce platform like Zalando.

## Features

- 🔐 JWT Authentication with Access & Refresh Tokens
- 🌐 Google OAuth Integration
- 👥 User Management
- 🛍️ Product Management with Variants
- 🛒 Shopping Cart
- 📦 Order Management
- 🏷️ Brand & Category Management
- 📊 Swagger API Documentation

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport.js
- **OAuth**: Google OAuth 2.0
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator + class-transformer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fashion-ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=fashion_ecommerce

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

   # Application Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up the database**
   - Create a PostgreSQL database named `fashion_ecommerce`
   - The application will automatically create tables using TypeORM synchronize

5. **Run the application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
- **Swagger UI**: http://localhost:3001/api

## Available Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/profile` - Get user profile (protected)

## Database Schema

The application uses the following main entities:
- **Users** - User accounts and authentication
- **Products** - Product catalog with variants
- **Brands** - Product brands
- **Categories** - Product categories
- **Orders** - Order management
- **Cart** - Shopping cart
- **Addresses** - User addresses

## Development

### Project Structure
```
src/
├── auth/           # Authentication module
├── users/          # User management
├── products/       # Product management
├── orders/         # Order management
├── cart/           # Shopping cart
├── common/         # Shared entities
├── config/         # Configuration
└── database/       # Database setup
```

### Adding New Features
1. Create new modules in their respective directories
2. Add entities to the TypeORM configuration
3. Update the main app module
4. Add Swagger documentation

## Next Steps

This is the basic setup. Next phases will include:
- Product CRUD operations
- Shopping cart functionality
- Order processing
- Payment integration
- Search with Elasticsearch
- Image upload with Cloudinary/AWS S3
- Email notifications
- Admin panel

## License

This project is licensed under the MIT License.
