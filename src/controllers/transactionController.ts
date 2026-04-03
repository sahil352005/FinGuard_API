import { Response } from "express";
import { transactionService } from "@/services";
import { sendSuccess, sendError } from "@/utils/response";
import { AuthRequest, TransactionQuery } from "@/types";

export const transactionController = {
  async createTransaction(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const transaction = await transactionService.createTransaction(
        req.user.userId,
        req.body
      );
      sendSuccess(res, transaction, 201, "Transaction created successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async getTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const query: TransactionQuery = {
        type: req.query.type as any,
        category: req.query.category as string,
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await transactionService.getTransactions(
        req.user.userId,
        query
      );
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async getTransactionById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(
        id,
        req.user.userId
      );
      sendSuccess(res, transaction);
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async updateTransaction(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const { id } = req.params;
      const transaction = await transactionService.updateTransaction(
        id,
        req.user.userId,
        req.body
      );
      sendSuccess(res, transaction, 200, "Transaction updated successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async deleteTransaction(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const { id } = req.params;
      const result = await transactionService.deleteTransaction(
        id,
        req.user.userId
      );
      sendSuccess(res, result, 200);
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async getDashboardSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const summary = await transactionService.getDashboardSummary(
        req.user.userId
      );
      sendSuccess(res, summary);
    } catch (error) {
      sendError(res, error, 500);
    }
  },
};
