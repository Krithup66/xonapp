import {Router, Request, Response} from 'express';
import {supabase} from '../lib/supabase';
import {Icon, CreateIconDto, UpdateIconDto, IconQuery} from '../types/icon';
import {validateCreateIcon, validateUpdateIcon} from '../middleware/validation.middleware';
import {readRateLimiter, writeRateLimiter} from '../middleware/security.middleware';

const router = Router();

/**
 * GET /icons
 * Get all icons with optional filters
 */
router.get('/', readRateLimiter, async (req: Request, res: Response) => {
  try {
    const query: IconQuery = {
      category: req.query.category as string,
      type: req.query.type as 'icon' | 'logo' | 'image',
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    };

    let supabaseQuery = supabase.from('icons').select('*');

    // Apply filters
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }

    if (query.type) {
      supabaseQuery = supabaseQuery.eq('type', query.type);
    }

    if (query.search) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query.search}%,category.ilike.%${query.search}%`,
      );
    }

    // Pagination
    supabaseQuery = supabaseQuery
      .range(query.offset || 0, (query.offset || 0) + (query.limit || 50) - 1)
      .order('created_at', {ascending: false});

    const {data, error} = await supabaseQuery;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({error: 'Failed to fetch icons'});
    }

    res.json({
      icons: data || [],
      count: data?.length || 0,
      limit: query.limit,
      offset: query.offset,
    });
  } catch (error) {
    console.error('Error fetching icons:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

/**
 * GET /icons/:id
 * Get icon by ID
 */
router.get('/:id', readRateLimiter, async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    const {data, error} = await supabase
      .from('icons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({error: 'Icon not found'});
      }
      console.error('Supabase error:', error);
      return res.status(500).json({error: 'Failed to fetch icon'});
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching icon:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

/**
 * GET /icons/category/:category
 * Get icons by category
 */
router.get(
  '/category/:category',
  readRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const {category} = req.params;

      const {data, error} = await supabase
        .from('icons')
        .select('*')
        .eq('category', category)
        .order('created_at', {ascending: false});

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({error: 'Failed to fetch icons'});
      }

      res.json({icons: data || [], count: data?.length || 0});
    } catch (error) {
      console.error('Error fetching icons by category:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
);

/**
 * POST /icons
 * Create new icon
 */
router.post(
  '/',
  writeRateLimiter,
  validateCreateIcon,
  async (req: Request, res: Response) => {
    try {
      const iconData: CreateIconDto = req.body;
      const userId = req.headers['x-user-id'] as string;

      const {data, error} = await supabase
        .from('icons')
        .insert({
          ...iconData,
          user_id: userId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({error: 'Failed to create icon'});
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating icon:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
);

/**
 * PUT /icons/:id
 * Update icon
 */
router.put(
  '/:id',
  writeRateLimiter,
  validateUpdateIcon,
  async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const updateData: UpdateIconDto = req.body;

      const {data, error} = await supabase
        .from('icons')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({error: 'Icon not found'});
        }
        console.error('Supabase error:', error);
        return res.status(500).json({error: 'Failed to update icon'});
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating icon:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
);

/**
 * DELETE /icons/:id
 * Delete icon
 */
router.delete('/:id', writeRateLimiter, async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    const {error} = await supabase.from('icons').delete().eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({error: 'Failed to delete icon'});
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting icon:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

export default router;
