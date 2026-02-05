-- Create a table for PDF Generation History
CREATE TABLE pdf_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT, -- For Clerk integration later
  title TEXT NOT NULL,
  template TEXT NOT NULL,
  content_preview TEXT,
  char_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE pdf_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read/insert (for demo)
-- NOTE: In production, tie this to auth.uid()
CREATE POLICY "Allow public access for now" ON pdf_history
  FOR ALL USING (true) WITH CHECK (true);

-- Create a table for Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL, -- Ties to Clerk User ID
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  stripe_current_period_end TIMESTAMP WITH TIME ZONE,
  status TEXT, -- 'active', 'canceled', 'incomplete', etc.
  plan_type TEXT DEFAULT 'starter', -- 'starter', 'creator', 'pro', 'business', 'lifetime'
  ai_usage_count INTEGER DEFAULT 0, 
  pdf_usage_count INTEGER DEFAULT 0, -- Tracks monthly PDF generation
  last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- For monthly usage reset
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT USING (true); -- Simplifying for demo, usually auth.uid()
