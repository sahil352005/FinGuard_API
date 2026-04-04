import { prisma } from "@/utils/prisma";
import { AppError } from "@/types";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionQuery,
  TransactionResponse,
  DashboardSummary,
  TrendsResponse,
} from "@/types";

const mapTransactionToResponse = (transaction: any): TransactionResponse => {
  return {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    note: transaction.note,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
};

export const transactionService = {
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
        type: data.type,
        category: data.category,
        date: data.date,
        note: data.note,
      },
    });

    return mapTransactionToResponse(transaction);
  },

  async getTransactions(userId: string, query: TransactionQuery) {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId,
      isDeleted: false,
    };

    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: "insensitive" };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map(mapTransactionToResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getTransactionById(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError(404, "Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new AppError(
        403,
        "You do not have permission to access this transaction"
      );
    }

    if (transaction.isDeleted) {
      throw new AppError(404, "Transaction not found");
    }

    return mapTransactionToResponse(transaction);
  },

  async updateTransaction(
    transactionId: string,
    userId: string,
    data: UpdateTransactionDTO
  ) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError(404, "Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new AppError(
        403,
        "You do not have permission to update this transaction"
      );
    }

    if (transaction.isDeleted) {
      throw new AppError(404, "Transaction not found");
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data,
    });

    return mapTransactionToResponse(updatedTransaction);
  },

  async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError(404, "Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new AppError(
        403,
        "You do not have permission to delete this transaction"
      );
    }

    if (transaction.isDeleted) {
      throw new AppError(404, "Transaction not found");
    }

    // Soft delete
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { isDeleted: true },
    });

    return { message: "Transaction deleted successfully" };
  },

  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const where = { userId, isDeleted: false };

    // Get totals by type
    const byType = await prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: { amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    byType.forEach((item) => {
      if (item.type === "INCOME") {
        totalIncome = item._sum.amount || 0;
      } else {
        totalExpense = item._sum.amount || 0;
      }
    });

    // Get category-wise totals
    const categoryTotals = await prisma.transaction.groupBy({
      by: ["category", "type"],
      where,
      _sum: { amount: true },
    });

    const categoryWiseTotals = categoryTotals.map((item) => ({
      category: item.category,
      total: item._sum.amount || 0,
      type: item.type,
    }));

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 5,
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryWiseTotals,
      recentTransactions: recentTransactions.map(mapTransactionToResponse),
    };
  },

  async getTrends(userId: string, granularity: "monthly" | "weekly"): Promise<TrendsResponse> {
    const where = { userId, isDeleted: false };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "asc" },
      select: { amount: true, type: true, date: true },
    });

    const buckets: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(({ amount, type, date }) => {
      let key: string;

      if (granularity === "weekly") {
        const d = new Date(date);
        const startOfYear = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(
          ((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
        );
        key = `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
      } else {
        const d = new Date(date);
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!buckets[key]) buckets[key] = { income: 0, expense: 0 };
      if (type === "INCOME") buckets[key].income += amount;
      else buckets[key].expense += amount;
    });

    const trends = Object.entries(buckets).map(([period, { income, expense }]) => ({
      period,
      income,
      expense,
      net: income - expense,
    }));

    return { granularity, trends };
  },
};
