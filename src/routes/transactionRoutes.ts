import { Router } from "express";
import { transactionController } from "@/controllers";
import { authenticate, authorizeRoles, validateRequest } from "@/middlewares";
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
  TransactionQuerySchema,
} from "@/utils/validation";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * @route POST /transactions
 * @description Create a new transaction (Admin only)
 * @access Private - Admin
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(CreateTransactionSchema, "body"),
  transactionController.createTransaction
);

/**
 * @route GET /transactions
 * @description Get transactions with filtering (Analyst, Admin)
 * @access Private - Analyst, Admin
 */
router.get(
  "/",
  authenticate,
  authorizeRoles(UserRole.ANALYST, UserRole.ADMIN),
  transactionController.getTransactions
);

/**
 * @route GET /transactions/:id
 * @description Get transaction by ID (All authenticated users)
 * @access Private - Viewer, Analyst, Admin
 */
router.get(
  "/:id",
  authenticate,
  transactionController.getTransactionById
);

/**
 * @route PATCH /transactions/:id
 * @description Update transaction (Admin only)
 * @access Private - Admin
 */
router.patch(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(UpdateTransactionSchema, "body"),
  transactionController.updateTransaction
);

/**
 * @route DELETE /transactions/:id
 * @description Delete transaction (Admin only)
 * @access Private - Admin
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  transactionController.deleteTransaction
);

export default router;
