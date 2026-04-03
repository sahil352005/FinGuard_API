import { Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { AppError, AuthRequest } from "@/types";

export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: "Insufficient permissions for this action",
      });
      return;
    }

    next();
  };
