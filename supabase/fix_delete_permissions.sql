-- Supabase Silme İzinleri Düzeltme Scripti
-- Bu scripti Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. Kategoriler için DELETE politikası
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" 
ON categories 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 2. Ürünler için DELETE politikası  
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" 
ON products 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. Storage için DELETE politikası (Ürün görselleri)
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Mevcut politikaları kontrol et (opsiyonel)
-- Aşağıdaki query'yi çalıştırarak mevcut politikaları görebilirsiniz:
-- SELECT tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND (tablename = 'categories' OR tablename = 'products');

-- 5. ID tipini kontrol et (opsiyonel)
-- Kategori ID tipi:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'categories' AND column_name = 'id';

-- Ürün ID tipi:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'id';





