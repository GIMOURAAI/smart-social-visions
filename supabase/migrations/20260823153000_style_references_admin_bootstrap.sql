-- Dynamic style reference gallery + admin bootstrap for Smart Post AI

CREATE TABLE IF NOT EXISTS public.style_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  label text NOT NULL,
  description text,
  image_path text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS style_references_category_order_idx
  ON public.style_references(category, sort_order, created_at);

GRANT SELECT ON public.style_references TO authenticated;
GRANT ALL ON public.style_references TO service_role;
ALTER TABLE public.style_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "style refs readable by authenticated" ON public.style_references;
CREATE POLICY "style refs readable by authenticated"
  ON public.style_references FOR SELECT TO authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins manage style refs" ON public.style_references;
CREATE POLICY "admins manage style refs"
  ON public.style_references FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Private bucket for reference images. Authenticated users may read; only admins may write.
INSERT INTO storage.buckets (id, name, public)
VALUES ('style-refs', 'style-refs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "style refs images readable" ON storage.objects;
CREATE POLICY "style refs images readable"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'style-refs');

DROP POLICY IF EXISTS "style refs images admin insert" ON storage.objects;
CREATE POLICY "style refs images admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'style-refs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "style refs images admin update" ON storage.objects;
CREATE POLICY "style refs images admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'style-refs' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'style-refs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "style refs images admin delete" ON storage.objects;
CREATE POLICY "style refs images admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'style-refs' AND public.has_role(auth.uid(), 'admin'));

-- Promote the designated owner account to admin and give test credits whenever that account exists.
CREATE OR REPLACE FUNCTION public.bootstrap_smartpost_owner()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  _uid uuid;
BEGIN
  SELECT id INTO _uid
  FROM auth.users
  WHERE lower(email) = lower('gmrdm1985@gmail.com')
  LIMIT 1;

  IF _uid IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.user_credits (
    user_id, plan_slug, credits_remaining, credits_total_month,
    period_start, period_end, subscription_status
  )
  VALUES (
    _uid, 'business', 100, 100,
    now(), now() + interval '1 month', 'active'
  )
  ON CONFLICT (user_id) DO UPDATE
    SET credits_remaining = GREATEST(public.user_credits.credits_remaining, 100),
        credits_total_month = GREATEST(public.user_credits.credits_total_month, 100),
        subscription_status = 'active',
        updated_at = now();
END;
$$;

-- Apply immediately for an existing account.
SELECT public.bootstrap_smartpost_owner();

-- Also bootstrap if the owner signs up after migrations are applied.
CREATE OR REPLACE FUNCTION public.handle_smartpost_owner_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF lower(NEW.email) = lower('gmrdm1985@gmail.com') THEN
    PERFORM public.bootstrap_smartpost_owner();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_smartpost_owner_signup ON auth.users;
CREATE TRIGGER on_smartpost_owner_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_smartpost_owner_signup();
