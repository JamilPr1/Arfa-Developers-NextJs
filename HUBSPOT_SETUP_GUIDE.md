# HubSpot API Setup Guide - Fix Authentication

## Issue
Your HubSpot API integration is returning 401 (Authentication failed). This means you need to create a **Private App** in HubSpot and use its access token.

## Step-by-Step Setup

### Step 1: Create a Private App in HubSpot

1. **Log in to HubSpot:**
   - Go to https://app.hubspot.com
   - Log in with your account

2. **Navigate to Private Apps:**
   - Click the **Settings** icon (⚙️) in the top right
   - Go to **Integrations** → **Private Apps**
   - Click **Create a private app**

3. **Configure the App:**
   - **Name:** `Arfa Developers Website`
   - **Description:** `Website lead capture integration`

4. **Set Permissions (Scopes):**
   Click on the **Scopes** tab and enable these permissions:
   - ✅ `crm.objects.contacts.read` - Read contacts
   - ✅ `crm.objects.contacts.write` - Create and update contacts
   - ✅ `crm.objects.notes.write` - Create notes (optional but recommended)

5. **Create the App:**
   - Click **Create app** at the bottom
   - **IMPORTANT:** Copy the **Access Token** immediately (you won't see it again!)
   - This token starts with `pat-` or `pat-na1-` or similar

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - Navigate to your project: https://vercel.com/dashboard
   - Click on your project
   - Go to **Settings** → **Environment Variables**

2. **Update HUBSPOT_API_KEY:**
   - Find `HUBSPOT_API_KEY`
   - Replace the value with your new **Private App Access Token**
   - Make sure it's set for **Production**, **Preview**, and **Development** environments
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**

### Step 3: Verify the Integration

After redeploying, test the form on your website:

1. **Submit a test lead** through your contact form
2. **Check HubSpot:**
   - Go to HubSpot → **Contacts** → **All contacts**
   - Look for the test contact
   - You should see:
     - Name and email
     - Company name
     - Lifecycle stage: "Lead"
     - A note with the message

### Step 4: Where to Find Submissions in HubSpot

**Contacts are created automatically when forms are submitted. Here's where to find them:**

1. **All Contacts:**
   - HubSpot → **Contacts** → **All contacts**
   - URL: `https://app.hubspot.com/contacts/244926471/contacts/list/view/all/`

2. **Filter by Lifecycle Stage:**
   - Click **Filters** → **Lifecycle stage** → **Lead**
   - This shows all new leads from your website

3. **View Contact Details:**
   - Click on any contact
   - Check the **Notes** tab to see the form submission message
   - Check **Activity** tab to see when the contact was created

## Troubleshooting

### Still Getting 401 Errors?

1. **Verify the Access Token:**
   - Make sure you're using the Private App access token (starts with `pat-`)
   - NOT the Personal Access Key (longer string)

2. **Check Permissions:**
   - Go back to Private Apps → Your App → Scopes
   - Ensure all required scopes are enabled

3. **Check Vercel Environment Variables:**
   - Verify `HUBSPOT_API_KEY` is set correctly
   - Make sure there are no extra spaces or quotes
   - Redeploy after making changes

### No Contacts Appearing?

1. **Check Vercel Logs:**
   - Go to Vercel → Your Project → **Deployments** → Click on latest deployment
   - Click **Functions** tab
   - Look for `/api/leads` function logs
   - Check for any error messages

2. **Test the API Directly:**
   - Use the test script: `node test-hubspot.js`
   - Or use Postman/curl to test the API

3. **Check Form Submission:**
   - Open browser DevTools (F12) → Network tab
   - Submit the form
   - Check if `/api/leads` request is successful

## Quick Test

After setting up, you can test locally:

```bash
# Set your API key
export HUBSPOT_API_KEY=your_private_app_token_here

# Run test
node test-hubspot.js
```

## Important Notes

- ✅ **Private App Access Token** = Used for API calls (what you need)
- ❌ **Personal Access Key** = Used for CLI only (not for API)
- ✅ Contacts are created **automatically** - no "project" setup needed
- ✅ All form submissions go to **Contacts** → **All contacts** in HubSpot

## Need Help?

If you're still having issues:
1. Check HubSpot API documentation: https://developers.hubspot.com/docs/api/crm/contacts
2. Verify your Private App has the correct scopes
3. Check Vercel function logs for detailed error messages
