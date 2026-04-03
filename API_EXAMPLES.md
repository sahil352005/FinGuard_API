# FinGuard API - cURL Examples

This document provides cURL examples for testing all API endpoints.

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass@123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@finguard.com",
    "password": "Admin@123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cuid",
      "email": "admin@finguard.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Login successful"
}
```

**Save the token for further requests:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👤 User Management Endpoints (Admin Only)

### 4. Create New User (Admin)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newanalyst@example.com",
    "password": "SecurePass@123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "ANALYST"
  }'
```

### 5. Get All Users (Admin)
```bash
# Get all users with pagination
curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Get specific page
curl -X GET "http://localhost:5000/api/users?page=2&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Get User by ID (Admin)
```bash
curl -X GET "http://localhost:5000/api/users/{userId}" \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Update User (Admin)
```bash
curl -X PATCH "http://localhost:5000/api/users/{userId}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "role": "ADMIN",
    "status": "ACTIVE"
  }'
```

### 8. Deactivate User (Admin)
```bash
curl -X PATCH "http://localhost:5000/api/users/{userId}/deactivate" \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Activate User (Admin)
```bash
curl -X PATCH "http://localhost:5000/api/users/{userId}/activate" \
  -H "Authorization: Bearer $TOKEN"
```

### 10. Delete User (Admin)
```bash
curl -X DELETE "http://localhost:5000/api/users/{userId}" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💰 Transaction Endpoints

### 11. Create Transaction (Admin Only)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000.50,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T00:00:00Z",
    "note": "Monthly salary payment"
  }'
```

**Different Transaction Types:**

Income example:
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "type": "INCOME",
    "category": "Freelance",
    "date": "2024-01-15T00:00:00Z",
    "note": "Project payment"
  }'
```

Expense example:
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2000,
    "type": "EXPENSE",
    "category": "Groceries",
    "date": "2024-01-15T00:00:00Z",
    "note": "Weekly shopping"
  }'
```

### 12. Get All Transactions
```bash
# Get all transactions (no filters)
curl -X GET "http://localhost:5000/api/transactions?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Filter by type
curl -X GET "http://localhost:5000/api/transactions?type=INCOME" \
  -H "Authorization: Bearer $TOKEN"

# Filter by category
curl -X GET "http://localhost:5000/api/transactions?category=Salary" \
  -H "Authorization: Bearer $TOKEN"

# Filter by date range
curl -X GET "http://localhost:5000/api/transactions?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer $TOKEN"

# Combined filters with pagination
curl -X GET "http://localhost:5000/api/transactions?type=INCOME&category=Salary&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### 13. Get Transaction by ID
```bash
curl -X GET "http://localhost:5000/api/transactions/{transactionId}" \
  -H "Authorization: Bearer $TOKEN"
```

### 14. Update Transaction (Admin Only)
```bash
curl -X PATCH "http://localhost:5000/api/transactions/{transactionId}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5500.75,
    "category": "Bonus",
    "note": "Updated salary with bonus"
  }'
```

### 15. Delete Transaction (Admin Only)
```bash
curl -X DELETE "http://localhost:5000/api/transactions/{transactionId}" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Dashboard Endpoints

### 16. Get Dashboard Summary (Analyst/Admin Only)
```bash
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 60000,
    "totalExpense": 7500,
    "netBalance": 52500,
    "categoryWiseTotals": [
      {
        "category": "Salary",
        "total": 50000,
        "type": "INCOME"
      },
      {
        "category": "Freelance",
        "total": 10000,
        "type": "INCOME"
      },
      {
        "category": "Rent",
        "total": 5000,
        "type": "EXPENSE"
      },
      {
        "category": "Groceries",
        "total": 2500,
        "type": "EXPENSE"
      }
    ],
    "recentTransactions": [
      {
        "id": "cuid",
        "userId": "user_id",
        "amount": 2500,
        "type": "EXPENSE",
        "category": "Groceries",
        "date": "2024-01-15T00:00:00Z",
        "note": "Weekly shopping",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## ✅ Health Check

### 17. Health Check (No Authentication)
```bash
curl -X GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🧪 Complete Test Workflow

### Step 1: Register as Admin
```bash
export ADMIN_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@finguard.com",
    "password": "Admin@123456"
  }' | jq -r '.data.token')

echo "Admin Token: $ADMIN_TOKEN"
```

### Step 2: Create a transaction
```bash
curl -s -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T00:00:00Z",
    "note": "Monthly salary"
  }' | jq '.'
```

### Step 3: Get dashboard summary
```bash
curl -s -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
```

### Step 4: Create analyst user
```bash
curl -s -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@example.com",
    "password": "SecurePass@123",
    "firstName": "Test",
    "lastName": "Analyst",
    "role": "ANALYST"
  }' | jq '.'
```

### Step 5: Login as analyst and access analytics
```bash
export ANALYST_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@example.com",
    "password": "SecurePass@123"
  }' | jq -r '.data.token')

curl -s -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $ANALYST_TOKEN" | jq '.'
```

---

## ❌ Error Scenarios

### Invalid Credentials
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@finguard.com",
    "password": "WrongPassword"
  }'

# Response: 401 Unauthorized
# { "success": false, "error": "Invalid email or password" }
```

### Missing Authentication Token
```bash
curl -X GET http://localhost:5000/api/auth/profile

# Response: 401 Unauthorized
# { "success": false, "error": "No authentication token provided" }
```

### Insufficient Permissions (Viewer trying to create transaction)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T00:00:00Z"
  }'

# Response: 403 Forbidden
# { "success": false, "error": "Insufficient permissions for this action" }
```

### Validation Error
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "weak",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Response: 400 Bad Request
# { "success": false, "error": "Validation error", "details": {...} }
```

---

## 📝 Notes

- Replace `$TOKEN`, `{userId}`, `{transactionId}` with actual values
- Use `jq` for pretty-printing JSON responses (install with `npm install -g jq`)
- Save tokens in environment variables for easier testing
- All dates should be in ISO 8601 format (e.g., `2024-01-15T00:00:00Z`)
- Refer to README.md for detailed API documentation

---

**Last Updated**: 2024
