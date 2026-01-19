import express from 'express';
import {supabase} from '../lib/supabase';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('users')
      .select('id, email, name, created_at, updated_at')
      .eq('id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({error: 'User not found'});
      }
      return res.status(500).json({error: error.message});
    }
    
    if (!data) {
      return res.status(404).json({error: 'User not found'});
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const {name, email} = req.body;
    
    const {data, error} = await supabase
      .from('users')
      .update({
        name,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('id, email, name, created_at, updated_at')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({error: 'User not found'});
      }
      return res.status(400).json({error: error.message});
    }
    
    if (!data) {
      return res.status(404).json({error: 'User not found'});
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(400).json({error: error.message});
  }
});

export default router;
