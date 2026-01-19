import express from 'express';
import {supabase} from '../lib/supabase';
import {TradingRecord} from '../types/trading-record';
import {validateTradingRecord, validateQuery} from '../middleware/validation.middleware';
import {writeRateLimiter} from '../middleware/security.middleware';

const router = express.Router();

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = typeof value === 'object' && value !== null ? toSnakeCase(value) : value;
  }
  return result;
}

// Helper function to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'object' && value !== null ? toCamelCase(value) : value;
  }
  return result;
}

// Create trading record
router.post('/', writeRateLimiter, validateTradingRecord, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    
    const record: TradingRecord = {
      user_id: userId,
      ...toSnakeCase(req.body),
    };
    
    const {data, error} = await supabase
      .from('trading_records')
      .insert(record)
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({error: error.message});
    }
    
    res.status(201).json(toCamelCase(data));
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
});

// Get all trading records
router.get('/', validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    const {tradeType, limit = 50, offset = 0} = req.query;
    
    let query = supabase
      .from('trading_records')
      .select('*', {count: 'exact'})
      .eq('user_id', userId)
      .order('created_at', {ascending: false})
      .range(Number(offset), Number(offset) + Number(limit) - 1);
    
    if (tradeType) {
      query = query.eq('trade_type', tradeType);
    }
    
    const {data, error, count} = await query;
    
    if (error) {
      return res.status(500).json({error: error.message});
    }
    
    res.json({
      records: data ? data.map(toCamelCase) : [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Get single trading record
router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    
    const {data, error} = await supabase
      .from('trading_records')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({error: 'Record not found'});
      }
      return res.status(500).json({error: error.message});
    }
    
    if (!data) {
      return res.status(404).json({error: 'Record not found'});
    }
    
    res.json(toCamelCase(data));
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Update trading record
router.put('/:id', writeRateLimiter, validateTradingRecord, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    
    const updateData = toSnakeCase(req.body);
    delete updateData.id; // Don't allow updating ID
    delete updateData.created_at; // Don't allow updating created_at
    
    const {data, error} = await supabase
      .from('trading_records')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({error: 'Record not found'});
      }
      return res.status(400).json({error: error.message});
    }
    
    if (!data) {
      return res.status(404).json({error: 'Record not found'});
    }
    
    res.json(toCamelCase(data));
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
});

// Delete trading record
router.delete('/:id', writeRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    
    const {data, error} = await supabase
      .from('trading_records')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({error: error.message});
    }
    
    if (!data) {
      return res.status(404).json({error: 'Record not found'});
    }
    
    res.json({message: 'Record deleted successfully'});
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Get statistics
router.get('/statistics/summary', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    
    // Get all records for the user
    const {data: records, error} = await supabase
      .from('trading_records')
      .select('after_trading')
      .eq('user_id', userId);
    
    if (error) {
      return res.status(500).json({error: error.message});
    }
    
    const totalRecords = records?.length || 0;
    const winRecords = records?.filter((r: any) => r.after_trading?.result === 'Win').length || 0;
    const lossRecords = records?.filter((r: any) => r.after_trading?.result === 'Loss').length || 0;
    const breakEvenRecords = records?.filter((r: any) => r.after_trading?.result === 'BreakEven').length || 0;
    
    // Calculate total profit
    const totalProfit = records?.reduce((sum: number, record: any) => {
      const profit = parseFloat(record.after_trading?.profit || '0');
      return sum + profit;
    }, 0) || 0;
    
    res.json({
      totalRecords,
      winRecords,
      lossRecords,
      breakEvenRecords,
      winRate: totalRecords > 0 ? (winRecords / totalRecords) * 100 : 0,
      totalProfit,
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

export default router;
