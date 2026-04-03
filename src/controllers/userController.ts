import { Response } from "express";
import { userService } from "@/services";
import { sendSuccess, sendError } from "@/utils/response";
import { AuthRequest } from "@/types";

export const userController = {
  async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      sendSuccess(res, user, 201, "User created successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.getAllUsers(page, limit);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      sendSuccess(res, user, 200, "User updated successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      sendSuccess(res, result, 200);
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async deactivateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.deactivateUser(id);
      sendSuccess(res, user, 200, "User deactivated successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },

  async activateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.activateUser(id);
      sendSuccess(res, user, 200, "User activated successfully");
    } catch (error) {
      sendError(res, error, 500);
    }
  },
};
