import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "@/utils/response";

export const validateRequest =
  (schema: ZodSchema, location: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[location];
      const validated = schema.parse(data);
      req[location] = validated;
      next();
    } catch (error) {
      sendError(res, error, 400);
    }
  };
