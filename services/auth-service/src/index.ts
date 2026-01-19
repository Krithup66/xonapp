import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import {supabase} from './lib/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

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
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

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
  res.json({status: 'ok', service: 'auth-service'});
});

// Routes
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
