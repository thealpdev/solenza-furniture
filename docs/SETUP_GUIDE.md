# Solenza Setup Guide

Complete step-by-step guide to get your Solenza furniture store running.

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project at https://uavmsqjbbsqesuwpepjk.supabase.co

## Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install all required packages including Next.js, React, Supabase client, and Tailwind CSS.

## Step 2: Configure Supabase Connection

### Get Your Anon Key

1. Go to https://supabase.com/dashboard/project/uavmsqjbbsqesuwpepjk
2. Click on **Settings** (gear icon in sidebar)
3. Click on **API**
4. Find the **Project API keys** section
5. Copy the `anon` `public` key (it's a long string starting with `eyJ...`)

### Update .env.local

1. Open the `.env.local` file in the project root
2. Replace `PASTE_MY_SUPABASE_ANON_KEY_HERE` with your actual anon key
3. Save the file

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=https://uavmsqjbbsqesuwpepjk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

## Step 3: Setup Database

### Run Schema

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open `supabase/schema.sql` from this project
5. Copy ALL the content
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

You should see "Success. No rows returned" - this is correct!

### Run Seed Data

1. Still in SQL Editor, click **New query** again
2. Open `supabase/seed.sql` from this project
3. Copy ALL the content
4. Paste it into the SQL Editor
5. Click **Run**

You should see success messages. This creates sample data (1 category, 1 product, 1 campaign).

## Step 4: Create Storage Buckets

### Create Categories Bucket

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `categories`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

### Create Products Bucket

1. Click **New bucket** again
2. Name: `products`
3. Toggle **Public bucket** to ON
4. Click **Create bucket**

### Create Campaigns Bucket

1. Click **New bucket** again
2. Name: `campaigns`
3. Toggle **Public bucket** to ON
4. Click **Create bucket**

## Step 5: Create Admin User

1. Go to **Authentication** in the left sidebar
2. Click **Users** tab
3. Click **Add user** → **Create new user**
4. Enter:
   - Email: `admin@solenza.com`
   - Password: `Admin123!` (or your preferred secure password)
5. Click **Create user**

**Important:** Remember this email and password - you'll need it to login to the admin panel!

## Step 6: Run the Development Server

In your terminal, run:

```bash
npm run dev
```

You should see:
```
- Local:        http://localhost:3000
- Ready in X.Xs
```

## Step 7: Test the Website

### Test Public Site

1. Open http://localhost:3000 in your browser
2. You should see the Solenza homepage with:
   - A campaign banner
   - Categories section (Living Room)
   - Featured products (Modern Sofa Set)
3. Try switching language (TR/EN buttons in header)
4. Click on categories and products to explore

### Test Admin Panel

1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@solenza.com`
   - Password: `Admin123!` (or what you set)
3. You should see the admin dashboard
4. Try navigating to Categories, Products, Campaigns, Settings

## Step 8: Add Your Own Content

### Add a New Category

1. In admin panel, go to **Categories**
2. Click **Add Category**
3. Fill in:
   - Slug: `bedroom` (URL-friendly name)
   - Name (TR): `Yatak Odası`
   - Name (EN): `Bedroom`
   - Description (TR): `Rahat ve şık yatak odası mobilyaları`
   - Description (EN): `Comfortable and stylish bedroom furniture`
   - Upload an image
4. Click **Save Category**

### Add a New Product

1. Go to **Products**
2. Click **Add Product**
3. Fill in all fields in both Turkish and English
4. Select a category
5. Set price (or uncheck "Show price" to hide it)
6. Upload multiple images
7. Click **Save Product**

### Add a Campaign

1. Go to **Campaigns**
2. Click **Add Campaign**
3. Fill in Turkish and English titles and descriptions
4. Set start and end dates
5. Check "Show on homepage" if you want it on the main page
6. Upload a banner image
7. Click **Save Campaign**

### Update Settings

1. Go to **Settings**
2. Update:
   - Company information
   - Phone and WhatsApp numbers
   - Email address
   - Addresses in both languages
   - About text in both languages
   - Social media links
3. Click **Save Settings**

## Troubleshooting

### "Supabase env vars are missing" Error

- Make sure `.env.local` exists in the project root
- Verify you replaced `PASTE_MY_SUPABASE_ANON_KEY_HERE` with your actual key
- Restart the dev server (`npm run dev`)

### Can't Login to Admin

- Verify you created the admin user in Supabase Authentication
- Check email and password are correct
- Try resetting the password in Supabase Dashboard

### Images Not Uploading

- Verify all 3 storage buckets are created: `categories`, `products`, `campaigns`
- Make sure buckets are set to **Public**
- Check browser console for error messages

### No Data Showing

- Verify you ran both `schema.sql` and `seed.sql`
- Check the SQL Editor for any error messages
- Go to Table Editor in Supabase and verify tables exist

### Port 3000 Already in Use

Run on a different port:
```bash
npm run dev -- -p 3001
```

Then visit http://localhost:3001

## Next Steps

1. Replace sample images with your actual product photos
2. Add more categories and products
3. Update company information in Settings
4. Customize colors in `tailwind.config.js` if needed
5. Deploy to Vercel when ready

## Need Help?

- Check the main README.md for more details
- Review Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs

Enjoy building your furniture store! 🛋️
