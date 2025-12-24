# Supabase Kurulum Rehberi - Silme İşlemleri

## 🔍 Kontrol Edilmesi Gerekenler

### 1. Row Level Security (RLS) Politikaları

Admin panelden silme işlemleri yapabilmek için aşağıdaki politikaların olması gerekiyor:

**Kategoriler için:**
```sql
-- Eğer yoksa ekleyin
CREATE POLICY "Admin manage categories" 
ON categories 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Silme işlemi için özel politika
CREATE POLICY "Admin delete categories" 
ON categories 
FOR DELETE 
USING (auth.role() = 'authenticated');
```

**Ürünler için:**
```sql
-- Eğer yoksa ekleyin
CREATE POLICY "Admin manage products" 
ON products 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Silme işlemi için özel politika
CREATE POLICY "Admin delete products" 
ON products 
FOR DELETE 
USING (auth.role() = 'authenticated');
```

### 2. Storage Politikaları (Ürün Görselleri için)

Ürün görsellerini storage'dan silmek için:

```sql
-- Storage bucket politikası
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### 3. Cascade Delete Ayarları

Aşağıdaki cascade delete'ler schema'da zaten tanımlı olmalı:

- ✅ `category_translations` → Kategori silinince otomatik silinir
- ✅ `products.category_id` → Kategori silinince NULL olur (ürünler korunur)
- ✅ `product_images` → Ürün silinince otomatik silinir
- ✅ `product_translations` → Ürün silinince otomatik silinir

### 4. ID Tipi Kontrolü

**Önemli:** Veritabanınızda kategori ve ürün ID'lerinin tipini kontrol edin:

```sql
-- Kategori ID tipini kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' AND column_name = 'id';

-- Ürün ID tipini kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'id';
```

**Eğer UUID ise:** Kod doğru çalışmalı
**Eğer bigint/integer ise:** Kodda ID tipini düzeltmemiz gerekebilir

## 🛠️ Yapılması Gerekenler

### Adım 1: Supabase Dashboard'a Giriş Yap
1. https://supabase.com/dashboard
2. Projenizi seçin

### Adım 2: SQL Editor'ü Aç
1. Sol menüden "SQL Editor" seçin
2. "New query" butonuna tıklayın

### Adım 3: Politikaları Kontrol Et
Aşağıdaki SQL'i çalıştırarak mevcut politikaları kontrol edin:

```sql
-- Mevcut politikaları listele
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND (tablename = 'categories' OR tablename = 'products');
```

### Adım 4: Eksik Politikaları Ekleyin

Eğer "Hepsini Sil" işlemi çalışmıyorsa, aşağıdaki SQL'i çalıştırın:

```sql
-- Kategoriler için DELETE politikası
DROP POLICY IF EXISTS "Admin delete categories" ON categories;
CREATE POLICY "Admin delete categories" 
ON categories 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Ürünler için DELETE politikası  
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" 
ON products 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Storage için DELETE politikası
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### Adım 5: Storage Bucket'ı Kontrol Et
1. Sol menüden "Storage" seçin
2. `product-images` bucket'ının var olduğundan emin olun
3. Eğer yoksa oluşturun:
   - Name: `product-images`
   - Public: ✅ (işaretli)
   - File size limit: 5MB
   - Allowed MIME types: image/*

## ⚠️ Önemli Notlar

1. **RLS Aktif Olmalı:** Tüm tablolarda Row Level Security açık olmalı
2. **Authenticated Kullanıcı:** Admin panelde giriş yapmış olmanız gerekiyor
3. **Cascade Delete:** Ürün görselleri otomatik silinir (ON DELETE CASCADE)
4. **Storage Görselleri:** Storage'dan görselleri manuel silmemiz gerekiyor (kodda yapılıyor)

## 🔧 Sorun Giderme

### "Permission denied" hatası alıyorsanız:
- Admin panelde giriş yaptığınızdan emin olun
- RLS politikalarını kontrol edin
- Policy'lerin doğru şekilde oluşturulduğunu doğrulayın

### "Invalid input syntax" hatası:
- ID tipini kontrol edin (UUID vs bigint)
- Kodda doğru tip kullanıldığından emin olun

### Görseller silinmiyor:
- Storage bucket politikalarını kontrol edin
- Storage bucket'ın public olduğundan emin olun

## 📝 Test Etme

1. Admin panelde giriş yapın
2. Bir kategori oluşturun
3. "Hepsini Sil" butonunu test edin
4. Bir ürün oluşturun
5. "Hepsini Sil" butonunu test edin
6. Console'da hata olup olmadığını kontrol edin





