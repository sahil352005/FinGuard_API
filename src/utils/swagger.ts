import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinGuard API",
      version: "1.0.0",
      description:
        "Finance dashboard backend with role-based access control. Supports user management, financial transactions, and analytics.",
    },
    servers: [
      {
        url: "/api",
        description: "API Base",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterBody: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            email: { type: "string", example: "admin@example.com" },
            password: { type: "string", example: "Password123!" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            role: { type: "string", enum: ["VIEWER", "ANALYST", "ADMIN"], example: "ADMIN" },
          },
        },
        LoginBody: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@example.com" },
            password: { type: "string", example: "Password123!" },
          },
        },
        CreateUserBody: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            email: { type: "string", example: "analyst@example.com" },
            password: { type: "string", example: "Password123!" },
            firstName: { type: "string", example: "Jane" },
            lastName: { type: "string", example: "Smith" },
            role: { type: "string", enum: ["VIEWER", "ANALYST", "ADMIN"], example: "ANALYST" },
          },
        },
        UpdateUserBody: {
          type: "object",
          properties: {
            firstName: { type: "string", example: "Jane" },
            lastName: { type: "string", example: "Smith" },
            role: { type: "string", enum: ["VIEWER", "ANALYST", "ADMIN"] },
            status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
          },
        },
        CreateTransactionBody: {
          type: "object",
          required: ["amount", "type", "category", "date"],
          properties: {
            amount: { type: "number", example: 5000 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"], example: "INCOME" },
            category: { type: "string", example: "Salary" },
            date: { type: "string", format: "date-time", example: "2026-04-01T00:00:00.000Z" },
            note: { type: "string", example: "Monthly salary" },
          },
        },
        UpdateTransactionBody: {
          type: "object",
          properties: {
            amount: { type: "number", example: 6000 },
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            category: { type: "string", example: "Bonus" },
            date: { type: "string", format: "date-time" },
            note: { type: "string", example: "Updated note" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterBody" } } },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
            409: { description: "Email already exists" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and get JWT token",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } },
          },
          responses: {
            200: { description: "Login successful, returns JWT token" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/profile": {
        get: {
          tags: ["Auth"],
          summary: "Get current user profile",
          responses: {
            200: { description: "User profile" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/users": {
        post: {
          tags: ["Users"],
          summary: "Create a new user (Admin only)",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserBody" } } },
          },
          responses: {
            201: { description: "User created" },
            403: { description: "Forbidden" },
          },
        },
        get: {
          tags: ["Users"],
          summary: "Get all users with pagination (Admin only)",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: { description: "Paginated list of users" },
            403: { description: "Forbidden" },
          },
        },
      },
      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "User data" },
            404: { description: "User not found" },
          },
        },
        patch: {
          tags: ["Users"],
          summary: "Update user (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserBody" } } },
          },
          responses: {
            200: { description: "User updated" },
            404: { description: "User not found" },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "User deleted" },
            404: { description: "User not found" },
          },
        },
      },
      "/users/{id}/activate": {
        patch: {
          tags: ["Users"],
          summary: "Activate user (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "User activated" } },
        },
      },
      "/users/{id}/deactivate": {
        patch: {
          tags: ["Users"],
          summary: "Deactivate user (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "User deactivated" } },
        },
      },
      "/transactions": {
        post: {
          tags: ["Transactions"],
          summary: "Create a transaction (Admin only)",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTransactionBody" } } },
          },
          responses: {
            201: { description: "Transaction created" },
            403: { description: "Forbidden" },
          },
        },
        get: {
          tags: ["Transactions"],
          summary: "Get transactions with filters (Admin, Analyst)",
          parameters: [
            { name: "type", in: "query", schema: { type: "string", enum: ["INCOME", "EXPENSE"] } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
            { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: { 200: { description: "Paginated transactions" } },
        },
      },
      "/transactions/{id}": {
        get: {
          tags: ["Transactions"],
          summary: "Get transaction by ID (All authenticated)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Transaction data" },
            404: { description: "Not found" },
          },
        },
        patch: {
          tags: ["Transactions"],
          summary: "Update transaction (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTransactionBody" } } },
          },
          responses: { 200: { description: "Transaction updated" } },
        },
        delete: {
          tags: ["Transactions"],
          summary: "Soft delete transaction (Admin only)",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Transaction deleted" } },
        },
      },
      "/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get dashboard summary (Admin, Analyst)",
          responses: {
            200: {
              description: "Total income, expense, net balance, category totals, recent transactions",
            },
          },
        },
      },
      "/dashboard/trends": {
        get: {
          tags: ["Dashboard"],
          summary: "Get income/expense trends (Admin, Analyst)",
          parameters: [
            {
              name: "granularity",
              in: "query",
              schema: { type: "string", enum: ["monthly", "weekly"], default: "monthly" },
            },
          ],
          responses: {
            200: { description: "Trend data grouped by month or week" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
