-- WHOOP OAuth Tokens Table
-- Stores OAuth tokens for WHOOP API integration

CREATE TABLE IF NOT EXISTS whoop_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_whoop_tokens_user_id ON whoop_tokens(user_id);

-- RLS (Row Level Security) - users can only access their own tokens
ALTER TABLE whoop_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tokens
CREATE POLICY "Users can view own whoop tokens"
  ON whoop_tokens
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own tokens
CREATE POLICY "Users can insert own whoop tokens"
  ON whoop_tokens
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own tokens
CREATE POLICY "Users can update own whoop tokens"
  ON whoop_tokens
  FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own tokens
CREATE POLICY "Users can delete own whoop tokens"
  ON whoop_tokens
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whoop_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_whoop_tokens_updated_at
  BEFORE UPDATE ON whoop_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_whoop_tokens_updated_at();
