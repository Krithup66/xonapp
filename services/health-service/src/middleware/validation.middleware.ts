import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

// Query validation schema
export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
    offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
    nextToken: z.string().optional(),
  });

  try {
    schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }
    next(error);
  }
};
