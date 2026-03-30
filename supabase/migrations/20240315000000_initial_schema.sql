-- Create tables for the Real Estate CRM

-- Users table (Team Members)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- In a real app, we'd use Supabase Auth, but keeping this for the "Switch User" demo logic
  role TEXT NOT NULL CHECK (role IN ('admin', 'premium', 'elite')),
  status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads/Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  property TEXT NOT NULL,
  property_image TEXT,
  budget TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Novo Contato',
  temperature TEXT NOT NULL DEFAULT 'Morno' CHECK (temperature IN ('Frio', 'Morno', 'Quente')),
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  summary TEXT DEFAULT '',
  conversation_history TEXT DEFAULT '',
  behavioral_analysis JSONB,
  behavioral_history JSONB DEFAULT '[]'::jsonb,
  user_id UUID REFERENCES team_members(id) ON DELETE SET NULL
);

-- AI Analyses table (Optional, for caching or history)
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  ideal_response TEXT,
  master_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for demo, usually more granular)
CREATE POLICY "Public team_members access" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public contacts access" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public ai_analyses access" ON ai_analyses FOR ALL USING (true) WITH CHECK (true);

-- Insert default admin if not exists
-- Note: In Supabase, auth.users is managed by Supabase. 
-- For this demo, we'll just use the public table.
INSERT INTO team_members (id, name, email, password, role, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'Reginaldo Aevo', 'reginaldo.aevo@gmail.com', 'admin', 'admin', 'Ativo')
ON CONFLICT (email) DO NOTHING;
