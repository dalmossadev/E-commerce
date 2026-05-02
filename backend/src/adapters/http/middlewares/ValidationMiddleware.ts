import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";


export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
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