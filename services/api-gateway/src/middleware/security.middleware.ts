import {Request, Response, NextFunction} from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting configurations
export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
  });
};

// Strict rate limiter for auth endpoints
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// General API rate limiter
export const apiRateLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Strict rate limiter for write operations
export const writeRateLimiter = createRateLimiter(15 * 60 * 1000, 20); // 20 requests per 15 minutes

// Input sanitization middleware
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Remove potentially dangerous characters from query params
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string)
          .replace(/[<>]/g, '')
          .trim();
      }
    });
  }

  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/[<>]/g, '').trim();
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitize(value);
        }
        return sanitized;
      }
      return obj;
    };
    req.body = sanitize(req.body);
  }

  next();
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  const ip = req.ip || req.socket.remoteAddress;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    // Log only errors and important requests
    if (res.statusCode >= 400) {
      console.error('❌ Request Error:', logData);
    } else if (req.path.startsWith('/api/auth')) {
      console.log('🔐 Auth Request:', logData);
    }
  });

  next();
};
