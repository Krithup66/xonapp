import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {createProxyMiddleware} from 'http-proxy-middleware';
import dotenv from 'dotenv';
import {
  apiRateLimiter,
  authRateLimiter,
  sanitizeInput,
  requestLogger,
} from './middleware/security.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:19006']; // React Native default

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  }),
);

// Body parsing with size limit
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// Security Middleware
app.use(sanitizeInput);
app.use(requestLogger);

// Rate Limiting
app.use('/api/auth', authRateLimiter); // Strict rate limiting for auth
app.use('/api/', apiRateLimiter); // General rate limiting

// Health check
app.get('/health', (req, res) => {
  res.json({status: 'ok', service: 'api-gateway'});
});

// Service routes
const services = {
  '/api/trading-journal': process.env.TRADING_JOURNAL_SERVICE_URL || 'http://localhost:3001',
  '/api/user': process.env.USER_SERVICE_URL || 'http://localhost:3002',
  '/api/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:3003',
  '/api/icons': process.env.ICON_SERVICE_URL || 'http://localhost:3004',
  '/api/finance': process.env.FINANCE_SERVICE_URL || 'http://localhost:3005',
};

// Proxy middleware for each service
Object.entries(services).forEach(([path, target]) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: '', // remove /api/service-name from path
      },
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error(`Proxy error for ${path}:`, err);
        res.status(503).json({
          error: 'Service unavailable',
          service: path,
        });
      },
    }),
  );
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Proxying to services:');
  Object.entries(services).forEach(([path, target]) => {
    console.log(`  ${path} -> ${target}`);
  });
});
