# Solenza Admin Panel - Türkçe Rehber

## ✅ Tamamlanan Özellikler

### 1. **Dashboard (Ana Sayfa)** - `/admin`
- ✅ Türkçe karşılama mesajı: "Hoş Geldiniz, Solenza Admin 👋"
- ✅ İstatistik kartları:
  - 📂 Toplam Kategori
  - 🛋️ Toplam Ürün
  - 🎯 Aktif Kampanya
- ✅ Hızlı Erişim bölümü:
  - Kategorileri Yönet
  - Ürünleri Yönet
  - Kampanyaları Yönet
  - Ayarlar

### 2. **Sol Sidebar (Menü)**
- ✅ Solenza logosu ve "Admin Panel" etiketi
- ✅ Navigasyon menüsü (Türkçe):
  - 📊 Dashboard
  - 🛋️ Ürünler
  - 📂 Kategoriler
  - 🎯 Kampanyalar
  - ⚙️ Ayarlar
- ✅ Alt bölüm:
  - 🌐 Siteyi Gör (ana siteye link)
  - 🚪 Çıkış Yap (logout)

### 3. **Kategoriler Sayfası** - `/admin/categories`
- ✅ Başlık: "Kategoriler"
- ✅ Form alanları (Türkçe):
  - Kategori Adı (TR)
  - Kategori Adı (EN)
  - Slug (opsiyonel)
- ✅ Butonlar:
  - "Yeni Kategori Ekle" / "Kategoriyi Düzenle"
  - "Kaydet" (kırmızı buton)
- ✅ Tablo:
  - Adı (TR)
  - Name (EN)
  - Slug
  - İşlemler: Düzenle, Sil

### 4. **Ürünler Sayfası** - `/admin/products`
- ✅ Ürün yönetimi (ekleme, düzenleme, silme)
- ✅ Çoklu görsel yükleme
- ✅ Kategori seçimi
- ✅ Fiyat yönetimi
- ✅ Durum (Aktif/Pasif)
- ✅ İki dilli içerik (TR/EN)

### 5. **Kampanyalar Sayfası** - `/admin/campaigns`
- ✅ Kampanya oluşturma ve yönetme
- ✅ Tarih aralığı seçimi
- ✅ Ana sayfada gösterim seçeneği
- ✅ Görsel yükleme

### 6. **Ayarlar Sayfası** - `/admin/settings`
- ✅ Şirket bilgileri
- ✅ İletişim detayları (Telefon, WhatsApp, E-posta)
- ✅ Adres (TR/EN)
- ✅ Hakkımızda metni (TR/EN)
- ✅ Sosyal medya linkleri

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Ana Renk**: #b40019 (Solenza kırmızısı)
- **Arka Plan**: #f5f5f5 (açık gri)
- **Kartlar**: Beyaz (#ffffff)
- **Kenarlıklar**: Açık gri (#e5e7eb)

### Stil Detayları
- ✅ Yuvarlatılmış köşeler (rounded-xl, rounded-2xl)
- ✅ Yumuşak gölgeler (shadow-sm, shadow-md)
- ✅ Smooth geçişler (transition-all duration-300)
- ✅ Hover efektleri (scale, shadow, color)
- ✅ Responsive tasarım (mobil uyumlu)

### Layout
- ✅ Sol sidebar (sabit, 256px genişlik)
- ✅ Üst bar (sayfa başlığı ve kullanıcı bilgisi)
- ✅ Ana içerik alanı (kaydırılabilir)
- ✅ Mobil menü (overlay ile açılır)

## 🔐 Güvenlik

- ✅ Supabase Auth ile kimlik doğrulama
- ✅ Korumalı admin rotaları
- ✅ Login sayfası: `/admin/login`
- ✅ Oturum kontrolü
- ✅ Güvenli çıkış yapma

## 📱 Responsive Özellikler

### Desktop (>768px)
- Sol sidebar görünür
- Üst bar ile birlikte çalışır
- Geniş tablo görünümleri

### Mobile (<768px)
- Sidebar overlay olarak açılır
- Hamburger menü butonu
- Tam genişlik formlar
- Dikey stack layout

## 🚀 Kullanım

### Admin Girişi
1. `/admin/login` adresine gidin
2. Email ve şifre ile giriş yapın
3. Dashboard'a yönlendirilirsiniz

### Kategori Ekleme
1. Sol menüden "Kategoriler"e tıklayın
2. "Yeni Kategori Ekle" butonuna basın
3. Türkçe ve İngilizce adları girin
4. Slug otomatik oluşturulur (veya manuel girebilirsiniz)
5. "Kaydet" butonuna basın

### Ürün Ekleme
1. Sol menüden "Ürünler"e tıklayın
2. "Ürün Ekle" butonuna basın
3. Formu doldurun (TR/EN içerik)
4. Görselleri yükleyin
5. Kategori seçin
6. "Kaydet" butonuna basın

### Kampanya Oluşturma
1. Sol menüden "Kampanyalar"a tıklayın
2. "Yeni Kampanya Ekle" butonuna basın
3. Başlık ve açıklama girin (TR/EN)
4. Tarih aralığı seçin
5. Görsel yükleyin
6. "Ana sayfada göster" seçeneğini işaretleyin
7. "Kaydet" butonuna basın

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Bildirimler**: React Hot Toast

### Veritabanı Yapısı
- `categories` - Kategori bilgileri
- `category_translations` - Kategori çevirileri (TR/EN)
- `products` - Ürün bilgileri
- `product_translations` - Ürün çevirileri (TR/EN)
- `product_images` - Ürün görselleri
- `campaigns` - Kampanya bilgileri
- `campaign_translations` - Kampanya çevirileri (TR/EN)
- `settings` - Genel ayarlar

### Dosya Yapısı
```
src/app/admin/
├── layout.tsx          # Admin layout (sidebar + topbar)
├── page.tsx            # Dashboard
├── login/
│   └── page.tsx        # Giriş sayfası
├── categories/
│   └── page.tsx        # Kategori yönetimi
├── products/
│   └── page.tsx        # Ürün yönetimi
├── campaigns/
│   └── page.tsx        # Kampanya yönetimi
└── settings/
    └── page.tsx        # Ayarlar
```

## 📝 Notlar

- Tüm admin paneli Türkçe'dir
- Form etiketleri ve butonlar Türkçe
- Hata mesajları Türkçe
- Başarı bildirimleri Türkçe
- İki dilli içerik desteği (TR/EN)
- Solenza marka renkleri kullanılıyor
- Modern, temiz ve kullanıcı dostu arayüz

## 🎯 Sonraki Adımlar

Sisteminiz tamamen hazır! Şimdi yapabilecekleriniz:

1. ✅ Kategorileri ekleyin
2. ✅ Ürünleri ekleyin ve görselleri yükleyin
3. ✅ Kampanyalar oluşturun
4. ✅ Ayarları güncelleyin
5. ✅ Ana siteyi kontrol edin

Başarılar! 🎉
