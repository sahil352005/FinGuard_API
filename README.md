# FinGuard API

A finance dashboard backend with role-based access control, built with Node.js, Express, TypeScript, Prisma, and SQLite.

**Live API:** https://finguardapi-production.up.railway.app

**API Docs (Swagger):** https://finguardapi-production.up.railway.app/api-docs

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite (via Prisma ORM)
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS

---

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API route definitions
├── middlewares/     # Auth, RBAC, validation, error handling
├── utils/           # JWT, password, response helpers, Zod schemas
├── types/           # TypeScript interfaces
├── config/          # Environment config
├── app.ts           # Express app setup
└── index.ts         # Entry point
prisma/
└── schema.prisma    # Database schema
```

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

# 3. Edit .env and set your JWT_SECRET

# 4. Generate Prisma client
yarn prisma:generate

# 5. Run database migrations
yarn prisma:migrate

# 6. (Optional) Seed sample data
yarn prisma:seed

# 7. Start development server
yarn dev
```

Server runs at: `http://localhost:5000`

Swagger docs at: `http://localhost:5000/api-docs`

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

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| VIEWER | Read own transactions |
| ANALYST | Read transactions + dashboard + trends |
| ADMIN | Full CRUD on transactions + user management |

---

## API Endpoints

### Base URL: `http://localhost:5000/api`

### Health Check
```
GET /health
```

---

### Auth (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/profile` | Get current user profile |

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

**Login body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

> All protected routes require: `Authorization: Bearer <token>`

---

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

---

### Transactions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/transactions` | Admin | Create transaction |
| GET | `/transactions` | Admin, Analyst | List transactions (with filters) |
| GET | `/transactions/:id` | All authenticated | Get by ID |
| PATCH | `/transactions/:id` | Admin | Update transaction |
| DELETE | `/transactions/:id` | Admin | Soft delete transaction |

**Create transaction body:**
```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01T00:00:00.000Z",
  "note": "Monthly salary"
}
```

**Filter query params** (`GET /transactions`):
- `type` — `INCOME` or `EXPENSE`
- `category` — partial match, case-insensitive
- `startDate` — ISO date string
- `endDate` — ISO date string
- `page` — default `1`
- `limit` — default `10`, max `100`

---

### Dashboard (Analyst, Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/summary` | Total income, expense, net balance, category totals, recent transactions |
| GET | `/dashboard/trends?granularity=monthly` | Income/expense trends by month or week |

**Trends query params:**
- `granularity` — `monthly` (default) or `weekly`

**Trends response:**
```json
{
  "success": true,
  "data": {
    "granularity": "monthly",
    "trends": [
      {
        "period": "2026-04",
        "income": 10000,
        "expense": 3000,
        "net": 7000
      }
    ]
  }
}
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

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (`!@#$%^&*`)

---

## Key Features

- JWT authentication with role-based access control
- Full CRUD for financial transactions (income/expense)
- Soft delete — deleted records are flagged, not removed
- Filtering by type, category, and date range
- Pagination on all list endpoints
- Dashboard summary with aggregated analytics
- Monthly and weekly trend analysis
- Zod validation on all inputs
- Global error handling middleware
- Database indexing for query performance

---

## Assumptions & Tradeoffs

- **SQLite** is used for simplicity. Switching to PostgreSQL only requires updating `DATABASE_URL` in `.env` and re-running migrations.
- **Transactions are user-scoped** — each user only sees their own transactions. Admins manage records under their own account.
- **Soft delete** is used on transactions to preserve financial history and data integrity.
- **Role is set at registration** — this is intentional for the assignment. In production, role assignment would be admin-only.
- **Trends are computed in-memory** — SQLite does not support native date truncation functions, so grouping by month/week is done in application code after fetching records.
- No rate limiting is implemented — would add in production using `express-rate-limit`.
- No refresh token mechanism — JWT expiry is set to 7 days for development convenience.
