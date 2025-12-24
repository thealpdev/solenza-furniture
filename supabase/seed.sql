-- Seed data for Solenza Furniture Store
-- Run this after running schema.sql

-- Insert sample category
INSERT INTO categories (id, slug, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'living-room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800');

INSERT INTO category_translations (category_id, lang, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'tr', 'Oturma Odası', 'Modern ve şık oturma odası mobilyaları'),
('550e8400-e29b-41d4-a716-446655440001', 'en', 'Living Room', 'Modern and elegant living room furniture');

-- Insert sample product
INSERT INTO products (id, category_id, price, show_price, status) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 15999.00, true, 'active');

INSERT INTO product_translations (product_id, lang, title, description, specs) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'tr', 'Modern Koltuk Takımı', 
 'Şık ve konforlu modern koltuk takımı. Yüksek kaliteli kumaş kaplama ve sağlam ahşap iskelet.',
 'Boyutlar: 220x90x85 cm
Malzeme: Ahşap iskelet, kumaş kaplama
Renk: Gri
Garanti: 2 yıl'),
('550e8400-e29b-41d4-a716-446655440002', 'en', 'Modern Sofa Set',
 'Stylish and comfortable modern sofa set. High-quality fabric upholstery and solid wooden frame.',
 'Dimensions: 220x90x85 cm
Material: Wooden frame, fabric upholstery
Color: Gray
Warranty: 2 years');

INSERT INTO product_images (product_id, image_url, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 0),
('550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 1),
('550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800', 2);

-- Insert sample campaign
INSERT INTO campaigns (id, image_url, start_date, end_date, show_on_homepage) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200', '2024-01-01', '2025-12-31', true);

INSERT INTO campaign_translations (campaign_id, lang, title, description) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'tr', 'Yeni Sezon Koleksiyonu', 
 'Yeni sezon mobilyalarında %30''a varan indirimler! Evinizi yenileyin, konforunuzu artırın.'),
('550e8400-e29b-41d4-a716-446655440003', 'en', 'New Season Collection',
 'Up to 30% off on new season furniture! Refresh your home, increase your comfort.');

-- Update settings with sample data
UPDATE settings SET value = 'Solenza' WHERE key = 'company_name';
UPDATE settings SET value = '+90 212 555 0000' WHERE key = 'phone';
UPDATE settings SET value = '+90 532 555 0000' WHERE key = 'whatsapp';
UPDATE settings SET value = 'info@solenza.com' WHERE key = 'email';
UPDATE settings SET value = 'İstanbul, Türkiye - Örnek Mahalle, Mobilya Caddesi No: 123' WHERE key = 'address_tr';
UPDATE settings SET value = 'Istanbul, Turkey - Sample District, Furniture Street No: 123' WHERE key = 'address_en';
UPDATE settings SET value = 'Solenza, modern ve kaliteli mobilya çözümleri sunan öncü bir markadır. 2020 yılından beri müşterilerimize en iyi hizmeti sunmak için çalışıyoruz. Ürünlerimiz, konfor ve estetiği bir araya getirerek evinize değer katıyor.' WHERE key = 'about_tr';
UPDATE settings SET value = 'Solenza is a leading brand offering modern and quality furniture solutions. Since 2020, we have been working to provide the best service to our customers. Our products add value to your home by combining comfort and aesthetics.' WHERE key = 'about_en';
UPDATE settings SET value = 'https://facebook.com/solenza' WHERE key = 'facebook';
UPDATE settings SET value = 'https://instagram.com/solenza' WHERE key = 'instagram';
