import {Request, Response, NextFunction} from 'express';
import {z} from 'zod';

// Validation schemas
export const createIconSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['icon', 'logo', 'image']),
  category: z.string().min(1).max(50),
  url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  svg_content: z.string().optional(),
  metadata: z
    .object({
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
      format: z.string().optional(),
      size: z.number().positive().optional(),
      colors: z.array(z.string()).optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const updateIconSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  svg_content: z.string().optional(),
  metadata: z
    .object({
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
      format: z.string().optional(),
      size: z.number().positive().optional(),
      colors: z.array(z.string()).optional(),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const validateCreateIcon = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    createIconSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
};

export const validateUpdateIcon = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    updateIconSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
};
