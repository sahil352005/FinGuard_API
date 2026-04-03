import { Router } from "express";
import { authController } from "@/controllers";
import { authenticate, validateRequest } from "@/middlewares";
import {
  RegisterSchema,
  LoginSchema,
} from "@/utils/validation";

const router = Router();

/**
 * @route POST /auth/register
 * @description Register a new user
 * @access Public
 */
router.post(
  "/register",
  validateRequest(RegisterSchema, "body"),
  authController.register
);

/**
 * @route POST /auth/login
 * @description Login user
 * @access Public
 */
router.post(
  "/login",
  validateRequest(LoginSchema, "body"),
  authController.login
);

/**
 * @route GET /auth/profile
 * @description Get current user profile
 * @access Private
 */
router.get("/profile", authenticate, authController.getProfile);

export default router;
