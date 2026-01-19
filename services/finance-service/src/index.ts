import express from 'express';
import dotenv from 'dotenv';
import financeRoutes from './routes/finance.routes';
import {supabase} from './lib/supabase';
import {
  securityHeaders,
  corsOptions,
  writeRateLimiter,
  readRateLimiter,
  secureErrorHandler,
} from './middleware/security.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Security Middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// Test Supabase connection
supabase
  .from('balances')
  .select('count')
  .limit(1)
  .then(({error}) => {
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "relation does not exist" which is OK if tables aren't created yet
      console.warn('⚠️  Supabase connection warning:', error.message);
      console.log('💡 ตรวจสอบว่า Supabase tables ถูกสร้างแล้ว');
    } else {
      console.log('✅ Connected to Supabase');
      console.log('📍 Supabase URL:', process.env.SUPABASE_URL || 'https://hsyvscvfnvcllnflcwyo.supabase.co');
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection error:', error.message);
    console.error('💡 ตรวจสอบ SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY');
  });

// Health check
app.get('/health', (req, res) => {
  res.json({status: 'ok', service: 'finance-service'});
});

// Routes with rate limiting
app.use('/', readRateLimiter, financeRoutes);

// Error handler (must be last)
app.use(secureErrorHandler);

app.listen(PORT, () => {
  console.log(`Finance Service running on port ${PORT}`);
});
