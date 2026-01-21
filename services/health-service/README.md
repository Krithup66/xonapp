# Health Service - WHOOP API Integration

บริการเชื่อมต่อกับ WHOOP API เพื่อดึงข้อมูลสุขภาพของผู้ใช้

## Features

- 🔐 OAuth2 Authentication with WHOOP
- 📊 Recovery Data (Recovery Score, HRV, Resting Heart Rate)
- 😴 Sleep Data (Sleep Stages, Performance, Duration)
- 🔄 Cycle Data (Strain, Heart Rate Zones)
- 💪 Workout Data (Activity Strain, Heart Rate Zones)
- 👤 User Profile & Body Measurements

## Setup

### 1. WHOOP Developer Account

1. ไปที่ [WHOOP Developer Portal](https://developer.whoop.com/)
2. สร้าง OAuth Application
3. รับ `CLIENT_ID` และ `CLIENT_SECRET`
4. ตั้งค่า Redirect URI: `http://localhost:3000/api/health/oauth/callback`

### 2. Environment Variables

เพิ่มใน `.env` file:

```env
# WHOOP OAuth
WHOOP_CLIENT_ID=your-client-id
WHOOP_CLIENT_SECRET=your-client-secret
WHOOP_REDIRECT_URI=http://localhost:3000/api/health/oauth/callback

# Supabase (ใช้ค่าจาก services อื่น)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Schema

รัน SQL schema:

```bash
# ใน Supabase SQL Editor
# รันไฟล์: supabase/health-schema.sql
```

## API Endpoints

### OAuth

- `GET /api/health/oauth/authorize` - Get OAuth authorization URL
- `GET /api/health/oauth/callback` - OAuth callback (WHOOP redirects here)
- `GET /api/health/oauth/status` - Check connection status
- `DELETE /api/health/oauth/disconnect` - Disconnect WHOOP account

### Profile

- `GET /api/health/profile` - Get user profile
- `GET /api/health/body-measurements` - Get body measurements

### Recovery

- `GET /api/health/recovery` - Get recovery collection
  - Query params: `limit`, `start`, `end`, `nextToken`
- `GET /api/health/recovery/cycle/:cycleId` - Get recovery for cycle

### Sleep

- `GET /api/health/sleep` - Get sleep collection
  - Query params: `limit`, `start`, `end`, `nextToken`
- `GET /api/health/sleep/:sleepId` - Get sleep by ID
- `GET /api/health/sleep/cycle/:cycleId` - Get sleep for cycle

### Cycles

- `GET /api/health/cycles` - Get cycles collection
  - Query params: `limit`, `start`, `end`, `nextToken`
- `GET /api/health/cycles/:cycleId` - Get cycle by ID

### Workouts

- `GET /api/health/workouts` - Get workouts collection
  - Query params: `limit`, `start`, `end`, `nextToken`
- `GET /api/health/workouts/:workoutId` - Get workout by ID

### Summary

- `GET /api/health/summary` - Get latest recovery, sleep, and cycle data

## Usage Example

### 1. Connect WHOOP Account

```javascript
// Get authorization URL
const response = await fetch('http://localhost:3000/api/health/oauth/authorize', {
  headers: {
    'X-User-Id': 'user-123'
  }
});
const { authUrl } = await response.json();

// Redirect user to authUrl
// User authorizes, WHOOP redirects to callback
```

### 2. Get Recovery Data

```javascript
const response = await fetch('http://localhost:3000/api/health/recovery?limit=10', {
  headers: {
    'X-User-Id': 'user-123'
  }
});
const { records, next_token } = await response.json();
```

### 3. Get Health Summary

```javascript
const response = await fetch('http://localhost:3000/api/health/summary', {
  headers: {
    'X-User-Id': 'user-123'
  }
});
const { latestRecovery, latestSleep, latestCycle } = await response.json();
```

## WHOOP API Scopes

Service ใช้ scopes ต่อไปนี้:
- `read:recovery` - Read Recovery data
- `read:cycles` - Read cycles data
- `read:workout` - Read workout data
- `read:sleep` - Read sleep data
- `read:profile` - Read profile data
- `read:body_measurement` - Read body measurements

## Rate Limiting

- Read operations: 200 requests / 15 minutes
- Write operations: 50 requests / 15 minutes

## Security

- OAuth tokens stored securely in Supabase
- Row Level Security (RLS) enabled
- Tokens automatically expire and require reconnection
- All requests require `X-User-Id` header

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Start production
npm start
```

## Port

Default port: **3006**
