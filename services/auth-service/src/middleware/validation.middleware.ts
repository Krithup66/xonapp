import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register validation schema
const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .refine((email) => emailRegex.test(email), {
      message: 'Invalid email format',
    }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    registerSchema.parse(req.body);
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

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }
    return res.status(400).json({error: 'Invalid request data'});
  }
};
