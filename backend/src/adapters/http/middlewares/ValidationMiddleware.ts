import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { logger } from "@infrastructure/logger/logger";


export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`[Validation Error] ${req.method} ${req.originalUrl}: ${JSON.stringify(error.issues)}`);
        return res.status(400).json({
          status: "validation_error",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
      return next(error);
    }
  };