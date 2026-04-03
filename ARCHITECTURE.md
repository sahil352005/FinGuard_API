# FinGuard API - Architecture & Design Documentation

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                        │
│                   (Web/Mobile/Desktop)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │    Express.js Application      │
        │  (HTTP Server on Port 5000)    │
        └────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │    Middleware Layer            │
        │  - CORS / Helmet (Security)    │
        │  - Authentication              │
        │  - RBAC Authorization          │
        │  - Validation                  │
        │  - Error Handling              │
        └────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │      Routes & Controllers      │
        │  - Auth routes                 │
        │  - User routes                 │
        │  - Transaction routes          │
        │  - Dashboard routes            │
        └────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │     Services (Business Logic)  │
        │  - authService                 │
        │  - userService                 │
        │  - transactionService          │
        └────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │    Prisma ORM                  │
        │  (Type-safe database access)   │
        └────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │    Database Layer              │
        │  - PostgreSQL (Production)     │
        │  - SQLite (Development)        │
        └────────────────────────────────┘
```

## 🏗️ Clean Architecture Implementation

### 1. **Routes Layer**
- **Responsibility**: Define HTTP routes and endpoints
- **Files**: `authRoutes.ts`, `userRoutes.ts`, `transactionRoutes.ts`, `dashboardRoutes.ts`
- **Characteristics**:
  - Routes are grouped by feature
  - Each route is protected with appropriate middleware
  - Routes delegate to controllers
  - No business logic here

**Example:**
```typescript
router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(CreateTransactionSchema, "body"),
  transactionController.createTransaction
);
```

### 2. **Controllers Layer**
- **Responsibility**: Handle HTTP requests and responses
- **Files**: `authController.ts`, `userController.ts`, `transactionController.ts`
- **Characteristics**:
  - Thin controllers (minimal logic)
  - Delegate to services
  - Handle request/response formatting
  - Error handling and status codes
  - Extract request data (body, params, query)

**Example:**
```typescript
async createTransaction(req: AuthRequest, res: Response): Promise<void> {
  try {
    const transaction = await transactionService.createTransaction(
      req.user.userId,
      req.body
    );
    sendSuccess(res, transaction, 201);
  } catch (error) {
    sendError(res, error, 500);
  }
}
```

### 3. **Services Layer**
- **Responsibility**: Implement business logic
- **Files**: `authService.ts`, `userService.ts`, `transactionService.ts`
- **Characteristics**:
  - Core business logic
  - Database operations
  - Data validation and transformation
  - Error handling

**Example:**
```typescript
async createTransaction(userId: string, data: CreateTransactionDTO) {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount: data.amount,
      // ... other fields
    },
  });

  return mapTransactionToResponse(transaction);
}
```

### 4. **Database Layer**
- **Responsibility**: Data persistence and queries
- **Tools**: Prisma ORM with PostgreSQL/SQLite
- **Characteristics**:
  - Type-safe queries
  - Automatic migrations
  - Indexed fields for performance
  - Relationship management

## 🔐 Security Architecture

### Authentication Flow

```
User Login
    ↓
[Email + Password]
    ↓
Validate credentials
    ↓
Hash match check
    ↓
Generate JWT Token
    ↓
Return Token + User Data
    ↓
Client stores token
```

### Authorization Flow

```
Request with Token
    ↓
Extract token from header
    ↓
Verify JWT signature
    ↓
Check token expiration
    ↓
Decode payload (userId, role, email)
    ↓
extract user info from request
    ↓
Check user role against endpoint requirements
    ↓
If authorized → Allow request
    ↓
If not → Return 403 Forbidden
```

### Middleware Chain

```
Request
  ↓
[CORS + Helmet] - Security headers
  ↓
[Body Parser] - Parse JSON
  ↓
[authenticate] - Verify JWT token (if protected route)
  ↓
[authorizeRoles] - Check user role (if restricted route)
  ↓
[validateRequest] - Validate request data schema
  ↓
[Controller] - Handle logic
  ↓
[Error Handler] - Catch and format errors
  ↓
Response
```

## 🗄️ Database Schema & Relationships

### User Model
```prisma
model User {
  id        String          @id @default(cuid())
  email     String          @unique
  password  String          (hashed)
  firstName String
  lastName  String
  role      UserRole        (VIEWER | ANALYST | ADMIN)
  status    UserStatus      (ACTIVE | INACTIVE)
  createdAt DateTime
  updatedAt DateTime

  relationships:
  - transactions (One-to-Many)

  indexes:
  - email (unique)
  - role
  - status
}
```

### Transaction Model
```prisma
model Transaction {
  id        String          @id @default(cuid())
  userId    String          (FK to User)
  amount    Float
  type      TransactionType (INCOME | EXPENSE)
  category  String
  date      DateTime
  note      String          (optional)
  isDeleted Boolean         (for soft delete)
  createdAt DateTime
  updatedAt DateTime

  relationships:
  - user (Many-to-One)

  indexes:
  - userId
  - type
  - category
  - date
  - isDeleted
}
```

### Entity Relationships
```
User (1) ──→ (Many) Transaction
```

## 🔄 Request/Response Flow

### Create Transaction Example

```
1. CLIENT
   POST /api/transactions
   Headers: { Authorization: "Bearer TOKEN" }
   Body: { amount, type, category, date, note }

2. MIDDLEWARE
   ✓ authenticate → Verify JWT
   ✓ authorizeRoles → Check if Admin
   ✓ validateRequest → Validate schema

3. CONTROLLER
   transactionController.createTransaction()
   → Extract userId from req.user
   → Pass to service

4. SERVICE
   transactionService.createTransaction()
   → Verify user exists
   → Create transaction in DB
   → Transform response

5. CONTROLLER
   → Format response with sendSuccess()

6. CLIENT
   Response: {
     success: true,
     data: { id, amount, type, ... },
     message: "Transaction created successfully"
   }
```

## 📊 Data Processing Architecture

### Dashboard Summary Processing

```
Request for summary
  ↓
Extract userId from JWT
  ↓
Query transactions where:
  - userId matches
  - isDeleted = false
  ↓
Execute 3 queries in parallel:
  1. Aggregate income (sum where type = INCOME)
  2. Aggregate expense (sum where type = EXPENSE)
  3. Group by category (sum per category)
  ↓
Fetch recent 5 transactions
  ↓
Calculate derived values:
  - netBalance = income - expense
  ↓
Format and return response
```

## 🛡️ Role-Based Access Control (RBAC) Matrix

```
┌─────────────────┬────────────────────────────────────────────┐
│     Role        │              Permissions                   │
├─────────────────┼────────────────────────────────────────────┤
│ VIEWER          │ • Read own transactions                    │
│                 │ • View own profile                         │
│                 │ • ❌ Cannot create/update/delete           │
│                 │ • ❌ Cannot access analytics               │
├─────────────────┼────────────────────────────────────────────┤
│ ANALYST         │ • Read all transactions                    │
│                 │ • Access dashboard & analytics             │
│                 │ • View own profile                         │
│                 │ • ❌ Cannot create/update/delete           │
│                 │ • ❌ Cannot manage users                   │
├─────────────────┼────────────────────────────────────────────┤
│ ADMIN           │ • Full CRUD on transactions                │
│                 │ • Create/update/delete users               │
│                 │ • Manage user roles & status               │
│                 │ • Access all analytics                     │
│                 │ • View all audit trails                    │
└─────────────────┴────────────────────────────────────────────┘
```

## 📝 Validation Strategy

### Request Validation Flow

```
Request Data
  ↓
validateRequest middleware
  ↓
Parse with Zod schema
  ↓
If valid:
  → Attach to req.body
  → Continue to controller
  ↓
If invalid:
  → Format errors
  → Return 400 with error details
```

### Validation Rules

**Authentication:**
- Email: Valid format
- Password: Min 8 chars, uppercase, number, special char

**Transactions:**
- Amount: Positive number
- Type: INCOME or EXPENSE enum
- Category: Non-empty string (max 50 chars)
- Date: Valid ISO date
- Note: Optional, max 500 chars

## 🚀 Performance Optimizations

### 1. Database Indexing
```
✓ email (unique) → Fast user lookups
✓ role → Efficient RBAC filtering
✓ status → Quick active user queries
✓ userId on transactions → Fast transaction filtering
✓ type → Quick income/expense separation
✓ category → Category filtering
✓ date → Date range queries
✓ isDeleted → Soft delete filtering
```

### 2. Query Optimization
- Pagination for large datasets
- Prisma's `groupBy` for efficient aggregation
- Proper `select` statements to avoid fetching unnecessary data
- Connection pooling via Prisma

### 3. Caching Opportunities (Future)
- User profile caching
- Dashboard summary caching (with TTL)
- Role permissions caching

## 🔍 Error Handling Architecture

### Global Error Handler

```
Error thrown in any layer
  ↓
Caught by express-async-errors
  ↓
Passed to errorHandler middleware
  ↓
Categorized:
  - AppError → Custom error
  - ZodError → Validation error
  - JWTError → Authentication error
  - Generic Error → Server error
  ↓
Formatted response with:
  - Appropriate status code
  - User-friendly message
  - Dev details (if dev environment)
  ↓
Sent to client
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": { /* field-level errors if validation */ }
}
```

## 📚 TypeScript Type Safety

### Type Flow

```
Request Data
  ↓
Zod Schema × CreateTransactionInput type
  ↓
Service function (typed parameters & returns)
  ↓
Database query (Prisma ensures types)
  ↓
Response Mapper function
  ↓
TransactionResponse type
  ↓
Client receives typed data
```

## 🔄 Middleware Composition

### Example: Create Transaction Endpoint

```typescript
router.post(
  "/",
  // Middleware 1: Authentication
  authenticate,

  // Middleware 2: Authorization (Admin only)
  authorizeRoles(UserRole.ADMIN),

  // Middleware 3: Validation
  validateRequest(CreateTransactionSchema, "body"),

  // Middleware 4: Controller
  transactionController.createTransaction
);
```

### Middleware Execution Order
1. Authentication → Verify token
2. Authorization → Check role
3. Validation → Schema validation
4. Controller → Business logic
5. Error Handler → Handle errors

## 🎯 Key Architectural Decisions

### 1. Soft Delete vs Hard Delete
**Decision**: Soft delete for transactions
**Reason**: Data preservation, audit trail, recovery capability

### 2. JWT vs Sessions
**Decision**: JWT tokens
**Reason**: Stateless, scalable, mobile-friendly, API-first

### 3. Prisma vs Raw SQL
**Decision**: Prisma ORM
**Reason**: Type safety, auto-migrations, easy relationships, less boilerplate

### 4. Service Layer Separation
**Decision**: Dedicated service layer
**Reason**: Testability, reusability, business logic centralization

### 5. Custom Error Class
**Decision**: AppError abstraction
**Reason**: Consistent error handling, proper status codes, clean code

## 🧪 Testing Strategy (Future Implementation)

### Unit Tests
- Service layer functions
- Utility functions (JWT, password, validation)

### Integration Tests
- API endpoints
- Database interactions
- Middleware chains

### E2E Tests
- Complete user workflows
- RBAC enforcement
- Error scenarios

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless API (JWT tokens)
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Indexed database queries
- Efficient middleware chain
- Memory-efficient response formatting

### Future Enhancements
- Caching layer (Redis)
- Message queues for async tasks
- API rate limiting
- Request logging
- Metrics collection

---

**Architecture Document Version**: 1.0
**Last Updated**: 2024
