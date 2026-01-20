# Form Submission Flow - Website to HubSpot

## Complete Flow Diagram

```
User fills form (CTA.tsx)
    ↓
Form submits → submitLead() (lib/formHandler.ts)
    ↓
POST request to /api/leads
    ↓
API Route Handler (app/api/leads/route.ts)
    ↓
createHubSpotContact() function
    ↓
HubSpot API Call (using HUBSPOT_API_KEY)
    ↓
Contact created in HubSpot CRM
```

## Step-by-Step Flow

### Step 1: User Submits Form
**File:** `components/CTA.tsx`
- User fills out the contact form
- Clicks "Submit" button
- `handleSubmit()` function is called

### Step 2: Form Handler
**File:** `lib/formHandler.ts`
- `submitLead()` function is called
- Sends POST request to `/api/leads`
- Includes form data: name, email, company, projectType, message
- Adds metadata: source='website-form', region (auto-detected)

### Step 3: API Route
**File:** `app/api/leads/route.ts`
- Receives POST request at `/api/leads`
- Validates required fields (name, email, message)
- Calls `createHubSpotContact(data)`

### Step 4: HubSpot Integration
**File:** `app/api/leads/route.ts` (lines 16-153)
- Checks for `process.env.HUBSPOT_API_KEY`
- Splits name into firstname/lastname
- Creates contact properties:
  - email
  - firstname
  - lastname
  - company
  - lifecyclestage: 'lead'
- Makes API call to: `https://api.hubapi.com/crm/v3/objects/contacts`
- If contact exists (409 error), updates existing contact
- Creates a note with form message and project details

### Step 5: Response
- Returns success/failure status
- Logs submission details
- Sends notifications (Slack/Email if configured)

## Current Configuration

### Environment Variables Required
- `HUBSPOT_API_KEY` - Must be set in Vercel
- `HUBSPOT_PORTAL_ID` - Optional, for direct links

### API Endpoint
- **URL:** `/api/leads`
- **Method:** POST
- **Content-Type:** application/json

### Expected Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "projectType": "Web Application",
  "message": "I need a custom web app",
  "source": "website-form",
  "region": "US"
}
```

## Where to Find Submissions in HubSpot

1. **Go to HubSpot:**
   - URL: https://app.hubspot.com/contacts/244926471/contacts/list/view/all/
   - Or: HubSpot → Contacts → All contacts

2. **Filter by Lifecycle Stage:**
   - Click "Filters"
   - Select "Lifecycle stage" → "Lead"
   - This shows all new website leads

3. **View Contact Details:**
   - Click on any contact
   - **Notes tab:** Contains the form message
   - **Activity tab:** Shows when contact was created
   - **Properties:** Name, email, company, etc.

## Troubleshooting

### No Contacts Appearing?

1. **Check Vercel Environment Variables:**
   - Go to Vercel → Project → Settings → Environment Variables
   - Verify `HUBSPOT_API_KEY` is set
   - Make sure it's a valid Private App access token (starts with `pat-`)

2. **Check Vercel Function Logs:**
   - Go to Vercel → Project → Deployments
   - Click on latest deployment
   - Go to "Functions" tab
   - Look for `/api/leads` function
   - Check for error messages

3. **Test the API:**
   ```bash
   curl -X POST https://your-site.vercel.app/api/leads \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "message": "Test submission"
     }'
   ```

4. **Check Browser Console:**
   - Open DevTools (F12) → Network tab
   - Submit the form
   - Look for `/api/leads` request
   - Check response status and body

### Common Issues

**401 Authentication Error:**
- API key is incorrect or expired
- Need to create a Private App in HubSpot
- Get new access token and update Vercel

**404 Not Found:**
- API route not deployed
- Check if `/api/leads` exists in deployment

**500 Server Error:**
- Check Vercel function logs
- Verify environment variables are set
- Check HubSpot API permissions

## Verification Checklist

- [ ] `HUBSPOT_API_KEY` is set in Vercel environment variables
- [ ] API key is a valid Private App access token (starts with `pat-`)
- [ ] Private App has correct scopes:
  - `crm.objects.contacts.read`
  - `crm.objects.contacts.write`
  - `crm.objects.notes.write`
- [ ] Form is calling `/api/leads` endpoint
- [ ] API route is deployed and accessible
- [ ] HubSpot contacts are being created (check HubSpot dashboard)

## Testing the Flow

1. **Submit a test form** on your website
2. **Check browser console** for any errors
3. **Check Vercel logs** for API execution
4. **Check HubSpot** → Contacts → All contacts
5. **Verify contact was created** with correct data
6. **Check Notes tab** for the form message
