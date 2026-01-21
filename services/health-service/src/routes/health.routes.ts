import express from 'express';
import axios from 'axios';
import {supabase} from '../lib/supabase';
import WhoopClient from '../lib/whoop';
import {readRateLimiter, writeRateLimiter} from '../middleware/security.middleware';
import {validateQuery} from '../middleware/validation.middleware';

const router = express.Router();

// Helper to get WHOOP access token for user
async function getWhoopToken(userId: string): Promise<string | null> {
  const {data, error} = await supabase
    .from('whoop_tokens')
    .select('access_token, expires_at')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Math.floor(Date.now() / 1000);
  if (data.expires_at && data.expires_at < now + 300) {
    // Token expired or about to expire
    return null;
  }

  return data.access_token;
}

// Helper to create WHOOP client for user
async function getWhoopClient(userId: string): Promise<WhoopClient | null> {
  const token = await getWhoopToken(userId);
  if (!token) {
    return null;
  }
  return new WhoopClient(token);
}

// ========== OAUTH ENDPOINTS ==========

// Get OAuth authorization URL
router.get('/oauth/authorize', readRateLimiter, (req, res) => {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const redirectUri = process.env.WHOOP_REDIRECT_URI || 'http://localhost:3000/api/health/oauth/callback';
  const scopes = [
    'read:recovery',
    'read:cycles',
    'read:workout',
    'read:sleep',
    'read:profile',
    'read:body_measurement',
  ].join(' ');

  if (!clientId) {
    return res.status(500).json({
      error: 'WHOOP_CLIENT_ID not configured',
    });
  }

  const authUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scopes)}`;

  res.json({authUrl});
});

// OAuth callback - exchange code for token
router.get('/oauth/callback', readRateLimiter, async (req, res) => {
  try {
    const {code, state} = req.query;
    const userId = state as string || req.headers['x-user-id'] as string || 'default-user';

    if (!code) {
      return res.status(400).json({error: 'Authorization code is required'});
    }

    const clientId = process.env.WHOOP_CLIENT_ID;
    const clientSecret = process.env.WHOOP_CLIENT_SECRET;
    const redirectUri = process.env.WHOOP_REDIRECT_URI || 'http://localhost:3000/api/health/oauth/callback';

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'WHOOP OAuth credentials not configured',
      });
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://api.prod.whoop.com/oauth/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const {access_token, refresh_token, expires_in} = tokenResponse.data;
    const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

    // Store token in database
    const {error} = await supabase
      .from('whoop_tokens')
      .upsert(
        {
          user_id: userId,
          access_token,
          refresh_token,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        },
      );

    if (error) {
      console.error('Error storing WHOOP token:', error);
      return res.status(500).json({error: 'Failed to store token'});
    }

    res.json({success: true, message: 'WHOOP connected successfully'});
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      error: 'Failed to complete OAuth flow',
      message: error.message,
    });
  }
});

// Disconnect WHOOP
router.delete('/oauth/disconnect', writeRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';

    // Revoke token with WHOOP
    const token = await getWhoopToken(userId);
    if (token) {
      try {
        await axios.delete('https://api.prod.whoop.com/developer/v2/user/access', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error revoking WHOOP token:', error);
      }
    }

    // Remove token from database
    const {error} = await supabase
      .from('whoop_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({error: error.message});
    }

    res.json({success: true, message: 'WHOOP disconnected'});
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// Check connection status
router.get('/oauth/status', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const token = await getWhoopToken(userId);

    res.json({
      connected: !!token,
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});

// ========== PROFILE ENDPOINTS ==========

// Get user profile
router.get('/profile', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const profile = await client.getUserProfile();
    res.json(profile);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

// Get body measurements
router.get('/body-measurements', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const measurements = await client.getBodyMeasurements();
    res.json(measurements);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

// ========== RECOVERY ENDPOINTS ==========

// Get recovery collection
router.get('/recovery', readRateLimiter, validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const {limit, start, end, nextToken} = req.query as any;
    const recoveries = await client.getRecoveries({
      limit: limit ? parseInt(limit, 10) : undefined,
      start,
      end,
      nextToken,
    });

    res.json(recoveries);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

// Get recovery for cycle
router.get('/recovery/cycle/:cycleId', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const cycleId = parseInt(req.params.cycleId, 10);
    const recovery = await client.getRecoveryForCycle(cycleId);
    res.json(recovery);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({error: 'Recovery not found'});
    }
    res.status(500).json({error: error.message});
  }
});

// ========== SLEEP ENDPOINTS ==========

// Get sleep collection
router.get('/sleep', readRateLimiter, validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const {limit, start, end, nextToken} = req.query as any;
    const sleeps = await client.getSleeps({
      limit: limit ? parseInt(limit, 10) : undefined,
      start,
      end,
      nextToken,
    });

    res.json(sleeps);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

// Get sleep by ID
router.get('/sleep/:sleepId', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const sleep = await client.getSleepById(req.params.sleepId);
    res.json(sleep);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({error: 'Sleep not found'});
    }
    res.status(500).json({error: error.message});
  }
});

// Get sleep for cycle
router.get('/sleep/cycle/:cycleId', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const cycleId = parseInt(req.params.cycleId, 10);
    const sleep = await client.getSleepForCycle(cycleId);
    res.json(sleep);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({error: 'Sleep not found'});
    }
    res.status(500).json({error: error.message});
  }
});

// ========== CYCLE ENDPOINTS ==========

// Get cycles collection
router.get('/cycles', readRateLimiter, validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const {limit, start, end, nextToken} = req.query as any;
    const cycles = await client.getCycles({
      limit: limit ? parseInt(limit, 10) : undefined,
      start,
      end,
      nextToken,
    });

    res.json(cycles);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

// Get cycle by ID
router.get('/cycles/:cycleId', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const cycleId = parseInt(req.params.cycleId, 10);
    const cycle = await client.getCycleById(cycleId);
    res.json(cycle);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({error: 'Cycle not found'});
    }
    res.status(500).json({error: error.message});
  }
});

// ========== WORKOUT ENDPOINTS ==========

// Get workouts collection
router.get('/workouts', readRateLimiter, validateQuery, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const {limit, start, end, nextToken} = req.query as any;
    const workouts = await client.getWorkouts({
      limit: limit ? parseInt(limit, 10) : undefined,
      start,
      end,
      nextToken,
    });

    res.json(workouts);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

// Get workout by ID
router.get('/workouts/:workoutId', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    const workout = await client.getWorkoutById(req.params.workoutId);
    res.json(workout);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({error: 'Workout not found'});
    }
    res.status(500).json({error: error.message});
  }
});

// ========== SUMMARY ENDPOINT ==========

// Get health summary (latest recovery, sleep, cycle)
router.get('/summary', readRateLimiter, async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'default-user';
    const client = await getWhoopClient(userId);

    if (!client) {
      return res.status(401).json({
        error: 'WHOOP not connected. Please connect your WHOOP account first.',
      });
    }

    // Get latest data
    const [recoveries, sleeps, cycles] = await Promise.all([
      client.getRecoveries({limit: 1}),
      client.getSleeps({limit: 1}),
      client.getCycles({limit: 1}),
    ]);

    res.json({
      latestRecovery: recoveries.records[0] || null,
      latestSleep: sleeps.records[0] || null,
      latestCycle: cycles.records[0] || null,
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid or expired WHOOP token. Please reconnect.',
      });
    }
    res.status(500).json({error: error.message});
  }
});

export default router;
