# Solenza Furniture Store

Modern, bilingual furniture e-commerce website with admin panel built with Next.js 14, Supabase, and TypeScript.

## Features

### Public Website
- 🌍 Bilingual support (Turkish & English)
- 📱 Fully responsive design
- 🏠 Homepage with hero banner, categories, and featured products
- 📂 Category browsing
- 🛋️ Product detail pages with image gallery
- 🎉 Campaigns page
- 📞 Contact and About pages
- 🎨 Modern, furniture-focused design with warm colors

### Admin Panel
- 🔐 Secure authentication with Supabase Auth
- 📊 Dashboard with statistics
- 🗂️ Category management (bilingual)
- 🛍️ Product management (bilingual, multiple images)
- 🎯 Campaign management (bilingual)
- ⚙️ Settings management (company info, contact, social media)
- 🖼️ Image upload to Supabase Storage

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI Components**: React Hot Toast for notifications

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already created with your Supabase URL. You need to:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/uavmsqjbbsqesuwpepjk
2. Navigate to Settings → API
3. Copy the `anon` `public` key
4. Open `.env.local` and replace `PASTE_MY_SUPABASE_ANON_KEY_HERE` with your actual key

### 3. Setup Supabase Database

1. Go to SQL Editor in your Supabase Dashboard
2. Run the schema: Copy and paste contents of `supabase/schema.sql` and execute
3. Run the seed data: Copy and paste contents of `supabase/seed.sql` and execute

### 4. Create Storage Buckets

In Supabase Dashboard → Storage:

1. Create bucket → Name: `categories` → Public: ✓
2. Create bucket → Name: `products` → Public: ✓
3. Create bucket → Name: `campaigns` → Public: ✓

### 5. Create Admin User

In Supabase Dashboard → Authentication → Users → Add user:
- Email: admin@solenza.com
- Password: Admin123! (or your preferred password)

### 6. Run Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin/login

Login with the admin credentials you created in step 5.

## Project Structure

```
solenza-furniture/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── admin/             # Admin panel pages
│   │   ├── categories/        # Category pages
│   │   ├── products/          # Product pages
│   │   ├── campaigns/         # Campaigns page
│   │   └── ...
│   ├── components/            # Reusable components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── contexts/              # React contexts
│   │   └── LanguageContext.tsx
│   ├── lib/                   # Utilities
│   │   └── supabase.ts
│   └── types/                 # TypeScript types
│       └── index.ts
├── supabase/
│   └── schema.sql             # Database schema
└── public/                    # Static assets
```

## Database Schema

The database uses a translation pattern for multilingual content:

- `categories` + `category_translations`
- `products` + `product_translations` + `product_images`
- `campaigns` + `campaign_translations`
- `settings` (key-value pairs)

## Usage Guide

### Adding Content (Admin)

1. **Categories**: Admin → Categories → Add Category
   - Enter Turkish and English names/descriptions
   - Upload category image
   - Set URL slug

2. **Products**: Admin → Products → Add Product
   - Select category
   - Enter Turkish and English details
   - Set price (optional: hide price)
   - Upload multiple images
   - Set status (active/inactive)

3. **Campaigns**: Admin → Campaigns → Add Campaign
   - Enter Turkish and English titles/descriptions
   - Set start and end dates
   - Upload campaign image
   - Toggle "Show on homepage"

4. **Settings**: Admin → Settings
   - Update company information
   - Set contact details (phone, WhatsApp, email)
   - Add addresses in both languages
   - Update about text
   - Add social media links

## Sample Data

After running the seed script, you'll have:
- 1 category: "Living Room" (Oturma Odası)
- 1 product: "Modern Sofa Set" with 3 images
- 1 campaign: "New Season Collection" (shown on homepage)
- Complete settings with contact info and about text

## Admin Panel Features

### Categories Management
- Add/Edit/Delete categories
- Upload category images
- Manage Turkish and English translations
- Set URL-friendly slugs

### Products Management
- Add/Edit/Delete products
- Assign to categories
- Upload multiple product images
- Set prices or hide prices
- Manage Turkish and English content (title, description, specs)
- Toggle active/inactive status

### Campaigns Management
- Add/Edit/Delete campaigns
- Upload campaign banners
- Set start and end dates
- Toggle homepage visibility
- Manage Turkish and English content

### Settings Management
- Company information
- Contact details (phone, WhatsApp, email)
- Addresses in both languages
- About text in both languages
- Social media links

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Production Checklist

- [ ] Update admin user credentials
- [ ] Configure custom domain
- [ ] Add real product images
- [ ] Update company information in settings
- [ ] Test all forms and uploads
- [ ] Configure SEO metadata
- [ ] Add Google Analytics (optional)

## Troubleshooting

**Images not uploading?**
- Check that storage buckets are created and set to public
- Verify bucket names match: `categories`, `products`, `campaigns`

**Can't login to admin?**
- Verify admin user is created in Supabase Authentication
- Check that email and password are correct

**Data not showing?**
- Verify schema.sql and seed.sql were executed successfully
- Check browser console for errors
- Verify RLS policies are enabled

## License

MIT
