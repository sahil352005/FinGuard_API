# FinGuard API - Setup & Quick Start Guide

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Start Server
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 5. Test API
```bash
curl http://localhost:5000/health
```

---

## 📦 Installation Details

### Requirements
- Node.js 16+ with npm/yarn
- PostgreSQL 12+ (optional, SQLite included)
- Git (for version control)

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd FinGuard-API
```

#### 2. Install Dependencies
```bash
npm install
```

This installs:
- express (web framework)
- @prisma/client (database ORM)
- jsonwebtoken (JWT)
- bcrypt (password hashing)
- zod (validation)
- cors (CORS middleware)
- helmet (security)
- express-async-errors (async error handling)

#### 3. Create Environment File
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

#### 4. Generate Prisma Client
```bash
npm run prisma:generate
```

This generates TypeScript types for database queries.

#### 5. Create Database & Run Migrations
```bash
npm run prisma:migrate
```

Prisma will:
- Create database
- Run all migrations
- Generate Prisma Client

#### 6. Seed Database (Optional)
```bash
npm run prisma:seed
```

Creates test users and sample data:
- Admin: admin@finguard.com / Admin@123456
- Analyst: analyst@finguard.com / Analyst@123456
- Viewer: viewer@finguard.com / Viewer@123456

---

## 🔧 Configuration Guide

### Environment Variables

**.env File**
```env
# Application
NODE_ENV=development              # development | production
PORT=5000                         # Server port

# Database
DATABASE_URL="file:./dev.db"      # SQLite (dev)
# DATABASE_URL=postgres://...    # PostgreSQL (prod)

# JWT
JWT_SECRET=super_secret_key_here  # Min 32 chars in production
JWT_EXPIRATION=7d                 # Token expiration time

# Bcrypt
BCRYPT_ROUNDS=10                  # Hash rounds (10=dev, 12=prod)

# CORS (Optional)
CORS_ORIGIN=*                     # Allowed origins
```

### Using PostgreSQL

1. **Install PostgreSQL** (if not already installed)

2. **Create database**
```bash
createdb finguard
```

3. **Update .env**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/finguard"
NODE_ENV=development
```

4. **Run migrations**
```bash
npm run prisma:migrate
```

### Using SQLite (Default)

SQLite is configured by default for development:
```env
DATABASE_URL="file:./dev.db"
```

Database file: `prisma/dev.db`

---

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

Features:
- Auto-restart on code changes (ts-node)
- Source maps for debugging
- Detailed error messages

### Production Build
```bash
# Build TypeScript to JavaScript
npm run build

# Start server
npm start
```

### Check Server Status
```bash
curl http://localhost:5000/health

# Response:
# {
#   "success": true,
#   "message": "Server is running",
#   "timestamp": "2024-01-15T10:30:00Z"
# }
```

---

## 🗄️ Database Management

### Prisma Studio
```bash
npm run prisma:studio
```

Opens visual database browser at `http://localhost:5555`

### Database Migrations

**Create migration** (after schema changes)
```bash
npm run prisma:migrate
```

**View migration files**
```bash
ls -la prisma/migrations/
```

### Reset Database (Development Only)
```bash
npm run prisma:migrate reset
```

⚠️ **Warning**: This deletes all data!

---

## 🔑 First Steps After Setup

### 1. Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@finguard.com",
    "password": "Admin@123456"
  }'
```

### 2. Save Token
```bash
export TOKEN="your_token_here"
```

### 3. Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-15T00:00:00Z",
    "note": "Monthly salary"
  }'
```

### 4. View Dashboard
```bash
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Server starts without errors
- [ ] `/health` endpoint responds
- [ ] Database file created (`dev.db` or PostgreSQL database)
- [ ] Can login with seeded credentials
- [ ] JWT token generated on login
- [ ] Can create transactions with admin token
- [ ] Dashboard summary returns data
- [ ] RBAC enforces role restrictions

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

### Issue: Database connection error

**For SQLite:**
```bash
rm prisma/dev.db
npm run prisma:migrate
```

**For PostgreSQL:**
```bash
# Verify connection string in .env
# Check PostgreSQL is running
psql -c "SELECT 1"
```

### Issue: bcrypt compilation errors

**Solution:**
```bash
npm rebuild bcrypt --build-from-source
```

### Issue: Port already in use

**Solution:**
```bash
# Change PORT in .env
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: TypeScript errors in IDE

**Solution:**
```bash
npm run type-check
```

Check output and fix errors.

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Building
npm run build           # Compile TypeScript
npm run type-check      # Check TypeScript types

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open database UI
npm run prisma:seed     # Seed test data

# Linting
npm run lint            # Check code style
```

---

## 🔐 Security Checklist for Production

- [ ] Set strong `JWT_SECRET` (min 32 random characters)
- [ ] Enable HTTPS/TLS
- [ ] Set `NODE_ENV=production`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Increase `BCRYPT_ROUNDS` to 12
- [ ] Set `JWT_EXPIRATION` to shorter duration (e.g., "1h")
- [ ] Configure CORS_ORIGIN (specify allowed domains)
- [ ] Setup database backups
- [ ] Configure rate limiting
- [ ] Enable request logging
- [ ] Use environment-specific secrets
- [ ] Set secure headers (already configured with Helmet)

---

## 📚 Next Steps

1. **Read the API Documentation**: See [README.md](README.md)
2. **Review API Examples**: See [API_EXAMPLES.md](API_EXAMPLES.md)
3. **Understand Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Test All Endpoints**: Use cURL or Postman
5. **Explore Database**: Use `npm run prisma:studio`

---

## 💡 Tips

### Use .env.local for Local Overrides
```bash
# Create local environment file (not committed)
cp .env .env.local
# Edit as needed
```

### Run Multiple Instances
```bash
# Terminal 1 - Server on 5000
PORT=5000 npm run dev

# Terminal 2 - Another instance on 5001
PORT=5001 npm run dev
```

### Database Debugging
```bash
# Enable Prisma logging
export DEBUG="prisma*"
npm run dev
```

---

## 🆘 Getting Help

1. Check existing error message carefully
2. Review [ARCHITECTURE.md](ARCHITECTURE.md)
3. Check [API_EXAMPLES.md](API_EXAMPLES.md) for endpoint usage
4. Review logs for stack traces
5. Check database with `npm run prisma:studio`

---

**Setup Guide Version**: 1.0
**Last Updated**: 2024
