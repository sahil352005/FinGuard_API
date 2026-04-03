import { Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "@/utils/jwt";
import { AppError, AuthRequest } from "@/types";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization as string);

    if (!token) {
      throw new AppError(401, "No authentication token provided");
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else if (error instanceof Error) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Authentication failed",
      });
    }
  }
};
