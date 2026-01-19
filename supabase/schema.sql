-- Trading Records Table
CREATE TABLE IF NOT EXISTS trading_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('forex', 'crypto')),
  before_trading JSONB NOT NULL,
  after_trading JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_trading_records_user_id ON trading_records(user_id);

-- Create index on trade_type
CREATE INDEX IF NOT EXISTS idx_trading_records_trade_type ON trading_records(trade_type);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_trading_records_created_at ON trading_records(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_trading_records_updated_at
  BEFORE UPDATE ON trading_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Users Table (for auth service)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger to automatically update updated_at for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE trading_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own trading records
CREATE POLICY "Users can view own trading records"
  ON trading_records
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own trading records
CREATE POLICY "Users can insert own trading records"
  ON trading_records
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own trading records
CREATE POLICY "Users can update own trading records"
  ON trading_records
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own trading records
CREATE POLICY "Users can delete own trading records"
  ON trading_records
  FOR DELETE
  USING (auth.uid()::text = user_id);
