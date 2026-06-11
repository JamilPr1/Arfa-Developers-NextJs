# Google Search Console API — Fix “Missing service account JSON”

If `/api/admin/gsc` or the admin **Search Console** tab shows:

```json
{
  "error": "Missing service account JSON. Set GSC_SERVICE_ACCOUNT_JSON ...",
  "hint": "Ensure service account JSON env var is set and the service account email is added as an owner/user to your Search Console property."
}
```

the app code is fine — **Vercel (and local `.env.local`) are missing credentials**. Follow these steps once.

---

## Step 1 — Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g. `arfa-developers`).
3. **APIs & Services → Library** → enable **Google Search Console API**.

---

## Step 2 — Service account

1. **IAM & Admin → Service Accounts → Create service account**
   - Name: `gsc-readonly` (any name)
2. **Keys → Add key → Create new key → JSON** → download the `.json` file.
3. Copy the **`client_email`** from that file (looks like `gsc-readonly@project-id.iam.gserviceaccount.com`).

---

## Step 3 — Add service account to Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select property **`https://www.arfadevelopers.com`** (URL-prefix property).
3. **Settings → Users and permissions → Add user**
4. Paste the **service account `client_email`**
5. Permission: **Full** or **Restricted** with at least **View data** (readonly API needs view access).

> If your property is **Domain** (`arfadevelopers.com`), set `GSC_SITE_URL` to `sc-domain:arfadevelopers.com` instead of the https URL.

---

## Step 4 — Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**:

| Variable | Value |
|----------|--------|
| `GSC_SERVICE_ACCOUNT_JSON` | Entire contents of the downloaded JSON file (one line), **or** base64-encoded JSON |
| `GSC_SITE_URL` | `https://www.arfadevelopers.com/` (must match GSC property exactly) |

Apply to **Production** (and Preview if you test there). **Redeploy** after saving.

### JSON format tips

- Paste minified JSON: `{"type":"service_account","project_id":"...",...}`
- Or in Vercel, paste the file; escaped newlines in `private_key` are supported (`\n`).
- Do **not** commit the JSON file to Git.

---

## Step 5 — Local development (optional)

1. Copy `.env.example` → `.env.local`
2. Set `GSC_SERVICE_ACCOUNT_JSON` to the JSON string (or base64).
3. Restart `npm run dev`.
4. Test: `http://localhost:3000/api/admin/gsc?days=28`

---

## Step 6 — Verify

1. **Production:** `https://www.arfadevelopers.com/api/admin/gsc?days=28`  
   Should return JSON with `totals`, `topQueries`, `topPages` (not an error).
2. **Admin UI:** `/admin` → **Search Console** tab → charts and tables load.

---

## Common errors after env is set

| Error | Fix |
|-------|-----|
| `User does not have sufficient permission` | Add service account email in GSC with view access |
| `Site not found` | `GSC_SITE_URL` must match property URL exactly (www vs non-www, trailing slash) |
| `Invalid service account JSON` | Re-paste full JSON; ensure `client_email` and `private_key` exist |
| Still missing locally | Create `.env.local`; restart dev server |

---

## Security note

`/api/admin/gsc` is currently **not** behind admin session auth. Credentials live only on the server; still avoid sharing the API URL publicly. Consider restricting by admin cookie in a future update.
