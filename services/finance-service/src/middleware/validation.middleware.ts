import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

// Asset Validation Schema
const assetSchema = z.object({
  symbol: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  quantity: z.number().positive(),
  currentPrice: z.number().nonnegative(),
  totalValue: z.number().nonnegative(),
  dailyChange: z.number(),
  iconUrl: z.string().url().optional().or(z.literal('')),
});

// Transaction Validation Schema
const transactionSchema = z.object({
  type: z.enum(['transfer', 'withdraw', 'deposit', 'investment']),
  amount: z.number().positive(),
  currency: z.string().length(3), // USD, THB, etc.
  description: z.string().max(500).optional(),
});

export const validateAsset = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    assetSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    return res.status(400).json({error: 'Invalid request data'});
  }
};

export const validateTransaction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    transactionSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    return res.status(400).json({error: 'Invalid request data'});
  }
};

// Query Parameter Validation
const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .refine((val) => val >= 0, {
      message: 'Offset must be >= 0',
    }),
});

export const validateQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.query = querySchema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }
    return res.status(400).json({error: 'Invalid query parameters'});
  }
};
