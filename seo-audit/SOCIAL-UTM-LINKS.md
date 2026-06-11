# Facebook & social links with UTM tracking

Use these when posting on Facebook, LinkedIn, or email. GA4 will attribute sessions correctly.

## Priority pages (copy & paste)

| Page | Facebook share URL |
|------|-------------------|
| Homepage | https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.arfadevelopers.com%2F%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dhomepage |
| Project Rescue | https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.arfadevelopers.com%2Fproject-rescue%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dproject_rescue |
| Web Dev USA | https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.arfadevelopers.com%2Fweb-development-agency-usa%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dweb_dev_usa |
| Free Audit | https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.arfadevelopers.com%2Ffree-audit%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dfree_audit |
| Blog: Project Rescue | https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.arfadevelopers.com%2Fblog%2F4%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dblog_rescue |
| Blog: Next.js | https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.arfadevelopers.com%2Fblog%2F5%3Futm_source%3Dfacebook%26utm_medium%3Dsocial%26utm_campaign%3Dblog_nextjs |

## Direct landing URLs (for ads / posts)

```
https://www.arfadevelopers.com/project-rescue?utm_source=facebook&utm_medium=social&utm_campaign=project_rescue
https://www.arfadevelopers.com/web-development-agency-usa?utm_source=facebook&utm_medium=social&utm_campaign=web_dev_usa
https://www.arfadevelopers.com/free-audit?utm_source=facebook&utm_medium=social&utm_campaign=free_audit
```

## In the codebase

- `lib/utm.ts` — `withUtm()`, `facebookShareUrl()`
- `components/SocialShare.tsx` — on blog posts
- Footer — “Share” buttons with UTM-tagged Facebook links
