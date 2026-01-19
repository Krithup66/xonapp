-- Icons Table
-- สำหรับเก็บไอคอนและโลโก้

CREATE TABLE IF NOT EXISTS icons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('icon', 'logo', 'image')),
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  svg_content TEXT,
  metadata JSONB,
  tags TEXT[],
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_icons_category ON icons(category);
CREATE INDEX IF NOT EXISTS idx_icons_type ON icons(type);
CREATE INDEX IF NOT EXISTS idx_icons_user_id ON icons(user_id);
CREATE INDEX IF NOT EXISTS idx_icons_created_at ON icons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_icons_tags ON icons USING GIN(tags);

-- Full-text search index for name and category
CREATE INDEX IF NOT EXISTS idx_icons_search ON icons USING GIN(to_tsvector('english', name || ' ' || COALESCE(category, '')));

-- Trigger to automatically update updated_at
CREATE TRIGGER update_icons_updated_at
  BEFORE UPDATE ON icons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE icons ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view icons (public icons)
CREATE POLICY "Anyone can view icons"
  ON icons
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert icons
CREATE POLICY "Authenticated users can insert icons"
  ON icons
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

-- Policy: Users can update their own icons
CREATE POLICY "Users can update own icons"
  ON icons
  FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Policy: Users can delete their own icons
CREATE POLICY "Users can delete own icons"
  ON icons
  FOR DELETE
  USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Sample data (optional)
-- INSERT INTO icons (name, type, category, url, tags) VALUES
-- ('Xon Logo', 'logo', 'brand', 'https://example.com/logo.png', ARRAY['brand', 'logo', 'xon']),
-- ('Home Icon', 'icon', 'navigation', 'https://example.com/home.svg', ARRAY['navigation', 'home']);
