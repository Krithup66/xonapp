import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {supabase} from '../lib/supabase';
import {validateRegister, validateLogin} from '../middleware/validation.middleware';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Register
router.post('/register', authLimiter, validateRegister, async (req, res) => {
  try {
    const {email, password, name} = req.body;
    
    // Check if user exists
    const {data: existingUser} = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return res.status(400).json({error: 'User already exists'});
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    const {data: user, error} = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
      })
      .select('id, email, name, created_at')
      .single();
    
    if (error) {
      return res.status(400).json({error: error.message});
    }
    
    // Generate token
    const token = jwt.sign({userId: user.id}, JWT_SECRET, {
      expiresIn: '7d',
    });
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
});

// Login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const {email, password} = req.body;
    
    // Find user
    const {data: user, error} = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({error: 'Invalid credentials'});
    }
    
    // Check password with timing attack protection
    const isMatch = await bcrypt.compare(password, user.password_hash);
    // Always hash a dummy password to prevent timing attacks
    await bcrypt.compare('dummy', '$2b$10$dummy');
    if (!isMatch) {
      return res.status(401).json({error: 'Invalid credentials'});
    }
    
    // Generate token
    const token = jwt.sign({userId: user.id}, JWT_SECRET, {
      expiresIn: '7d',
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({error: 'No token provided'});
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as {userId: string};
    
    const {data: user, error} = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', decoded.userId)
      .single();
    
    if (error || !user) {
      return res.status(401).json({error: 'User not found'});
    }
    
    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    res.status(401).json({error: 'Invalid token'});
  }
});

export default router;
