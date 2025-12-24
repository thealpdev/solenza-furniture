-- ============================================
-- SUPABASE SQL - KOPYALA YAPIŞTIR
-- Bu kodu Supabase Dashboard > SQL Editor'e yapıştırıp çalıştırın
-- ============================================

-- 1. Kategoriler için DELETE politikası ekle
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" 
ON categories 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 2. Ürünler için DELETE politikası ekle
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" 
ON products 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. Storage'dan görsel silme izni (Ürün görselleri)
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- ✅ YUKARIDAKİ KODLARI ÇALIŞTIRDIKTAN SONRA "Hepsini Sil" BUTONU ÇALIŞACAK!





