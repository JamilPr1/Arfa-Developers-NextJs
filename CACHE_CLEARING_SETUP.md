# Automatic Cache Clearing Setup

## Overview
The application now automatically clears all caches on every deployment, ensuring changes are visible immediately on the live site.

## How It Works

### 1. Automatic Cache Clearing on Deployment
- **Script**: `scripts/clear-cache-on-deploy.js`
- **Trigger**: Runs automatically after every build via `postbuild` hook
- **What it does**: 
  - Revalidates all important pages (/, /admin, /services, /portfolio, /blog, /about, /contact)
  - Clears cache by tag 'all' for comprehensive clearing
  - Runs automatically on Vercel deployments

### 2. Manual Cache Clearing
You can also manually clear cache anytime:

```bash
# Clear all caches
npm run clear-cache

# Or use the revalidate script
npm run revalidate
npm run revalidate:all
```

### 3. API Route Configuration
- **Route**: `/api/revalidate`
- **Method**: GET or POST
- **Security**: Uses `REVALIDATE_SECRET` environment variable (optional)

## Configuration

### Environment Variables (Optional)
Add to Vercel Dashboard → Settings → Environment Variables:
- `REVALIDATE_SECRET`: A secret token for secure cache clearing

### Vercel Configuration
The `vercel.json` file is configured with:
- Cache control headers for promotions API routes
- Build command that uses `build:vercel` (without cache clearing in build step)
- Post-build hook that automatically clears cache

## Promotions Banner Immediate Loading

### Fixes Applied:
1. **Force Dynamic Rendering**: Promotions API route uses `force-dynamic` to prevent caching
2. **Timeout Protection**: 5-second timeout to prevent hanging
3. **Immediate Fetch**: Fetches on mount without delays
4. **Error Handling**: Prevents infinite loading states
5. **Cache Headers**: Multiple cache control headers to prevent any caching

### API Routes:
- `/api/promotions` - Force dynamic, no caching
- `/api/admin/promotions` - Force dynamic, no caching

## Admin Panel Immediate Refresh

### Fixes Applied:
1. **Immediate Data Refresh**: All CRUD operations use `await loadData()` for instant refresh
2. **Cache Busting**: Timestamp query parameters on all admin API calls
3. **No Delays**: Removed all `setTimeout` delays
4. **Sorted Data**: Newest items appear first

## Testing

### Test Cache Clearing:
1. Make a change in admin panel
2. Deploy to Vercel
3. Cache should clear automatically
4. Changes visible immediately on live site

### Test Promotions Banner:
1. Create/update a promotion in admin
2. Visit homepage
3. Banner should appear immediately (no 2-minute delay)

## Troubleshooting

### Cache not clearing?
- Check Vercel build logs for cache clearing script output
- Verify `REVALIDATE_SECRET` is set if using security
- Manually run: `npm run clear-cache`

### Promotions not loading immediately?
- Check browser console for errors
- Verify API route has `force-dynamic` export
- Check network tab - should see immediate request to `/api/promotions`

### Admin panel not refreshing?
- Check browser console for errors
- Verify all operations use `await loadData()`
- Check network tab for API calls with timestamp query params
