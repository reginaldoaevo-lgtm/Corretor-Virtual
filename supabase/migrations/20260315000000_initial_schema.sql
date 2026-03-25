-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  property TEXT,
  property_image TEXT,
  budget TEXT,
  status TEXT NOT NULL DEFAULT 'Novo Contato',
  temperature TEXT NOT NULL DEFAULT 'Morno',
  last_interaction DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  summary TEXT,
  user_id UUID REFERENCES auth.users(id) -- Optional: if we want to associate leads with specific users
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- Note: In a real app, use Supabase Auth instead of storing passwords
  role TEXT NOT NULL DEFAULT 'premium',
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies (Public for now for simplicity in this demo, but should be restricted in production)
CREATE POLICY "Public leads access" ON leads FOR ALL USING (true);
CREATE POLICY "Public team_members access" ON team_members FOR ALL USING (true);
