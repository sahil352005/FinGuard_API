# FinGuard API

Finance Data Processing & Access Control Backend — built with Node.js, Express, TypeScript, Prisma, and SQLite.

**Live API:** https://finguardapi-production.up.railway.app

**API Docs (Swagger):** https://finguardapi-production.up.railway.app/api-docs

---

## Overview

FinGuard is a backend system for a finance dashboard where different users interact with financial records based on their roles. The system focuses on clean architecture, secure access control, and efficient data processing.

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** SQLite via Prisma ORM
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Security:** Helmet, CORS

---

## Architecture

```
Client → Routes → Middleware → Controllers → Services → Prisma ORM → Database
```

- **Routes** — define API endpoints
- **Middleware** — authentication, RBAC, input validation
- **Controllers** — handle request and response
- **Services** — business logic layer
- **Database** — SQLite via Prisma ORM

---

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| VIEWER | Read own transactions |
| ANALYST | Read transactions + dashboard analytics + trends |
| ADMIN | Full CRUD on transactions + user management |

RBAC is enforced via reusable middleware on every protected route.

---

## Features

- JWT-based authentication
- Role-based access control (VIEWER, ANALYST, ADMIN)
- Financial records CRUD (income & expense)
- Filtering by type, category, and date range
- Pagination on all list endpoints
- Dashboard analytics — totals, category breakdown, recent transactions
- Monthly and weekly trend analysis
- Soft delete for transactions
- Input validation with Zod on all endpoints
- Global error handling middleware
- Layered architecture with clear separation of concerns

---

## API Endpoints

### Base URL: `https://finguardapi-production.up.railway.app/api`

### Auth (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/profile` | Get current user profile |

### Users (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create user |
| GET | `/users` | Get all users (paginated) |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| PATCH | `/users/:id/activate` | Activate user |
| PATCH | `/users/:id/deactivate` | Deactivate user |

### Transactions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/transactions` | Admin | Create transaction |
| GET | `/transactions` | Admin, Analyst | List with filters |
| GET | `/transactions/:id` | All authenticated | Get by ID |
| PATCH | `/transactions/:id` | Admin | Update transaction |
| DELETE | `/transactions/:id` | Admin | Soft delete |

**Filter query params:**
- `type` — `INCOME` or `EXPENSE`
- `category` — partial match, case-insensitive
- `startDate` / `endDate` — ISO date string
- `page` — default `1`
- `limit` — default `10`, max `100`

### Dashboard (Analyst, Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/summary` | Total income, expense, net balance, category totals, recent transactions |
| GET | `/dashboard/trends` | Income/expense trends by month or week |

**Trends query params:**
- `granularity` — `monthly` (default) or `weekly`

---

## Authentication

Register or login to receive a JWT token, then pass it in the Authorization header on all protected routes:

```
Authorization: Bearer <token>
```

**Register body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ADMIN"
}
```

**Password requirements:** minimum 8 characters, one uppercase letter, one number, one special character (`!@#$%^&*`)

---

## Setup

### Prerequisites
- Node.js v16+
- yarn or npm

### Steps

```bash
# 1. Install dependencies
yarn install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and set JWT_SECRET

# 4. Generate Prisma client
yarn prisma:generate

# 5. Run database migrations
yarn prisma:migrate

# 6. (Optional) Seed sample data
yarn prisma:seed

# 7. Start development server
yarn dev
```

Server: `http://localhost:5000`

Swagger docs: `http://localhost:5000/api-docs`

---

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

---

## Response Format

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Validation error |
| 401 | Missing or invalid token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already exists) |
| 500 | Internal server error |

---

## Assumptions & Tradeoffs

- **SQLite** is used for simplicity. Switching to PostgreSQL only requires updating `DATABASE_URL` and re-running migrations — no code changes needed.
- **Transactions are user-scoped** — each user manages their own records. Admins create and manage transactions under their own account.
- **Soft delete** is used on transactions to preserve financial history and data integrity.
- **Role is assignable at registration** — intentional for this assignment. In production, role assignment would be restricted to admins only.
- **Trends computed in application layer** — SQLite does not support native date truncation, so monthly/weekly grouping is handled in code after fetching records.
- No rate limiting implemented — would use `express-rate-limit` in production.
- No refresh token mechanism — JWT expiry is set to 7 days for simplicity.

---

## Future Improvements

- PostgreSQL for production scalability
- Redis caching for dashboard analytics
- Rate limiting and structured logging
- Refresh token authentication
- Unit and integration tests
- CI/CD pipeline
