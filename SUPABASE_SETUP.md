# Supabase Setup Guide

This project uses Supabase for database storage and image storage.

## Prerequisites

1. Supabase account (https://supabase.com)
2. Environment variables configured (already provided)

## Database Tables Setup

Run these SQL commands in your Supabase SQL Editor to create the required tables:

### 1. Projects Table
```sql
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
```

### 2. Blogs Table
```sql
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
```

### 3. Promotions Table
```sql
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  link TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Talent Table
```sql
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

## Storage Bucket Setup

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name: `talent-images`
5. Make it **Public** (uncheck "Private bucket")
6. Click **Create bucket**

### 2. Set Storage Policies

Run this SQL in the SQL Editor to allow public read access:

```sql
-- Allow public read access to talent-images bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'talent-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'talent-images' AND
  auth.role() = 'authenticated'
);

-- Allow service role to manage files
CREATE POLICY "Service role can manage" ON storage.objects
FOR ALL
USING (bucket_id = 'talent-images');
```

Or use the simpler approach - make the bucket public in the dashboard settings.

## Environment Variables

Make sure these are set in your `.env.local` and Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

## Migration from Redis/Filesystem

The system will automatically:
1. Try Supabase first
2. Fall back to Redis if Supabase is not available
3. Fall back to filesystem for local development

To migrate existing data:
1. Export data from Redis/filesystem
2. Import into Supabase using the Supabase dashboard or API

## Testing

1. Upload an image in the admin panel
2. Check Supabase Storage → `talent-images` bucket
3. Verify the image appears on the talent page
4. Create/edit a talent profile
5. Verify it saves to Supabase database

## Troubleshooting

### Images not uploading
- Check that the `talent-images` bucket exists and is public
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase Storage logs

### Data not saving
- Verify database tables exist
- Check Supabase logs for errors
- Ensure environment variables are set correctly
