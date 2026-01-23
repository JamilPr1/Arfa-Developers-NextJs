# New Supabase Project Setup

## Your New Supabase Project Details

- **Project URL**: `https://romerjhgmbuydyiccxfo.supabase.co`
- **Anon Key (Publishable)**: `sb_publishable_yvMRfWsa7RIPJkkmcDZ3UA_XmNO25-l`

## Step 1: Get Your Service Role Key

**IMPORTANT**: You need the Service Role Key for server-side operations (image uploads, admin operations).

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/romerjhgmbuydyiccxfo
2. Click **Settings** (gear icon) in the left sidebar
3. Click **API** in the settings menu
4. Scroll down to **Project API keys**
5. Find **`service_role`** key (⚠️ **Keep this secret!** Never expose it in client-side code)
6. Copy the service role key - it will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 2: Set Up Database Tables

1. Go to **SQL Editor** in your Supabase Dashboard
2. Run these SQL commands to create the required tables:

```sql
-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  image TEXT NOT NULL,
  url TEXT NOT NULL,
  tech TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  "fullDescription" TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  date DATE NOT NULL,
  "readTime" TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  link TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Talent Table
CREATE TABLE IF NOT EXISTS talent (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  "hourlyRate" NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  "projectsCompleted" INTEGER DEFAULT 0,
  description TEXT,
  experience TEXT,
  location TEXT,
  published BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 3: Set Up Storage Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **New bucket**
3. Name: `talent-images`
4. **Make it Public** (uncheck "Private bucket")
5. Click **Create bucket**

### Set Storage Policies (Optional - if bucket needs specific permissions)

Run this SQL in the SQL Editor:

```sql
-- Allow public read access to talent-images bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'talent-images');

-- Allow service role to manage files
CREATE POLICY "Service role can manage" ON storage.objects
FOR ALL
USING (bucket_id = 'talent-images');
```

## Step 4: Set Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL=https://romerjhgmbuydyiccxfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yvMRfWsa7RIPJkkmcDZ3UA_XmNO25-l
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-step-1>
```

3. Click **Save** for each environment (Production, Preview, Development)

## Step 5: Set Environment Variables Locally

Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://romerjhgmbuydyiccxfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yvMRfWsa7RIPJkkmcDZ3UA_XmNO25-l
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-step-1>
```

## Step 6: Test the Setup

1. **Test Database Connection**:
   - Start your dev server: `npm run dev`
   - Go to `/admin` page
   - Try creating a project, blog, or talent profile
   - Check Supabase Dashboard → **Table Editor** to verify data is saved

2. **Test Image Upload**:
   - Go to `/admin` → Talent tab
   - Try uploading an image for a talent profile
   - Check Supabase Dashboard → **Storage** → `talent-images` bucket
   - Verify the image appears on `/hire-talent` page

## Troubleshooting

### "Invalid API key" error
- Verify you copied the correct keys from Supabase Dashboard
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` uses the `anon` or `publishable` key
- Make sure `SUPABASE_SERVICE_ROLE_KEY` uses the `service_role` key (not the anon key)

### Images not uploading
- Check that `talent-images` bucket exists and is public
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check Supabase Storage logs for errors

### Data not saving
- Verify database tables exist (run the SQL commands above)
- Check Supabase logs for errors
- Ensure environment variables are set correctly

## Next Steps

After setup is complete:
1. Remove any suspended Supabase integrations from Vercel
2. Redeploy your project on Vercel
3. Test all functionality on the live site
