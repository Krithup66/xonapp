import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import {supabase} from './lib/supabase';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
      },
    },
  }),
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/users', limiter);
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true, limit: '1mb'}));

// Test Supabase connection
supabase
  .from('users')
  .select('count')
  .limit(1)
  .then(({error}) => {
    if (error && error.code !== 'PGRST116') {
      console.warn('⚠️  Supabase connection warning:', error.message);
    } else {
      console.log('✅ Connected to Supabase');
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection error:', error.message);
  });

// Health check
app.get('/health', (req, res) => {
  res.json({status: 'ok', service: 'user-service'});
});

// Routes
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
