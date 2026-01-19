import express from 'express';
import {supabase} from '../lib/supabase';
import {Asset, Balance, Transaction, FinanceSummary} from '../types/finance';
import {
  validateAsset,
  validateTransaction,
  validateQuery,
} from '../middleware/validation.middleware';
import {writeRateLimiter, readRateLimiter} from '../middleware/security.middleware';

const router = express.Router();

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] =
      typeof value === 'object' && value !== null ? toSnakeCase(value) : value;
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
    result[camelKey] =
      typeof value === 'object' && value !== null ? toCamelCase(value) : value;
  }
  return result;
}

// ========== BALANCE ENDPOINTS ==========

// Get user balance
router.get('/balance', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';

    const {data, error} = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({error: error.message});
    }

    // If no balance exists, return default
    if (!data) {
      return res.json({
        userId,
        totalBalance: 0,
        currency: 'USD',
        availableBalance: 0,
        lockedBalance: 0,
      });
    }

    res.json(toCamelCase(data));
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Update balance
router.put('/balance', writeRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    const {totalBalance, availableBalance, lockedBalance, currency} = req.body;

    const {data, error} = await supabase
      .from('balances')
      .upsert(
        {
          user_id: userId,
          total_balance: totalBalance || 0,
          available_balance: availableBalance || 0,
          locked_balance: lockedBalance || 0,
          currency: currency || 'USD',
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        },
      )
      .select()
      .single();

    if (error) {
      return res.status(400).json({error: error.message});
    }

    res.json(toCamelCase(data));
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
});

// ========== ASSETS ENDPOINTS ==========

// Get all assets
router.get('/assets', readRateLimiter, validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    const {limit = 50, offset = 0} = req.query as any;

    const {data, error, count} = await supabase
      .from('assets')
      .select('*', {count: 'exact'})
      .eq('user_id', userId)
      .order('total_value', {ascending: false})
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({error: error.message});
    }

    res.json({
      assets: data ? data.map(toCamelCase) : [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Get single asset
router.get('/assets/:id', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';

    const {data, error} = await supabase
      .from('assets')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({error: 'Asset not found'});
      }
      return res.status(500).json({error: error.message});
    }

    if (!data) {
      return res.status(404).json({error: 'Asset not found'});
    }

    res.json(toCamelCase(data));
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Create or update asset
router.post('/assets', writeRateLimiter, validateAsset, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';

    const assetData = {
      user_id: userId,
      ...toSnakeCase(req.body),
    };

    const {data, error} = await supabase
      .from('assets')
      .upsert(assetData, {
        onConflict: 'user_id,symbol',
      })
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

// Update asset
router.put('/assets/:id', writeRateLimiter, validateAsset, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';

    const updateData = toSnakeCase(req.body);
    delete updateData.id;
    delete updateData.created_at;

    const {data, error} = await supabase
      .from('assets')
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
        return res.status(404).json({error: 'Asset not found'});
      }
      return res.status(400).json({error: error.message});
    }

    if (!data) {
      return res.status(404).json({error: 'Asset not found'});
    }

    res.json(toCamelCase(data));
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
});

// Delete asset
router.delete('/assets/:id', writeRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';

    const {data, error} = await supabase
      .from('assets')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({error: error.message});
    }

    if (!data) {
      return res.status(404).json({error: 'Asset not found'});
    }

    res.json({message: 'Asset deleted successfully'});
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// ========== TRANSACTIONS ENDPOINTS ==========

// Get all transactions
router.get('/transactions', readRateLimiter, validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';
    const {limit = 50, offset = 0} = req.query as any;

    const {data, error, count} = await supabase
      .from('transactions')
      .select('*', {count: 'exact'})
      .eq('user_id', userId)
      .order('created_at', {ascending: false})
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({error: error.message});
    }

    res.json({
      transactions: data ? data.map(toCamelCase) : [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Create transaction
router.post(
  '/transactions',
  writeRateLimiter,
  validateTransaction,
  async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'default-user';

      const transactionData = {
        user_id: userId,
        ...toSnakeCase(req.body),
        status: 'pending',
      };

      const {data, error} = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        return res.status(400).json({error: error.message});
      }

      res.status(201).json(toCamelCase(data));
    } catch (error: any) {
      res.status(400).json({error: error.message});
    }
  },
);

// ========== SUMMARY ENDPOINT ==========

// Get finance summary
router.get('/summary', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default-user';

    // Get balance
    const {data: balanceData} = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get assets
    const {data: assetsData} = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId);

    const totalBalance = balanceData?.total_balance || 0;
    const assets = assetsData || [];
    const totalAssets = assets.reduce(
      (sum: number, asset: any) => sum + (asset.total_value || 0),
      0,
    );

    const summary: FinanceSummary = {
      totalBalance,
      totalAssets,
      totalLiabilities: 0, // TODO: Implement liabilities
      netWorth: totalBalance + totalAssets,
      assets: assets.map(toCamelCase),
    };

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

export default router;
