-- ====================================
-- SOLENZA FURNITURE - CAMPAIGN FIX SCRIPT
-- ====================================
-- Bu script sadece eksik olan 'campaigns' tablosunu oluşturur.
-- Mevcut tablolara (kategoriler, ürünler) dokunmaz.

-- 1. CAMPAIGNS (Kampanyalar)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text,
  start_date date,
  end_date date,
  show_on_homepage boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Campaign Translations
CREATE TABLE IF NOT EXISTS public.campaign_translations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  lang text NOT NULL CHECK (lang IN ('tr', 'en')),
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(campaign_id, lang)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON public.campaigns(is_active, show_on_homepage);

-- 4. RLS Policies
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are viewable by everyone"
  ON public.campaigns FOR SELECT
  USING (true);

CREATE POLICY "Campaigns are insertable by authenticated users"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Campaigns are updatable by authenticated users"
  ON public.campaigns FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Campaigns are deletable by authenticated users"
  ON public.campaigns FOR DELETE
  USING (auth.role() = 'authenticated');

ALTER TABLE public.campaign_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign translations are viewable by everyone"
  ON public.campaign_translations FOR SELECT
  USING (true);

CREATE POLICY "Campaign translations are insertable by authenticated users"
  ON public.campaign_translations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Campaign translations are updatable by authenticated users"
  ON public.campaign_translations FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Campaign translations are deletable by authenticated users"
  ON public.campaign_translations FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. Storage Bucket for Campaigns
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaigns', 'campaigns', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for campaigns"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'campaigns');

CREATE POLICY "Authenticated Upload for campaigns"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'campaigns' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update for campaigns"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'campaigns' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete for campaigns"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'campaigns' AND auth.role() = 'authenticated');

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
