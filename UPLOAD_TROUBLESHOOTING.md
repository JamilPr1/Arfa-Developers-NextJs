# Image Upload Troubleshooting Guide

## Error: "File upload requires Supabase Storage"

This error occurs when the upload route cannot access Supabase Storage. Follow these steps to fix it:

## Step 1: Verify Environment Variables

### In Vercel:
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Ensure these are set for **Production**, **Preview**, and **Development**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://romerjhgmbuydyiccxfo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **Important**: `SUPABASE_SERVICE_ROLE_KEY` is required for file uploads!

### Locally:
Check your `.env.local` file has all three variables set.

## Step 2: Create Storage Bucket

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New bucket**
3. Name: `talent-images` (exact name, case-sensitive)
4. **Make it Public** (uncheck "Private bucket")
5. Click **Create bucket**

## Step 3: Set Storage Policies

Run this SQL in Supabase **SQL Editor**:

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'talent-images');

-- Allow service role to upload/manage files
CREATE POLICY "Service role can manage" ON storage.objects
FOR ALL
USING (bucket_id = 'talent-images');
```

Or use the simpler approach:
- Go to **Storage** → **talent-images** bucket → **Policies**
- Make sure the bucket is set to **Public**

## Step 4: Test the Connection

1. Visit: `https://your-site.vercel.app/api/test-supabase`
2. Check the response:
   - ✅ `env.serviceKey` should show "✅ Set"
   - ✅ `storage.talentImagesBucket` should show "✅ Exists"
   - ✅ `connection.status` should show "✅ Connected"

## Step 5: Check Server Logs

If upload still fails, check Vercel logs for:
- `❌ Supabase upload error:` - Shows the specific error
- `⚠️ Supabase not configured for upload:` - Shows which env vars are missing

## Common Issues

### Issue 1: "Bucket not found"
**Solution**: Create the `talent-images` bucket in Supabase Dashboard → Storage

### Issue 2: "Permission denied" or "Policy violation"
**Solution**: 
- Ensure bucket is **Public**
- Run the SQL policies above
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly

### Issue 3: "Supabase client is null"
**Solution**: 
- Check all environment variables are set in Vercel
- Redeploy after setting environment variables
- Verify keys are correct (no extra spaces, quotes, etc.)

### Issue 4: Works locally but not on Vercel
**Solution**:
- Environment variables must be set in Vercel Dashboard (not just `.env.local`)
- Set them for **Production**, **Preview**, AND **Development**
- Redeploy after setting variables

## Quick Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel (⚠️ **Critical for uploads**)
- [ ] `talent-images` bucket exists in Supabase Storage
- [ ] Bucket is set to **Public**
- [ ] Storage policies are configured
- [ ] Redeployed after setting environment variables

## Still Not Working?

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → **Functions** tab
   - Click on a failed upload request
   - Check the logs for detailed error messages

2. **Test Supabase Connection**:
   - Visit `/api/test-supabase` endpoint
   - Review the JSON response for specific issues

3. **Verify Service Role Key**:
   - Go to Supabase Dashboard → **Settings** → **API**
   - Copy the `service_role` key (not the `anon` key)
   - Ensure it's set as `SUPABASE_SERVICE_ROLE_KEY` in Vercel

4. **Contact Support**:
   - If all above steps are correct, check Supabase status page
   - Review Supabase project logs for any service issues
