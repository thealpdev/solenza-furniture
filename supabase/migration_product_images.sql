-- Migration: Update product_images table for multi-image support
-- Run this in your Supabase SQL Editor

-- If product_images table doesn't exist, create it
CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index if not exists
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Enable RLS if not enabled
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read product_images" ON product_images;
DROP POLICY IF EXISTS "public can read product images" ON product_images;
DROP POLICY IF EXISTS "Admin manage product_images" ON product_images;
DROP POLICY IF EXISTS "dashboard can insert product images" ON product_images;

-- Create policies - allow public read and anyone can insert (for dashboard with anon key)
CREATE POLICY "public can read product images"
  ON public.product_images
  FOR SELECT
  USING (true);

CREATE POLICY "dashboard can insert product images"
  ON public.product_images
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "dashboard can delete product images"
  ON public.product_images
  FOR DELETE
  USING (true);

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

-- Storage policies for product-images bucket - allow public access
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
