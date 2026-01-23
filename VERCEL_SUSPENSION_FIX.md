# Fix "Resource has been suspended" Error on Vercel

## Problem
Vercel deployment fails with:
- "Provisioning integrations failed"
- "Resource has been suspended" (e.g., `arfa-devel`, `supabase-pink-kite`)

## Root Cause
Vercel is trying to auto-provision Supabase, but a previous integration/resource has been suspended, blocking the deployment.

## Solution Steps

### Step 1: Remove Suspended Integrations
1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Integrations**
3. Look for any integrations showing:
   - Red warning icon
   - "Resource has been suspended" tooltip
   - Supabase-related entries
4. **Click the "X" or "Remove" button** for each suspended integration
5. Confirm removal

### Step 2: Remove Supabase Integration (If Present)
1. In **Settings** → **Integrations**
2. If you see "Supabase" listed, **remove it**
3. We're using environment variables, not Vercel's integration

### Step 3: Set Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add these for **Production**, **Preview**, and **Development**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://romerjhgmbuydyiccxfo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yvMRfWsa7RIPJkkmcDZ3UA_XmNO25-l
   SUPABASE_SERVICE_ROLE_KEY=<get-this-from-supabase-dashboard-settings-api>
   ```
   **Note**: Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard → Settings → API → service_role key
3. Click **Save**

### Step 4: Check Project Status
1. Go to **Settings** → **General**
2. Check for any suspension notices or warnings
3. If your project is suspended, contact Vercel Support

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger auto-deploy

## Alternative: Disable Auto-Provisioning

If Vercel keeps trying to auto-provision:

1. Go to **Settings** → **General**
2. Look for "Integration Auto-Provisioning" setting
3. **Disable it** if available
4. This prevents Vercel from automatically detecting and provisioning Supabase

## Verify Fix

After completing the steps:
1. Check the deployment status - should show "Building" then "Ready"
2. Build logs should complete without "Provisioning integrations failed"
3. No "Resource has been suspended" errors

## Still Not Working?

1. **Contact Vercel Support**:
   - Go to https://vercel.com/support
   - Explain the suspension issue
   - Provide your project name and deployment URL

2. **Check Account Status**:
   - Go to Vercel Dashboard → **Settings** (account level)
   - Check billing, usage limits, and account status

3. **Temporary Workaround**:
   - Create a new Vercel project
   - Link it to the same GitHub repository
   - Deploy from the new project
   - This bypasses any suspended resources in the old project

## Prevention

To prevent this in the future:
- Use environment variables instead of Vercel integrations
- Don't rely on Vercel's auto-provisioning
- Keep integrations clean - remove unused ones
- Monitor your Vercel account status regularly
