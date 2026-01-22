# Vercel KV Setup Guide

## Why Vercel KV?

Vercel's serverless environment has a **read-only file system**, which means we cannot write to files like `lib/data/*.json`. To enable persistent storage for the admin panel (projects, blogs, promotions), we need to use **Vercel KV** (Redis).

## Setup Steps

### 1. Create KV Database in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Upstash KV** (Redis)
5. Choose a name (e.g., "arfa-developers-kv")
6. Select a region close to your users
7. Click **Create**

### 2. Link KV to Your Project

1. In the KV database page, click **Link** next to your project name
2. Vercel will automatically add the environment variables to your project

### 3. Environment Variables

Vercel automatically adds these variables:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN` (optional)

These are automatically available in your Next.js app - no need to add them manually!

### 4. Verify Setup

After linking, your admin panel will automatically use KV for storage. The system will:
- ✅ Use KV in production (Vercel)
- ✅ Use file system in local development
- ✅ Fall back to memory store if neither is available (with warning)

## Testing

1. Deploy to Vercel
2. Go to `/admin` and try creating/editing a promotion
3. Check Vercel logs to confirm KV is being used
4. Data should now persist across deployments!

## Current Status

- ✅ Code updated to use Vercel KV
- ✅ Fallback to file system for local dev
- ✅ Fallback to memory store with warnings
- ⚠️ **Action Required**: Create and link KV database in Vercel dashboard

## Troubleshooting

### Error: "KV module not available"
- Make sure `@vercel/kv` is installed: `npm install @vercel/kv`
- Check that environment variables are set in Vercel

### Error: "Using memory store"
- This means KV is not configured
- Data will work but won't persist across deployments
- Follow setup steps above to enable KV

### Data not persisting
- Verify KV database is linked to your project
- Check Vercel environment variables are set
- Check Vercel logs for KV connection errors
