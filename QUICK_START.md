# Quick Start Guide - HubSpot Integration

## ✅ HubSpot API Key Setup

You need to get your HubSpot API keys:

1. **Personal Access Key:** Get this from HubSpot Settings → Private Apps
2. **Active API Key:** Get this from HubSpot Settings → Private Apps → Your App

**Recommended:** Use the **Active API Key** for API integration

## Step 1: Create .env.local File

Create a file named `.env.local` in your project root (same directory as `package.json`):

```env
# HubSpot CRM
HUBSPOT_API_KEY=your_hubspot_api_key_here
```

## Step 2: Get Your Portal ID (Optional)

1. Log in to [HubSpot](https://app.hubspot.com)
2. Go to any contact list
3. Look at the URL: `https://app.hubspot.com/contacts/{PORTAL_ID}/contacts/...`
4. Copy the number and add to `.env.local`:

```env
HUBSPOT_PORTAL_ID=your_portal_id_here
```

## Step 3: Test the Integration

1. **Restart your development server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **Submit a test lead** through your website form

3. **Check HubSpot:**
   - Go to HubSpot → Contacts → All contacts
   - Search for the test email
   - Verify the contact was created
   - Check the notes tab for the message

## Step 4: Verify It's Working

Check your server console/logs. You should see:
```
Lead submitted: { name: '...', email: '...', ... }
```

If you see `hubspotSuccess: true`, the integration is working! ✅

## Troubleshooting

### "HubSpot API key not configured"
- Make sure `.env.local` exists in the project root
- Make sure the file contains `HUBSPOT_API_KEY=your_api_key_here`
- Restart your development server after creating/updating `.env.local`

### "Invalid API Key"
- Verify the API key is correct in your `.env.local` file
- Check that there are no extra spaces or quotes
- Make sure you're using the Active API key, not the Personal Access Key
- Get a new API key from HubSpot Settings → Private Apps if needed

### Contact Not Appearing in HubSpot
- Check server console for errors
- Verify the API key has correct permissions:
  - `crm.objects.contacts.write`
  - `crm.objects.contacts.read`
  - `crm.objects.notes.write`

## Security Reminder

⚠️ **IMPORTANT:** 
- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Keep your API keys secure
- Don't share API keys publicly

## Next Steps

Once HubSpot is working, you can optionally add:

1. **Slack Notifications** - Get instant alerts
2. **Email Notifications** - Email alerts to your team
3. **Live Chat** - Add Tidio, Drift, or Intercom

See `CRM_INTEGRATION_SETUP.md` for detailed instructions.

## Need Help?

- Check `HUBSPOT_FREE_TIER_GUIDE.md` for free tier specifics
- Check `CRM_INTEGRATION_SETUP.md` for full setup guide
- Check server console logs for error messages
