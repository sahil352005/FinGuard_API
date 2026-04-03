import { prisma } from "@/utils/prisma";
import { hashPassword, verifyPassword, generateToken } from "@/utils";
import { AppError } from "@/types";
import { CreateUserDTO, LoginDTO, UserResponse } from "@/types";

const mapUserToResponse = (user: any): UserResponse => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const authService = {
  async register(data: CreateUserDTO) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(409, "User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || "VIEWER",
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    return {
      token,
      user: mapUserToResponse(user),
    };
  },

  async login(data: LoginDTO) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Check if user is active
    if (user.status === "INACTIVE") {
      throw new AppError(403, "User account is inactive");
    }

    // Verify password
    const passwordMatch = await verifyPassword(data.password, user.password);

    if (!passwordMatch) {
      throw new AppError(401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    return {
      token,
      user: mapUserToResponse(user),
    };
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return mapUserToResponse(user);
  },
};
