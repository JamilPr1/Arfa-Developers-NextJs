# CRM Integration Setup Guide (HubSpot Free Tier)

This guide explains how to configure the CRM integration for lead capture using **HubSpot's Free Tier**.

## Current Implementation

The lead submission API (`/app/api/leads/route.ts`) now includes:

✅ **HubSpot CRM Integration (Free Tier)** - Automatically creates/updates contacts and notes
✅ **Slack Notifications** - Sends formatted notifications to your Slack channel
✅ **Email Notifications** - Sends email alerts to sales team
✅ **Region-Based Lead Assignment** - Assigns leads to appropriate sales managers

## HubSpot Free Tier Features Used

- ✅ Contact creation and updates
- ✅ Basic contact properties (email, name, company)
- ✅ Notes creation
- ✅ Lifecycle stage management
- ✅ Contact search by email

**Note:** This integration uses only standard HubSpot properties and features available in the free tier.

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# HubSpot CRM (Free Tier)
HUBSPOT_API_KEY=your_hubspot_private_app_access_token
HUBSPOT_PORTAL_ID=your_hubspot_portal_id (optional, for direct links)

# Slack Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Email Notifications (SendGrid - Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_TO=sales@arfadevelopers.com
EMAIL_FROM=noreply@arfadevelopers.com

# Sales Manager Assignments (Optional - defaults provided)
SALES_MANAGER_US=sales-us@arfadevelopers.com
SALES_MANAGER_UK=sales-uk@arfadevelopers.com
SALES_MANAGER_QATAR=sales-qatar@arfadevelopers.com
SALES_MANAGER_KSA=sales-ksa@arfadevelopers.com
```

**Minimum Required:** Only `HUBSPOT_API_KEY` is required. All other integrations are optional.

## Setup Instructions

### 1. HubSpot Integration (Free Tier)

#### Step 1: Sign Up for HubSpot Free Account

1. Go to [HubSpot](https://www.hubspot.com) and sign up for a **free account**
2. Complete the setup wizard
3. You'll have access to:
   - Up to 1,000,000 contacts
   - Basic CRM features
   - API access (100 requests per 10 seconds)

#### Step 2: Create a Private App in HubSpot

1. Log in to [HubSpot](https://app.hubspot.com)
2. Go to **Settings** (gear icon in top right)
3. Navigate to **Integrations** → **Private Apps**
4. Click **Create a private app**
5. Name it: "Arfa Developers Website"
6. Go to the **Scopes** tab and grant these **minimum required permissions**:
   - ✅ `crm.objects.contacts.write` - Create and update contacts
   - ✅ `crm.objects.contacts.read` - Read contact information
   - ✅ `crm.objects.notes.write` - Create notes (optional but recommended)
7. Click **Create app**
8. **Important:** Copy the **Access Token** immediately (you won't see it again!)
   - This is your `HUBSPOT_API_KEY`
   - Store it securely in your `.env.local` file

#### Step 3: Get Your Portal ID (Optional)

1. In HubSpot, go to any contact list
2. Look at the URL: `https://app.hubspot.com/contacts/{PORTAL_ID}/contacts/list/view/all/`
3. The number in the URL is your Portal ID
4. Copy this to `HUBSPOT_PORTAL_ID` (optional - only needed for direct links)

#### Step 4: Test the Integration

1. Submit a test lead through your website form
2. Go to HubSpot → **Contacts** → **All contacts**
3. Search for the test email address
4. Verify:
   - ✅ Contact was created with name and email
   - ✅ Company name is included
   - ✅ Lifecycle stage is set to "Lead"
   - ✅ A note was created with the message and project details

#### Free Tier Limitations

- ⚠️ **API Rate Limit:** 100 requests per 10 seconds (plenty for lead capture)
- ⚠️ **No Custom Properties:** We use only standard properties (email, name, company)
- ⚠️ **Basic Automation:** Limited automation features (but enough for lead capture)
- ✅ **Unlimited Contacts:** Up to 1,000,000 contacts
- ✅ **Notes:** Can create unlimited notes
- ✅ **Email Integration:** Can send emails from HubSpot (free tier)

**Note:** The integration is optimized for free tier and uses only standard properties, so no custom property setup is needed!

### 2. Slack Integration

#### Step 1: Create a Slack Webhook

1. Go to [Slack API](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Name it: "Arfa Developers Lead Notifications"
4. Select your workspace
5. Go to **Incoming Webhooks** → **Activate Incoming Webhooks**
6. Click **Add New Webhook to Workspace**
7. Select the channel (e.g., #sales-leads)
8. Copy the **Webhook URL** to `SLACK_WEBHOOK_URL`

#### Step 2: Test the Integration

1. Submit a test lead
2. Check your Slack channel for the notification

### 3. Email Integration (SendGrid)

#### Step 1: Create SendGrid Account

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your email address
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Name it: "Arfa Developers Website"
6. Select **Full Access** or **Restricted Access** (with Mail Send permission)
7. Copy the API key to `SENDGRID_API_KEY`

#### Step 2: Verify Sender

1. Go to **Settings** → **Sender Authentication**
2. Verify a single sender or domain
3. Use the verified email in `EMAIL_FROM`

#### Step 3: Test the Integration

1. Submit a test lead
2. Check the email inbox for the notification

### 4. Region-Based Lead Assignment

The system automatically assigns leads based on region:

- **US** → `SALES_MANAGER_US` (default: sales-us@arfadevelopers.com)
- **UK** → `SALES_MANAGER_UK` (default: sales-uk@arfadevelopers.com)
- **Qatar** → `SALES_MANAGER_QATAR` (default: sales-qatar@arfadevelopers.com)
- **KSA** → `SALES_MANAGER_KSA` (default: sales-ksa@arfadevelopers.com)

You can override these defaults by setting the environment variables.

## Testing the Integration

1. **Test Form Submission:**
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "company": "Test Company",
       "projectType": "Web Application",
       "message": "This is a test message",
       "source": "website-form",
       "region": "US"
     }'
   ```

2. **Check HubSpot:** Verify contact was created
3. **Check Slack:** Verify notification was sent
4. **Check Email:** Verify email was received

## Troubleshooting

### HubSpot Errors

**Error: "Invalid API Key"**
- Verify your `HUBSPOT_API_KEY` is correct
- Check that the private app has the correct scopes
- Make sure you copied the full access token (it's long!)

**Error: "Rate limit exceeded"**
- Free tier allows 100 requests per 10 seconds
- If you're getting many leads quickly, this might happen
- The integration will retry, but you may need to wait
- Consider upgrading if you expect high volume

**Error: "Contact already exists"**
- This is handled automatically - the integration will update existing contacts
- No action needed

**Error: "Property not found"**
- The integration uses only standard properties
- If you see this error, it's likely a HubSpot API issue
- Check HubSpot status page

### Slack Errors

**No notifications received:**
- Verify `SLACK_WEBHOOK_URL` is correct
- Check that the webhook is active in Slack
- Check browser console for errors

### Email Errors

**No emails received:**
- Verify `SENDGRID_API_KEY` is correct
- Check SendGrid activity log
- Verify sender email is authenticated

## Optional: Alternative CRM Integration

### Pipedrive Integration

If you prefer Pipedrive over HubSpot, you can modify `app/api/leads/route.ts`:

```typescript
async function createPipedriveDeal(data: LeadData) {
  const response = await fetch('https://api.pipedrive.com/v1/persons?api_token=' + process.env.PIPEDRIVE_API_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      org_name: data.company,
    }),
  })
  // ... rest of implementation
}
```

## Security Notes

- ⚠️ Never commit `.env.local` to version control
- ⚠️ Keep API keys secure and rotate them regularly
- ⚠️ Use environment variables for all sensitive data
- ⚠️ Consider using a secrets management service for production

## Next Steps

1. Set up all environment variables
2. Test each integration individually
3. Monitor lead submissions in HubSpot
4. Set up automated follow-up workflows in HubSpot
5. Configure email templates for lead responses
