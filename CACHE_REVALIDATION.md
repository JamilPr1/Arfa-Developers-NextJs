# Cache Revalidation Guide

This guide explains how to clear the cache on your live site (arfadevelopers.com) to ensure changes reflect immediately after deployment.

## Quick Revalidation

After deploying to Vercel, run one of these commands to clear the cache:

```bash
# Revalidate the homepage (default)
npm run revalidate

# Revalidate a specific path
node scripts/revalidate-cache.js --path=/about

# Revalidate all cached content
npm run revalidate:all
```

## Setup

### 1. Add Revalidation Secret (Optional but Recommended)

In Vercel, add an environment variable:
- **Key:** `REVALIDATE_SECRET`
- **Value:** A random secure string (e.g., generate with `openssl rand -hex 32`)

This prevents unauthorized cache clearing.

### 2. Update Production URL (if needed)

If your production URL is different, set it in the script:
```bash
export PRODUCTION_URL=https://www.arfadevelopers.com
node scripts/revalidate-cache.js
```

Or edit `scripts/revalidate-cache.js` and change the `PRODUCTION_URL` constant.

## How It Works

1. **API Route:** `/api/revalidate` - Handles cache revalidation
2. **Script:** `scripts/revalidate-cache.js` - Easy command-line tool
3. **Cache Headers:** Configured in `next.config.js` for optimal caching

## Manual Revalidation

You can also call the API directly:

```bash
# Using curl
curl -X POST https://www.arfadevelopers.com/api/revalidate?secret=YOUR_SECRET&path=/

# Using browser
Visit: https://www.arfadevelopers.com/api/revalidate?secret=YOUR_SECRET&path=/
```

## Cache Strategy

- **Pages:** Cached for 60 seconds, stale content served for up to 5 minutes while revalidating
- **Static Assets:** Cached for 1 year (immutable)
- **API Routes:** Not cached (dynamic)

## Troubleshooting

### Changes not reflecting?

1. **Wait a few seconds** - Vercel deployments can take 30-60 seconds to propagate
2. **Run revalidation script** - `npm run revalidate`
3. **Check Vercel deployment** - Ensure the latest commit is deployed to production
4. **Hard refresh browser** - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
5. **Clear browser cache** - Or use incognito/private mode

### Revalidation fails?

- Check that `REVALIDATE_SECRET` matches in both Vercel and your script
- Verify the production URL is correct
- Check Vercel logs for errors

## Automatic Revalidation

You can set up a webhook in Vercel to automatically revalidate after deployment:

1. Go to Vercel Project Settings → Git
2. Add a webhook that calls `/api/revalidate` after successful deployments
3. Or use Vercel's built-in revalidation (if available)

## Best Practices

- Run revalidation after each deployment to production
- Use specific paths when possible (faster than revalidating everything)
- Keep your `REVALIDATE_SECRET` secure and don't commit it to git
- Monitor Vercel logs to ensure revalidation succeeds
