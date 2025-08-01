# Authentication Setup Guide

## Environment Variables Required

Create a `.env` file in the backend root directory with the following variables:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=fashion_ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## JWT Secret Generation

Generate a secure JWT secret using one of these methods:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

## API Endpoints

### Public Endpoints (No Authentication Required)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Protected Endpoints (Authentication Required)
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update current user profile
- All other endpoints require authentication

## Testing the Authentication

### 1. Register a new user:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "user_type": "customer"
  }'
```

### 2. Login:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access protected endpoint:
```bash
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Features Implemented

✅ **JWT Authentication**
- Login endpoint
- Register endpoint
- JWT token generation and validation
- Password hashing with bcrypt

✅ **Route Protection**
- Global authentication guard
- Public route decorator
- Current user decorator

✅ **User Management**
- User creation with password hashing
- Email-based user lookup
- Profile management

✅ **Security Features**
- Password hashing with bcrypt
- JWT token expiration
- Protected routes
- Input validation

## Next Steps

1. Set up your `.env` file with the required variables
2. Start the backend server
3. Test the authentication endpoints
4. Begin frontend development with working auth 