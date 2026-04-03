import { Response } from "express";
import { authService } from "@/services";
import { sendSuccess, sendError } from "@/utils/response";
import { AuthRequest } from "@/types";

export const authController = {
  async register(
    req: AuthRequest,
    res: Response<any>
  ): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, 201, "User registered successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 200, "Login successful");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
        return;
      }

      const user = await authService.getProfile(req.user.userId);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, error, 500);
    }
  },
};
