import { Router } from "express";
import { userController } from "@/controllers";
import { authenticate, authorizeRoles, validateRequest } from "@/middlewares";
import { CreateUserSchema, UpdateUserSchema } from "@/utils/validation";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * @route POST /users
 * @description Create a new user (Admin only)
 * @access Private - Admin
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(CreateUserSchema, "body"),
  userController.createUser
);

/**
 * @route GET /users
 * @description Get all users with pagination (Admin only)
 * @access Private - Admin
 */
router.get(
  "/",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  userController.getAllUsers
);

/**
 * @route GET /users/:id
 * @description Get user by ID (Admin only)
 * @access Private - Admin
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  userController.getUserById
);

/**
 * @route PATCH /users/:id
 * @description Update user (Admin only)
 * @access Private - Admin
 */
router.patch(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(UpdateUserSchema, "body"),
  userController.updateUser
);

/**
 * @route DELETE /users/:id
 * @description Delete user (Admin only)
 * @access Private - Admin
 */
router.delete(
  "/:id",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  userController.deleteUser
);

/**
 * @route PATCH /users/:id/deactivate
 * @description Deactivate user (Admin only)
 * @access Private - Admin
 */
router.patch(
  "/:id/deactivate",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  userController.deactivateUser
);

/**
 * @route PATCH /users/:id/activate
 * @description Activate user (Admin only)
 * @access Private - Admin
 */
router.patch(
  "/:id/activate",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  userController.activateUser
);

export default router;
