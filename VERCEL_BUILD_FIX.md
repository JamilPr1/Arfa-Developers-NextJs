# Fix "Provisioning integrations failed" Error

## The Problem

Vercel is trying to automatically provision Supabase as an integration during the build, but since we're using Supabase via environment variables (not as a Vercel integration), this fails.

## Solution

### Option 1: Ensure Environment Variables Are Set (Recommended)

1. Go to your Vercel Dashboard
2. Navigate to your project → **Settings** → **Environment Variables**
3. Make sure these variables are set for **Production**, **Preview**, and **Development**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Redeploy** your project after setting the variables

### Option 2: Disable Auto-Provisioning (If Option 1 Doesn't Work)

If Vercel keeps trying to auto-provision, you can explicitly disable it:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Integrations**
2. If you see Supabase listed, **remove it** (we're using env vars, not the integration)
3. Redeploy

### Option 3: Use Vercel's Supabase Integration (Alternative)

If you prefer to use Vercel's native Supabase integration:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Integrations**
2. Click **Browse Integrations**
3. Find **Supabase** and click **Add Integration**
4. Connect your Supabase project
5. Vercel will automatically set the environment variables
6. Redeploy

## Verify Environment Variables

After setting variables, verify they're correct:

- `NEXT_PUBLIC_SUPABASE_URL` should be: `https://nqosbgchdojiipndblqv.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `SUPABASE_SERVICE_ROLE_KEY` should start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## After Fixing

1. **Redeploy** your project
2. The build should complete successfully
3. Check the build logs to confirm Supabase is working (or falling back gracefully)

## Why This Happens

Vercel's build system detects Supabase-related code and tries to automatically provision it as an integration. Since we're using environment variables directly (which is perfectly valid), we need to either:
- Set the env vars properly (so provisioning succeeds)
- Or disable auto-provisioning (if we don't want Vercel to manage it)
