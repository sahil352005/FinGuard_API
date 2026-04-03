import { Router } from "express";
import { transactionController } from "@/controllers";
import { authenticate, authorizeRoles } from "@/middlewares";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * @route GET /dashboard/summary
 * @description Get dashboard summary with aggregated data (Analyst, Admin)
 * @access Private - Analyst, Admin
 */
router.get(
  "/summary",
  authenticate,
  authorizeRoles(UserRole.ANALYST, UserRole.ADMIN),
  transactionController.getDashboardSummary
);

export default router;
