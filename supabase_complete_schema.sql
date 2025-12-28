-- ====================================
-- SOLENZA FURNITURE - COMPLETE DATABASE SCHEMA
-- ====================================
-- Bu dosya tüm eksik tabloları ve yapılandırmayı içerir
-- Supabase SQL Editor'de çalıştırın

-- ====================================
-- 1. CATEGORIES (Kategoriler)
-- ====================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Category Translations
CREATE TABLE IF NOT EXISTS public.category_translations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  lang text NOT NULL CHECK (lang IN ('tr', 'en')),
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(category_id, lang)
);

-- ====================================
-- 2. PRODUCTS (Ürünler)
-- ====================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price numeric(10,2),
  show_price boolean DEFAULT true,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  stock_status text DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'pre_order')),
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Translations
CREATE TABLE IF NOT EXISTS public.product_translations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  lang text NOT NULL CHECK (lang IN ('tr', 'en')),
  title text NOT NULL,
  description text,
  specs text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, lang)
);

-- Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================
-- 3. CAMPAIGNS (Kampanyalar)
-- ====================================
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

-- Campaign Translations
CREATE TABLE IF NOT EXISTS public.campaign_translations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  lang text NOT NULL CHECK (lang IN ('tr', 'en')),
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(campaign_id, lang)
);

-- ====================================
-- 4. SETTINGS (Site Ayarları)
-- ====================================
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================
-- 5. FAVORITES (Favoriler)
-- ====================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- ====================================
-- INDEXES (Performans için)
-- ====================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON public.campaigns(is_active, show_on_homepage);

-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Categories are insertable by authenticated users"
  ON public.categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users"
  ON public.categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users"
  ON public.categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- Category Translations
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Category translations are viewable by everyone"
  ON public.category_translations FOR SELECT
  USING (true);

CREATE POLICY "Category translations are insertable by authenticated users"
  ON public.category_translations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Category translations are updatable by authenticated users"
  ON public.category_translations FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Category translations are deletable by authenticated users"
  ON public.category_translations FOR DELETE
  USING (auth.role() = 'authenticated');

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by authenticated users"
  ON public.products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users"
  ON public.products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users"
  ON public.products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Product Translations
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product translations are viewable by everyone"
  ON public.product_translations FOR SELECT
  USING (true);

CREATE POLICY "Product translations are insertable by authenticated users"
  ON public.product_translations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product translations are updatable by authenticated users"
  ON public.product_translations FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Product translations are deletable by authenticated users"
  ON public.product_translations FOR DELETE
  USING (auth.role() = 'authenticated');

-- Product Images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Product images are insertable by authenticated users"
  ON public.product_images FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product images are updatable by authenticated users"
  ON public.product_images FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Product images are deletable by authenticated users"
  ON public.product_images FOR DELETE
  USING (auth.role() = 'authenticated');

-- Campaigns
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

-- Campaign Translations
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

-- Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Settings are insertable by authenticated users"
  ON public.settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings are updatable by authenticated users"
  ON public.settings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Settings are deletable by authenticated users"
  ON public.settings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================
-- STORAGE BUCKETS
-- ====================================

-- Product Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Campaigns Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaigns', 'campaigns', true)
ON CONFLICT (id) DO NOTHING;

-- Hero Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero', 'hero', true)
ON CONFLICT (id) DO NOTHING;

-- Statement Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('statement', 'statement', true)
ON CONFLICT (id) DO NOTHING;

-- Category Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- ====================================
-- STORAGE POLICIES
-- ====================================

-- Product Images Storage Policies
CREATE POLICY "Public Access for product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated Upload for product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update for product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete for product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Campaigns Storage Policies
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

-- Hero Storage Policies
CREATE POLICY "Public Access for hero"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero');

CREATE POLICY "Authenticated Upload for hero"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hero' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update for hero"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hero' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete for hero"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hero' AND auth.role() = 'authenticated');

-- Statement Storage Policies
CREATE POLICY "Public Access for statement"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'statement');

CREATE POLICY "Authenticated Upload for statement"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'statement' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update for statement"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'statement' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete for statement"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'statement' AND auth.role() = 'authenticated');

-- Categories Storage Policies
CREATE POLICY "Public Access for categories"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'categories');

CREATE POLICY "Authenticated Upload for categories"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update for categories"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete for categories"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- ====================================
-- FUNCTIONS & TRIGGERS (Timestamp Update)
-- ====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- DONE! 
-- ====================================
-- Şimdi bu SQL'i Supabase SQL Editor'de çalıştırabilirsiniz.
-- Tüm tablolar, storage buckets ve policies oluşturulacak.
