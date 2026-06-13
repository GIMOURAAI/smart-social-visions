
-- Plans catalog
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'brl',
  credits_per_month integer NOT NULL,
  stripe_price_id text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans readable by everyone" ON public.subscription_plans FOR SELECT USING (true);

INSERT INTO public.subscription_plans (slug, name, price_cents, credits_per_month, sort_order) VALUES
  ('solo', 'Solo', 4900, 15, 1),
  ('pro', 'Pro', 7900, 30, 2),
  ('business', 'Business', 12900, 60, 3);

-- User credits / subscription state
CREATE TABLE public.user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_slug text REFERENCES public.subscription_plans(slug),
  credits_remaining integer NOT NULL DEFAULT 0,
  credits_total_month integer NOT NULL DEFAULT 0,
  period_start timestamptz,
  period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own credits readable" ON public.user_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER user_credits_updated BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits_remaining, credits_total_month)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- Audit trail
CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  reason text NOT NULL,
  post_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX credit_tx_user_idx ON public.credit_transactions(user_id, created_at DESC);
GRANT SELECT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transactions readable" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Atomic credit consumption (called from edge function via service role)
CREATE OR REPLACE FUNCTION public.consume_credit(_user_id uuid, _amount integer, _reason text, _post_id uuid DEFAULT NULL)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _remaining integer;
BEGIN
  UPDATE public.user_credits
     SET credits_remaining = credits_remaining - _amount,
         updated_at = now()
   WHERE user_id = _user_id AND credits_remaining >= _amount
   RETURNING credits_remaining INTO _remaining;

  IF _remaining IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.credit_transactions (user_id, delta, reason, post_id)
  VALUES (_user_id, -_amount, _reason, _post_id);

  RETURN _remaining;
END $$;

-- Post batches (wizard runs)
CREATE TABLE public.post_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  niche text NOT NULL,
  theme text NOT NULL,
  objective text NOT NULL,
  tone text NOT NULL,
  visual_style text NOT NULL,
  brand_images text[] DEFAULT '{}',
  feed_pattern text NOT NULL,
  format text NOT NULL,
  days integer NOT NULL,
  total_posts integer NOT NULL,
  pilot_count integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_batches TO authenticated;
GRANT ALL ON public.post_batches TO service_role;
ALTER TABLE public.post_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own batches all" ON public.post_batches FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER post_batches_updated BEFORE UPDATE ON public.post_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Expand posts table with PostLab fields
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS batch_id uuid REFERENCES public.post_batches(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS block text,
  ADD COLUMN IF NOT EXISTS position integer,
  ADD COLUMN IF NOT EXISTS gancho text,
  ADD COLUMN IF NOT EXISTS titulo_arte text,
  ADD COLUMN IF NOT EXISTS subtitulo text,
  ADD COLUMN IF NOT EXISTS texto_arte text,
  ADD COLUMN IF NOT EXISTS legenda text,
  ADD COLUMN IF NOT EXISTS cta text,
  ADD COLUMN IF NOT EXISTS hashtags text[],
  ADD COLUMN IF NOT EXISTS story_complementar text,
  ADD COLUMN IF NOT EXISTS image_prompt text,
  ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;
