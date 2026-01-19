import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

// Trading Record Validation Schema
const tradingRecordSchema = z.object({
  tradeType: z.enum(['forex', 'crypto']),
  beforeTrading: z.object({
    emotionalState: z.string().max(500),
    asset: z.string().max(100),
    lotSize: z.string().max(50),
    takeProfit: z.string().max(50),
    stopLoss: z.string().max(50),
    riskReward: z.string().max(50),
    entryDate: z.string().max(50),
    entryPrice: z.string().max(50),
    status: z.enum(['Buy', 'Sell']),
    entryReason: z.string().max(1000),
    chartImage: z.string().url().optional().or(z.literal('')),
  }),
  afterTrading: z.object({
    exitPrice: z.string().max(50),
    exitCondition: z.enum(['TP', 'SL', 'SP']),
    result: z.enum(['Win', 'Loss', 'BreakEven']),
    profit: z.string().max(50),
    exitReason: z.string().max(1000),
    daysHeld: z.string().max(50),
    emotionalState: z.string().max(500),
    grade: z.enum(['A+', 'A', 'B', 'C', 'F']),
    notes: z.string().max(2000).optional(),
    accountLink: z.string().url().optional().or(z.literal('')),
    chartImage: z.string().url().optional().or(z.literal('')),
  }),
});

export const validateTradingRecord = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    tradingRecordSchema.parse(req.body);
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
  tradeType: z.enum(['forex', 'crypto']).optional(),
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
