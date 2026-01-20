# HubSpot Free Tier Integration Guide

This guide specifically covers using HubSpot's **Free Tier** for lead capture.

## What's Included in HubSpot Free Tier

✅ **1,000,000 Contacts** - More than enough for most businesses
✅ **Basic CRM** - Contact management, deals, tasks
✅ **API Access** - 100 requests per 10 seconds
✅ **Email Integration** - Send emails from HubSpot
✅ **Notes & Tasks** - Unlimited notes and tasks
✅ **Basic Reporting** - Contact and deal reports

## What's NOT Included (But We Don't Need)

❌ Custom Properties (we use standard ones)
❌ Advanced Automation (basic automation is enough)
❌ Advanced Reporting (basic reports work fine)
❌ Marketing Hub features (not needed for lead capture)

## Our Integration Uses Only Free Tier Features

The integration is specifically designed for free tier:

1. **Standard Contact Properties:**
   - `email` - Contact email
   - `firstname` - First name
   - `lastname` - Last name
   - `company` - Company name
   - `lifecyclestage` - Set to "lead"

2. **Notes:**
   - Creates notes with project type, region, and message
   - All stored in standard note format

3. **Contact Management:**
   - Creates new contacts
   - Updates existing contacts (if email already exists)
   - No custom properties needed

## Setup Checklist

- [ ] Sign up for HubSpot free account
- [ ] Create private app
- [ ] Grant required scopes (contacts read/write, notes write)
- [ ] Copy access token to `.env.local`
- [ ] Get portal ID (optional)
- [ ] Test with a form submission
- [ ] Verify contact appears in HubSpot

## API Rate Limits

**Free Tier:** 100 requests per 10 seconds

**For Lead Capture:**
- Each form submission = 2-3 API calls (create contact + note)
- You can handle ~30-50 leads per 10 seconds
- More than enough for most websites

**If You Hit Rate Limits:**
- The integration will fail gracefully
- Leads are still logged in console
- You can retry later or upgrade to paid tier

## Upgrading from Free Tier

If you need more features later:

1. **Starter Plan ($20/month):**
   - 1,000 marketing contacts
   - Email marketing
   - More automation

2. **Professional Plan ($800/month):**
   - Custom properties
   - Advanced automation
   - Advanced reporting

**Note:** For basic lead capture, free tier is perfect!

## Best Practices for Free Tier

1. **Monitor API Usage:**
   - Check HubSpot → Settings → API Usage
   - Stay under 100 requests per 10 seconds

2. **Clean Up Contacts:**
   - Regularly remove test contacts
   - Archive old leads

3. **Use Lifecycle Stages:**
   - Mark contacts as "Lead" when created
   - Update to "Customer" when they convert

4. **Leverage Notes:**
   - Store all lead information in notes
   - Easy to search and reference

## Troubleshooting Free Tier Issues

**"Insufficient permissions"**
- Check that private app has correct scopes
- Free tier supports all scopes we need

**"Rate limit exceeded"**
- Wait 10 seconds and try again
- Consider batching requests if needed

**"Contact not found"**
- Check that contact was created
- Search by email in HubSpot

## Support Resources

- [HubSpot Free Tier Documentation](https://knowledge.hubspot.com/get-started-with-hubspot)
- [HubSpot API Documentation](https://developers.hubspot.com/docs/api/overview)
- [HubSpot Community](https://community.hubspot.com/)

## Next Steps After Setup

1. Set up email templates in HubSpot
2. Create basic workflows (e.g., send welcome email)
3. Set up deal pipeline (optional)
4. Configure email integration
5. Train team on HubSpot basics

Remember: Free tier is powerful enough for lead capture and basic CRM needs!
