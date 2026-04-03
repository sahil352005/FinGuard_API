import type { Request } from "express";

// User Types
export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
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
  role: string;
}

// Transaction Types
export interface CreateTransactionDTO {
  amount: number;
  type: string;
  category: string;
  date: Date;
  note?: string;
}

export interface UpdateTransactionDTO {
  amount?: number;
  type?: string;
  category?: string;
  date?: Date;
  note?: string;
}

export interface TransactionQuery {
  type?: string;
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
  type: string;
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
    type: string;
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

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
