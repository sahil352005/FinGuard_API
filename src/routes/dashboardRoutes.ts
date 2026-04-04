import { Router } from "express";
import { transactionController } from "@/controllers";
import { authenticate, authorizeRoles } from "@/middlewares";

const router = Router();

/**
 * @route GET /dashboard/summary
 * @access Private - Analyst, Admin
 */
router.get(
  "/summary",
  authenticate,
  authorizeRoles("ANALYST", "ADMIN"),
  transactionController.getDashboardSummary
);

/**
 * @route GET /dashboard/trends?granularity=monthly|weekly
 * @access Private - Analyst, Admin
 */
router.get(
  "/trends",
  authenticate,
  authorizeRoles("ANALYST", "ADMIN"),
  transactionController.getTrends
);

export default router;
