import { Router } from "express";
import { userController } from "@/controllers";
import { authenticate, authorizeRoles, validateRequest } from "@/middlewares";
import { CreateUserSchema, UpdateUserSchema } from "@/utils/validation";

const router = Router();

/**
 * @route POST /users
 * @description Create a new user (Admin only)
 * @access Private - Admin
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
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
  authorizeRoles("ADMIN"),
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
  authorizeRoles("ADMIN"),
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
  authorizeRoles("ADMIN"),
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
  authorizeRoles("ADMIN"),
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
  authorizeRoles("ADMIN"),
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
  authorizeRoles("ADMIN"),
  userController.activateUser
);

export default router;
