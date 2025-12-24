-- Ürünlere yeni özellikler ekleme migration

-- Products tablosuna yeni kolonlar ekle
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS colors TEXT[], -- Birden fazla renk için
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'pre_order')),
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dimensions TEXT, -- Örn: "200x150x80 cm"
ADD COLUMN IF NOT EXISTS material TEXT, -- Örn: "Ahşap, Kumaş"
ADD COLUMN IF NOT EXISTS weight DECIMAL(10, 2), -- kg cinsinden
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2), -- İndirimli fiyat göstermek için
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE, -- Stok kodu
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS warranty_months INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT false;

-- Index'ler ekle
CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_bestseller ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_show_on_homepage ON products(show_on_homepage);

-- Yorum: Bu migration'ı Supabase SQL Editor'de çalıştırın
