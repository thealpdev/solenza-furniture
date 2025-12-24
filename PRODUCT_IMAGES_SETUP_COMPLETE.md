# Product Images Setup - Complete Guide

## ✅ What Has Been Fixed

### 1. SQL Policies (Run in Supabase SQL Editor)
File: `supabase/migration_product_images.sql`

Run this SQL to set up the database table and storage policies:
- Creates `product_images` table with proper structure
- Sets up RLS policies for public read and dashboard insert/delete
- Creates `product-images` storage bucket
- Sets up storage policies for public access

### 2. Admin Panel (`src/app/admin/products/page.tsx`)
**Fixed:**
- ✅ Image upload now saves to `product_images` table with full public URL
- ✅ Existing images are fetched and displayed as thumbnails
- ✅ Delete button on each image (removes from both storage and database)
- ✅ Upload progress indicator
- ✅ Preview of selected files before upload
- ✅ All labels in Turkish

**How it works:**
1. User selects images → stored in local state
2. On submit → uploads to `product-images/{productId}/{timestamp}-{index}.ext`
3. Gets public URL from Supabase Storage
4. Inserts row into `product_images` table with `{ product_id, image_url }`
5. Displays existing images when editing a product

### 3. Homepage (`src/app/page.tsx`)
**Fixed:**
- ✅ Products query now includes `product_images(*)`
- ✅ Product cards show first image or placeholder
- ✅ Images use Next.js Image component with proper sizing
- ✅ Hover effects on images

### 4. Product Detail Page (`src/app/products/[id]/page.tsx`)
**Fixed:**
- ✅ Loads product with all images
- ✅ Main image display (first image)
- ✅ Thumbnail gallery below (if multiple images)
- ✅ Click thumbnails to switch main image
- ✅ Fallback to "Görsel Yok" if no images

### 5. Category Page (`src/app/categories/[slug]/page.tsx`)
**Fixed:**
- ✅ Products query includes images
- ✅ Product cards show first image

### 6. Image Utilities (`src/lib/imageUtils.ts`)
**Helper functions:**
- `getFirstProductImage(product)` - Returns first image URL or null
- `getAllProductImages(product)` - Returns array of all image URLs

## 🚀 Setup Steps

### Step 1: Run SQL Migration
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migration_product_images.sql`
4. Click "Run"

### Step 2: Verify Storage Bucket
1. Go to Storage in Supabase Dashboard
2. Verify `product-images` bucket exists and is public
3. If not, create it manually:
   - Name: `product-images`
   - Public: Yes
   - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
   - Max file size: 5MB

### Step 3: Test the Flow
1. Go to Admin Panel → Products
2. Create or edit a product
3. Select multiple images
4. Click "Ürünü Kaydet"
5. Verify images appear in "Mevcut Görseller"
6. Go to homepage and verify product card shows the image
7. Click product to see detail page with image gallery

## 📝 Database Schema

```sql
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Security Policies

**Database (product_images table):**
- Public can SELECT (read)
- Anyone can INSERT (for dashboard with anon key)
- Anyone can DELETE (for dashboard)

**Storage (product-images bucket):**
- Public can SELECT (read)
- Anyone can INSERT (upload)
- Anyone can DELETE (remove)

## 🎨 Image Display

**Homepage Cards:**
- First image from `product_images` array
- Falls back to placeholder SVG if no images
- Uses Next.js Image with `object-cover`

**Product Detail:**
- Main image (large, 500px height)
- Thumbnail strip (4 columns grid)
- Click thumbnail to switch main image
- Border highlight on selected thumbnail

**Admin Panel:**
- Thumbnails of existing images (24x24, rounded)
- Hover to show delete button
- Preview of newly selected files

## 🐛 Troubleshooting

**Images not uploading:**
1. Check browser console for errors
2. Verify storage bucket exists and is public
3. Check RLS policies are applied
4. Verify `NEXT_PUBLIC_SUPABASE_URL` is set in `.env.local`

**Images not displaying:**
1. Check if `image_url` in database contains full URL
2. Verify Next.js config allows Supabase domain
3. Check browser network tab for 403/404 errors
4. Verify storage bucket is public

**Delete not working:**
1. Check RLS policies allow DELETE
2. Verify storage policies allow DELETE
3. Check browser console for errors

## ✨ Features

- ✅ Multi-image upload per product
- ✅ Image preview before upload
- ✅ Delete individual images
- ✅ Automatic cleanup on product delete (CASCADE)
- ✅ Public URL generation
- ✅ Responsive image display
- ✅ Image gallery with thumbnails
- ✅ Turkish labels throughout
- ✅ Loading states
- ✅ Error handling with toast notifications

## 📦 Next.js Image Configuration

Already configured in `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
    },
  ],
}
```

This allows Next.js to optimize images from Supabase Storage.
