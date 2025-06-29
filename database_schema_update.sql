-- ========== 💣 DROP EVERYTHING (safe order) ==========

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS payment_proofs CASCADE;
DROP TABLE IF EXISTS shared_portfolios CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP FUNCTION IF EXISTS cleanup_expired_portfolios();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TYPE IF EXISTS subscription_tier;

-- ========== 🔁 ENUM TYPES ==========

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('free', 'standard', 'pro');
  END IF;
END$$;

-- ========== �� PROFILES ==========

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ========== 🔄 USER AUTO PROFILE TRIGGER ==========

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== 🧑‍🎨 PORTFOLIOS ==========

CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  
  -- Contact Information
  contact JSONB DEFAULT '{}'::jsonb,
  
  -- Skills and Projects
  skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  
  -- Education and Experience
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  
  -- Additional Professional Information
  certifications JSONB DEFAULT '[]'::jsonb,
  awards JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  volunteer JSONB DEFAULT '[]'::jsonb,
  publications JSONB DEFAULT '[]'::jsonb,
  patents JSONB DEFAULT '[]'::jsonb,
  
  -- Template and Deployment
  template TEXT DEFAULT 'minimal',
  subdomain TEXT UNIQUE,
  deployment_url TEXT,
  is_deployed BOOLEAN DEFAULT FALSE,
  is_exported BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_template ON portfolios(template);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_deployed ON portfolios(is_deployed);
CREATE INDEX IF NOT EXISTS idx_portfolios_subdomain ON portfolios(subdomain);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_portfolios_contact ON portfolios USING GIN (contact);
CREATE INDEX IF NOT EXISTS idx_portfolios_skills ON portfolios USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_portfolios_projects ON portfolios USING GIN (projects);
CREATE INDEX IF NOT EXISTS idx_portfolios_education ON portfolios USING GIN (education);
CREATE INDEX IF NOT EXISTS idx_portfolios_experience ON portfolios USING GIN (experience);
CREATE INDEX IF NOT EXISTS idx_portfolios_certifications ON portfolios USING GIN (certifications);
CREATE INDEX IF NOT EXISTS idx_portfolios_awards ON portfolios USING GIN (awards);
CREATE INDEX IF NOT EXISTS idx_portfolios_languages ON portfolios USING GIN (languages);
CREATE INDEX IF NOT EXISTS idx_portfolios_interests ON portfolios USING GIN (interests);
CREATE INDEX IF NOT EXISTS idx_portfolios_volunteer ON portfolios USING GIN (volunteer);
CREATE INDEX IF NOT EXISTS idx_portfolios_publications ON portfolios USING GIN (publications);
CREATE INDEX IF NOT EXISTS idx_portfolios_patents ON portfolios USING GIN (patents);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolios_updated_at 
    BEFORE UPDATE ON portfolios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Basic CRUD policies
CREATE POLICY "Users can view own portfolios" ON portfolios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios" ON portfolios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" ON portfolios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" ON portfolios
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for deployed portfolios (for subdomain access)
CREATE POLICY "Public can view deployed portfolios" ON portfolios
    FOR SELECT USING (is_deployed = true);

-- ========== 🔗 SHARED PORTFOLIOS ==========

CREATE TABLE IF NOT EXISTS shared_portfolios (
  id VARCHAR(50) PRIMARY KEY,
  portfolio_data JSONB NOT NULL,
  template VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_shared_portfolios_expires_at ON shared_portfolios(expires_at);
CREATE INDEX IF NOT EXISTS idx_shared_portfolios_created_at ON shared_portfolios(created_at);

CREATE OR REPLACE FUNCTION cleanup_expired_portfolios()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM shared_portfolios WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ========== 💳 PAYMENT PROOFS ==========

CREATE TABLE IF NOT EXISTS payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  upi_id TEXT DEFAULT 'rathod2304hetal@okaxis',
  amount INTEGER DEFAULT 299,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== 🧾 SUBSCRIPTION HISTORY ==========

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- ========== ✅ VERIFICATION ==========

-- Verify the table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'portfolios'
-- ORDER BY ordinal_position;