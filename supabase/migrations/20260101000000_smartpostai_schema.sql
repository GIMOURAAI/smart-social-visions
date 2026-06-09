-- Add SmartPostAI columns to existing posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS niche TEXT,
ADD COLUMN IF NOT EXISTS theme TEXT,
ADD COLUMN IF NOT EXISTS objective TEXT,
ADD COLUMN IF NOT EXISTS tone TEXT,
ADD COLUMN IF NOT EXISTS visual_style TEXT,
ADD COLUMN IF NOT EXISTS gancho TEXT,
ADD COLUMN IF NOT EXISTS titulo_arte TEXT,
ADD COLUMN IF NOT EXISTS subtitulo_arte TEXT,
ADD COLUMN IF NOT EXISTS legenda TEXT,
ADD COLUMN IF NOT EXISTS cta TEXT,
ADD COLUMN IF NOT EXISTS hashtags TEXT,
ADD COLUMN IF NOT EXISTS prompt_visual TEXT,
ADD COLUMN IF NOT EXISTS story_complementar TEXT,
ADD COLUMN IF NOT EXISTS tipo_conteudo TEXT,
ADD COLUMN IF NOT EXISTS intencao_emocional TEXT;

-- Create user_usage table for plan/quota tracking
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL DEFAULT 'solo',
  posts_limit INTEGER NOT NULL DEFAULT 15,
  posts_used INTEGER NOT NULL DEFAULT 0,
  images_limit INTEGER NOT NULL DEFAULT 5,
  images_used INTEGER NOT NULL DEFAULT 0,
  enhancements_limit INTEGER NOT NULL DEFAULT 0,
  enhancements_used INTEGER NOT NULL DEFAULT 0,
  reset_date TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 month'),
  subscription_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create brand_styles table for storing brand reference data
CREATE TABLE IF NOT EXISTS brand_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand_style_name TEXT NOT NULL,
  color_palette TEXT[],
  visual_description TEXT,
  tone_of_voice TEXT,
  preferred_format TEXT,
  reference_images TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_styles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_usage
CREATE POLICY "Users can view own usage"
  ON user_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON user_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON user_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for brand_styles
CREATE POLICY "Users can view own brand styles"
  ON brand_styles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand styles"
  ON brand_styles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand styles"
  ON brand_styles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand styles"
  ON brand_styles FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-create user_usage row on new user signup
CREATE OR REPLACE FUNCTION handle_new_user_usage()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_usage (user_id, plan_name, posts_limit, images_limit)
  VALUES (NEW.id, 'solo', 15, 5)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after each new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created_usage ON auth.users;
CREATE TRIGGER on_auth_user_created_usage
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_usage();
