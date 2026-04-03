import { UserRole, TransactionType, UserStatus } from "@prisma/client";

// User Types
export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenResponse {
  token: string;
  user: UserResponse;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Transaction Types
export interface CreateTransactionDTO {
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  note?: string;
}

export interface UpdateTransactionDTO {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: Date;
  note?: string;
}

export interface TransactionQuery {
  type?: TransactionType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface TransactionResponse {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Summary Types
export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryWiseTotals: Array<{
    category: string;
    total: number;
    type: TransactionType;
  }>;
  recentTransactions: TransactionResponse[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}
