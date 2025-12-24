-- Solenza Furniture Store Database Schema

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category translations
CREATE TABLE category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(category_id, lang)
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  show_price BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product translations
CREATE TABLE product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  specs TEXT,
  UNIQUE(product_id, lang)
);

-- Product images
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  show_on_homepage BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign translations
CREATE TABLE campaign_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(campaign_id, lang)
);

-- Settings table (for company info, contact, etc.)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('company_name', 'Solenza'),
  ('phone', '+90 XXX XXX XX XX'),
  ('whatsapp', '+90 XXX XXX XX XX'),
  ('email', 'info@solenza.com'),
  ('address_tr', 'Adres bilgisi'),
  ('address_en', 'Address information'),
  ('about_tr', 'Solenza hakkında'),
  ('about_en', 'About Solenza'),
  ('facebook', ''),
  ('instagram', ''),
  ('twitter', '');

-- Create storage buckets for images (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('campaigns', 'campaigns', true);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read category_translations" ON category_translations FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_translations" ON product_translations FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public read campaign_translations" ON campaign_translations FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage category_translations" ON category_translations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage product_translations" ON product_translations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage campaigns" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage campaign_translations" ON campaign_translations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for better performance
CREATE INDEX idx_category_translations_category_id ON category_translations(category_id);
CREATE INDEX idx_category_translations_lang ON category_translations(lang);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX idx_product_translations_lang ON product_translations(lang);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_campaign_translations_campaign_id ON campaign_translations(campaign_id);
CREATE INDEX idx_campaign_translations_lang ON campaign_translations(lang);
