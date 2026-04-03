# FinGuard API - Production-Quality Finance Dashboard Backend

A comprehensive, production-ready backend system for a finance dashboard with role-based access control, built with Node.js, Express, TypeScript, and Prisma.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Code Quality](#code-quality)

## ✨ Features

### 1. Authentication & Security
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Token expiration and refresh strategies
- Secure password validation rules

### 2. User & Role Management
- Three role types: **Viewer**, **Analyst**, **Admin**
- User status management (Active/Inactive)
- Admin-only user creation and management
- User profile endpoints
- User activation/deactivation

### 3. Financial Records Management
- Complete CRUD operations for transactions
- Transaction types: Income/Expense
- Categorized transactions
- Timestamped records
- Soft-delete functionality for data integrity

### 4. Advanced Filtering & Pagination
- Filter by transaction type (income/expense)
- Filter by category
- Filter by date range (startDate/endDate)
- Pagination support with page and limit
- Efficient database queries with proper indexing

### 5. Dashboard & Analytics
- Aggregated dashboard summary
- Total income calculation
- Total expense calculation
- Net balance computation
- Category-wise totals with breakdown
- Recent transactions (last 5)
- Built with Prisma aggregation for performance

### 6. Role-Based Access Control (RBAC)
- **Viewer**: Read-only access to their own transactions
- **Analyst**: View transactions + access dashboard analytics
- **Admin**: Full CRUD access + user management

### 7. Validation & Error Handling
- Zod schema validation for all inputs
- Comprehensive error responses
- Proper HTTP status codes
- Field-level validation errors
- Global error handling middleware

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with SQLite fallback)
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Security**: Helmet, CORS
- **Development**: ts-node, TypeScript

## 📁 Project Structure

```
FinGuard-API/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── transactionController.ts
│   │   └── index.ts
│   ├── services/            # Business logic layer
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── transactionService.ts
│   │   └── index.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   └── index.ts
│   ├── middlewares/         # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── rbac.ts         # Role-based authorization
│   │   ├── errorHandler.ts # Error handling
│   │   ├── validation.ts   # Request validation
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── jwt.ts          # JWT operations
│   │   ├── password.ts     # Password hashing
│   │   ├── validation.ts   # Zod schemas
│   │   ├── response.ts     # Response formatters
│   │   ├── prisma.ts       # Prisma client
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── config/             # Configuration
│   │   └── index.ts
│   ├── app.ts              # Express app setup
│   └── index.ts            # Entry point
├── prisma/
│   └── schema.prisma       # Database schema
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (optional, SQLite is included for development)

### Steps

1. **Clone the repository**
```bash
cd FinGuard-API
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see Configuration section below)

5. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations and create database
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed
```

## ⚙️ Configuration

### Environment Variables

Edit `.env` file:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (choose one)
# For PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/finguard"

# For SQLite (development):
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=7d

# Bcrypt
BCRYPT_ROUNDS=10

# CORS (optional)
CORS_ORIGIN=http://localhost:3000
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&*)

## 📊 Database Setup

### Using SQLite (Default)
```bash
npm run prisma:migrate
```

### Using PostgreSQL
1. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/finguard"
```

2. Create database and run migrations:
```bash
npm run prisma:migrate
```

3. View database with Prisma Studio:
```bash
npm run prisma:studio
```

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

Server will start on `http://localhost:5000`

Health check: `http://localhost:5000/health`

## 🔐 Authentication

### JWT Token Flow

1. **Register/Login** → Get Token
```
POST /api/auth/register
POST /api/auth/login
↓
Returns: { token: "jwt_token", user: { ...user_data } }
```

2. **Add Token to Headers**
```
Authorization: Bearer jwt_token
```

3. **Access Protected Routes**
```
GET /api/auth/profile (with Authorization header)
```

### Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## 👥 Role-Based Access Control

### Role Hierarchy

| Role | Permissions |
|------|------------|
| **VIEWER** | Read own transactions |
| **ANALYST** | Read transactions + View analytics + Dashboard access |
| **ADMIN** | Full CRUD + User management |

### Access Control Rules

```
Authentication: REQUIRED for all API endpoints

/auth/register     → PUBLIC
/auth/login        → PUBLIC

/auth/profile      → ALL AUTHENTICATED USERS
/users/*           → ADMIN ONLY
/transactions      → ANALYST, ADMIN (GET), ADMIN ONLY (POST, PATCH, DELETE)
/dashboard/*       → ANALYST, ADMIN
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

**Success Response**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* validation errors */ }
}
```

## 🔑 Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "VIEWER",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "User registered successfully"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { /* user data */ }
  },
  "message": "Login successful"
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": { /* current user data */ }
}
```

## 👤 User Management Endpoints (Admin Only)

### Create User
```
POST /users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "ANALYST"
}

Response: 201 Created
```

### Get All Users
```
GET /users?page=1&limit=10
Authorization: Bearer {admin_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "data": [ /* user array */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Get User by ID
```
GET /users/{userId}
Authorization: Bearer {admin_token}

Response: 200 OK
```

### Update User
```
PATCH /users/{userId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "firstName": "Updated",
  "role": "ADMIN",
  "status": "ACTIVE"
}

Response: 200 OK
```

### Delete User
```
DELETE /users/{userId}
Authorization: Bearer {admin_token}

Response: 200 OK
```

### Deactivate User
```
PATCH /users/{userId}/deactivate
Authorization: Bearer {admin_token}

Response: 200 OK
```

### Activate User
```
PATCH /users/{userId}/activate
Authorization: Bearer {admin_token}

Response: 200 OK
```

## 💰 Transaction Endpoints

### Create Transaction (Admin Only)
```
POST /transactions
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "amount": 5000.00,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-01-15T00:00:00Z",
  "note": "Monthly salary"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "cuid",
    "userId": "user_id",
    "amount": 5000.00,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T00:00:00Z",
    "note": "Monthly salary",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Transactions (with Filters)
```
GET /transactions?type=INCOME&category=Salary&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "data": [ /* transaction array */ ],
    "pagination": { /* pagination info */ }
  }
}
```

**Query Parameters:**
- `type` (optional): INCOME or EXPENSE
- `category` (optional): Filter by category name
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `page` (default: 1): Page number
- `limit` (default: 10): Records per page

### Get Transaction by ID
```
GET /transactions/{transactionId}
Authorization: Bearer {token}

Response: 200 OK
```

### Update Transaction (Admin Only)
```
PATCH /transactions/{transactionId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "amount": 5500.00,
  "category": "Salary Bonus"
}

Response: 200 OK
```

### Delete Transaction (Admin Only)
```
DELETE /transactions/{transactionId}
Authorization: Bearer {admin_token}

Response: 200 OK
```

## 📊 Dashboard Endpoints

### Get Dashboard Summary (Analyst/Admin Only)
```
GET /dashboard/summary
Authorization: Bearer {analyst_or_admin_token}

Response: 200 OK
{
  "success": true,
  "data": {
    "totalIncome": 50000.00,
    "totalExpense": 15000.00,
    "netBalance": 35000.00,
    "categoryWiseTotals": [
      {
        "category": "Salary",
        "total": 50000.00,
        "type": "INCOME"
      },
      {
        "category": "Food",
        "total": 5000.00,
        "type": "EXPENSE"
      }
    ],
    "recentTransactions": [
      { /* transaction details */ },
      { /* transaction details */ }
    ]
  }
}
```

## ❌ Error Handling

### Common Error Codes

| Code | Error | Cause |
|------|-------|-------|
| 400 | Validation Error | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

### Example Error Responses

**Validation Error**
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "email": "Invalid email address",
    "password": "Password must be at least 8 characters"
  }
}
```

**Authentication Error**
```json
{
  "success": false,
  "error": "No authentication token provided"
}
```

**Authorization Error**
```json
{
  "success": false,
  "error": "Insufficient permissions for this action"
}
```

## ✅ Code Quality

### Best Practices Implemented

1. **Clean Architecture**
   - Clear separation of concerns (Routes → Controllers → Services)
   - Single Responsibility Principle
   - Dependency Injection through service layer

2. **Type Safety**
   - Full TypeScript implementation
   - Strict type checking enabled
   - Interface definitions for all data structures

3. **Validation**
   - Zod schema validation for all inputs
   - Field-level error reporting
   - Server-side validation enforced

4. **Error Handling**
   - Custom AppError class
   - Global error handler middleware
   - Consistent error response format

5. **Security**
   - JWT token-based authentication
   - bcrypt password hashing
   - Helmet for HTTP headers
   - CORS protection
   - Input validation on all endpoints

6. **Database**
   - Prisma ORM for type safety
   - Database indexing for performance
   - Soft delete functionality
   - Implicit relations between models

7. **Code Organization**
   - Modular folder structure
   - Reusable middleware
   - Utility functions for common operations
   - Single entry point

## 📝 Sample .env Configuration

```env
# Development
NODE_ENV=development
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRATION=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000

# Production
# NODE_ENV=production
# PORT=3000
# DATABASE_URL=postgresql://user:password@db-host:5432/finguard
# JWT_SECRET=production_secret_key_with_high_entropy
# JWT_EXPIRATION=24h
# BCRYPT_ROUNDS=12
```

## 🧪 Testing the API

### Using cURL

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Get Profile** (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API collection
2. Set `{{base_url}}` variable to `http://localhost:5000/api`
3. After login, set `{{token}}` from response
4. Use `Authorization` header: `Bearer {{token}}`

## 📈 Performance Considerations

1. **Database Indexes**: Applied on frequently queried fields (email, role, status, type, date, isDeleted)
2. **Pagination**: Limits query results for large datasets
3. **Aggregation**: Uses Prisma's efficient groupBy for dashboard queries
4. **Connection Pooling**: Prisma handles connection management
5. **Soft Delete**: Preserves data integrity without redesigning schemas

## 🚀 Deployment

### Containerization (Docker)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t finguard-api .
docker run -p 5000:5000 --env-file .env finguard-api
```

### Environment Setup for Production

1. Use strong `JWT_SECRET` (minimum 32 characters)
2. Enable HTTPS in production
3. Set `JWT_EXPIRATION` appropriately (e.g., "24h")
4. Increase `BCRYPT_ROUNDS` (e.g., 12) for better security
5. Use PostgreSQL with proper backups
6. Enable database SSL connections
7. Setup environment-specific logging

## 📞 Support & Issues

For issues or questions, please:
1. Check existing documentation
2. Review error messages carefully
3. Verify environment configuration
4. Check database connectivity

## 📄 License

MIT License

---

**Built with ❤️ for production-quality backend development**
