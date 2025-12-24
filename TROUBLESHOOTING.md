# Troubleshooting Guide

## Error: `makeProductImageUrl is not a function`

This error occurs because the browser or Next.js dev server is using cached code from before the recent changes.

### Solution:

**Option 1: Clear Next.js Cache (Recommended)**
```bash
# Stop the dev server (Ctrl+C)

# Windows CMD:
rmdir /s /q .next

# Windows PowerShell:
Remove-Item -Recurse -Force .next

# Then restart:
npm run dev
```

**Option 2: Hard Refresh Browser**
- Chrome/Edge: `Ctrl + Shift + R` or `Ctrl + F5`
- Firefox: `Ctrl + Shift + R`

**Option 3: Clear Browser Cache**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## Other Common Issues

### Images Not Uploading
**Symptoms:** Upload button doesn't work, no error messages

**Solutions:**
1. Check browser console for errors (F12)
2. Verify `.env.local` has correct Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL migration in Supabase SQL Editor
4. Verify storage bucket `product-images` exists and is public

### Images Not Displaying
**Symptoms:** Placeholder shows instead of uploaded images

**Solutions:**
1. Check if images were actually saved to database:
   - Go to Supabase Dashboard → Table Editor → `product_images`
   - Verify rows exist with `image_url` values
2. Check if storage bucket is public:
   - Go to Storage → `product-images` → Settings
   - Ensure "Public bucket" is enabled
3. Verify Next.js image configuration in `next.config.js`:
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

### RLS Policy Errors
**Symptoms:** "new row violates row-level security policy"

**Solutions:**
1. Run the complete SQL migration: `supabase/migration_product_images.sql`
2. Verify policies exist:
   ```sql
   -- Check table policies
   SELECT * FROM pg_policies WHERE tablename = 'product_images';
   
   -- Check storage policies
   SELECT * FROM storage.policies WHERE bucket_id = 'product-images';
   ```
3. If policies are missing, re-run the migration

### Images Upload But Don't Show in Admin
**Symptoms:** Upload succeeds but "Mevcut Görseller" section is empty

**Solutions:**
1. Check browser console for errors
2. Verify the `loadProductImages` function is being called
3. Check if `product_images` table has the correct foreign key:
   ```sql
   SELECT * FROM product_images WHERE product_id = 'your-product-id';
   ```

### Delete Button Not Working
**Symptoms:** Click delete but image remains

**Solutions:**
1. Check browser console for errors
2. Verify DELETE policy exists on `product_images` table
3. Verify storage DELETE policy exists on `product-images` bucket
4. Check if the image URL format is correct (should contain `/product-images/`)

## Development Server Issues

### Port Already in Use
```bash
# Windows CMD:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P
# Type: "TypeScript: Restart TS Server"
```

## Database Issues

### Check if Table Exists
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'product_images'
);
```

### Check if Storage Bucket Exists
```sql
SELECT * FROM storage.buckets WHERE id = 'product-images';
```

### Manually Create Storage Bucket
If the bucket doesn't exist:
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `product-images`
4. Public: Yes
5. File size limit: 5MB
6. Allowed MIME types: `image/jpeg,image/png,image/webp,image/gif`

## Still Having Issues?

1. Check all environment variables are set correctly
2. Verify Supabase project is active and accessible
3. Check browser network tab for failed requests
4. Look for errors in browser console
5. Check Next.js terminal output for server errors
6. Try creating a new product from scratch with images
7. Verify your Supabase project has enough storage quota

## Quick Health Check

Run these checks to verify everything is set up correctly:

1. ✅ `.env.local` has Supabase credentials
2. ✅ SQL migration has been run
3. ✅ `product-images` bucket exists and is public
4. ✅ `product_images` table exists
5. ✅ RLS policies are applied
6. ✅ Next.js dev server is running
7. ✅ Browser cache is cleared
8. ✅ `.next` folder has been deleted and regenerated
