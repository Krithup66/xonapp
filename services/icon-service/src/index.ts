import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import iconRoutes from './routes/icon.routes';
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
const PORT = process.env.PORT || 3004;

// Security Middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// Test Supabase connection
supabase
  .from('icons')
  .select('count')
  .limit(1)
  .then(({error}) => {
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "relation does not exist" which is OK if tables aren't created yet
      console.warn('⚠️  Supabase connection warning:', error.message);
      console.log('💡 ตรวจสอบว่า Supabase icons table ถูกสร้างแล้ว');
    } else {
      console.log('✅ Connected to Supabase');
      console.log('📍 Supabase URL:', process.env.SUPABASE_URL || 'Not set');
    }
  })
  .catch((error) => {
    console.error('❌ Supabase connection error:', error.message);
    console.error('💡 ตรวจสอบ SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY');
  });

// Health check
app.get('/health', (req, res) => {
  res.json({status: 'ok', service: 'icon-service'});
});

// Routes with rate limiting
app.use('/icons', iconRoutes);

// Error handler (must be last)
app.use(secureErrorHandler);

app.listen(PORT, () => {
  console.log(`Icon Service running on port ${PORT}`);
  console.log(`📦 Icon management service ready`);
});
