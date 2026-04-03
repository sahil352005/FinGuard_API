import { Response } from "express";
import { AppError } from "@/types";
import { config } from "@/config";
import { ZodError } from "zod";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  code: number = 200,
  message: string = "Success"
): Response => {
  return res.status(code).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: Response,
  error: unknown,
  defaultCode: number = 500
): Response => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof ZodError) {
    const formattedErrors = error.errors.reduce(
      (acc, err) => {
        const path = err.path.join(".");
        acc[path] = err.message;
        return acc;
      },
      {} as Record<string, string>
    );

    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: formattedErrors,
    });
  }

  if (error instanceof Error) {
    const statusCode =
      (error as any).statusCode || (error as any).status || defaultCode;
    return res.status(statusCode).json({
      success: false,
      error: config.app.isDev ? error.message : "Internal server error",
    });
  }

  return res.status(defaultCode).json({
    success: false,
    error: "Internal server error",
  });
};

export const handleAsync =
  (fn: Function) => (...args: any[]) => Promise.resolve(fn(...args));
