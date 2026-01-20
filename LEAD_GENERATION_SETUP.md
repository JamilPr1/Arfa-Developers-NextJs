# Lead Generation Setup Guide

This document outlines the setup process for transforming your landing page into a high-converting lead generation machine.

## Phase 1: Lead Capture & Conversion Optimization ✅

### 1. Forms & Consultation Setup

**Status:** ✅ Implemented

- **Form Component:** Enhanced CTA form with all mandatory fields (Name, Email, Company, Project Type, Message)
- **Form Validation:** All fields are required and validated
- **Calendly Integration:** Calendly widget ready (update URL in `components/CTA.tsx`)
- **Form Handler:** API route created at `/app/api/leads/route.ts`

**Next Steps:**
1. Replace Calendly URL in `components/CTA.tsx` (line ~200):
   ```tsx
   <iframe src="https://calendly.com/your-username/consultation" />
   ```

2. Configure form submission in `app/api/leads/route.ts`:
   - Integrate with HubSpot API
   - Or integrate with Pipedrive
   - Or set up email notifications

3. Set up email notifications:
   - Use SendGrid, Mailgun, or AWS SES
   - Configure in `app/api/leads/route.ts`

### 2. Live Chat / Chatbot

**Status:** ✅ Component Ready

**Setup Instructions:**

1. **Tidio:**
   - Sign up at https://www.tidio.com
   - Get your Tidio ID
   - Uncomment in `app/layout.tsx`:
   ```tsx
   <LiveChat provider="tidio" id="YOUR_TIDIO_ID" />
   ```

2. **Drift:**
   - Sign up at https://www.drift.com
   - Get your Drift embed ID
   - Uncomment in `app/layout.tsx`:
   ```tsx
   <LiveChat provider="drift" id="YOUR_DRIFT_ID" />
   ```

3. **Intercom:**
   - Sign up at https://www.intercom.com
   - Get your Intercom app ID
   - Uncomment in `app/layout.tsx`:
   ```tsx
   <LiveChat provider="intercom" id="YOUR_INTERCOM_ID" />
   ```

### 3. Pop-up CTA / Exit-Intent

**Status:** ✅ Implemented

- Exit-intent popup triggers when:
  - Mouse leaves viewport (exit intent)
  - After 20 seconds on page
- Includes email capture and consultation CTA

**Customization:**
- Adjust timing in `components/ExitIntentPopup.tsx` (line ~20)
- Modify popup copy in `components/ExitIntentPopup.tsx`

## Phase 2: CRM & Lead Automation

### 1. CRM Setup

**HubSpot Integration:**

1. Get HubSpot API key from https://app.hubspot.com
2. Add to `.env.local`:
   ```
   HUBSPOT_API_KEY=your_api_key
   ```
3. Uncomment HubSpot code in `app/api/leads/route.ts`

**Pipedrive Integration:**

1. Get Pipedrive API token
2. Add to `.env.local`:
   ```
   PIPEDRIVE_API_TOKEN=your_token
   ```
3. Implement Pipedrive API calls in `app/api/leads/route.ts`

### 2. Lead Assignment by Region

**Status:** ✅ Region Detection Implemented

- Automatic region detection based on timezone
- Regions: US, UK, Qatar, KSA

**Next Steps:**
- Implement lead assignment logic in `app/api/leads/route.ts`
- Map regions to sales managers
- Add to CRM contact properties

### 3. Automated Follow-Up Workflow

**Email Automation Setup:**

1. **SendGrid / Mailgun:**
   - Set up account
   - Create email templates:
     - Thank you email (immediate)
     - Case study email (1-2 days)
     - Consultation reminder (3-5 days)
   - Configure in your email service

2. **HubSpot Workflows:**
   - Create automated workflows in HubSpot
   - Set up email sequences
   - Configure delays and triggers

### 4. Notifications

**Slack Integration:**

1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Add to `.env.local`:
   ```
   SLACK_WEBHOOK_URL=your_webhook_url
   ```
3. Uncomment Slack code in `app/api/leads/route.ts`

**Email Notifications:**

- Configure in `app/api/leads/route.ts`
- Send to sales@arfadevelopers.com or your team email

## Phase 3: Portfolio & Credibility

### 1. Upwork Portfolio Integration

**Next Steps:**
1. Create `components/UpworkPortfolio.tsx`
2. Embed Upwork projects with ratings
3. Add to Portfolio section

### 2. Case Studies

**Next Steps:**
1. Create case study pages in `app/case-studies/`
2. Link from Portfolio section
3. Include: Problem → Solution → Results

### 3. Testimonials

**Status:** ✅ Testimonials Component Ready

- Update testimonials in `components/Testimonials.tsx`
- Add real client reviews
- Include Upwork ratings if available

## Phase 4: SEO & Content

### 1. SEO Optimization

**Status:** ✅ Basic SEO Implemented

- Meta tags added in `app/layout.tsx`
- Keywords targeting: US, UK, Qatar, KSA
- Open Graph tags
- Twitter cards

**Next Steps:**
1. Update canonical URL in `app/layout.tsx`
2. Add structured data (JSON-LD)
3. Optimize images with alt tags
4. Create sitemap.xml
5. Create robots.txt

### 2. Blog / Resource Section

**Status:** ✅ Blog Component Ready

**Content Strategy:**
- 1-2 posts per week
- Target keywords:
  - "How Startups in the US Can Benefit from Offshore Web Development"
  - "Top 5 Enterprise App Trends in 2026"
  - "Web Development Best Practices for Qatar Businesses"
  - "SaaS Development Guide for Saudi Arabia"

**Next Steps:**
1. Create blog posts in `app/blog/`
2. Add internal links to services and portfolio
3. Optimize for SEO

### 3. Local SEO

**Next Steps:**
1. Create Google Business Profile for US and KSA/Qatar
2. Optimize LinkedIn Business Page
3. Submit to business directories:
   - Clutch
   - GoodFirms
   - UpCity
   - Local business directories

## Phase 5: Analytics & Optimization

### 1. Analytics Setup

**Status:** ✅ Google Analytics 4 Ready

**Setup:**
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Replace in `app/layout.tsx` (line ~62)

**Hotjar Setup:**
1. Sign up at https://www.hotjar.com
2. Get Hotjar ID
3. Replace in `app/layout.tsx` (line ~79)

### 2. Conversion Tracking

**Events Tracked:**
- Form submissions
- Calendly clicks
- Button clicks
- Page views

**Custom Events:**
- Add more events in components as needed
- Track in Google Analytics

### 3. A/B Testing

**Next Steps:**
- Use Google Optimize or VWO
- Test:
  - CTA button colors
  - Hero copy
  - Form placement
  - Popup timing

## Phase 6: Process & Team Readiness

### 1. Sales & Lead Handling

**Response Time:** Target 24 hours

**Email Templates:**
- Create templates in your email service
- Personalize with lead data

**Call Scripts:**
- Prepare consultation call scripts
- Train team on lead qualification

### 2. Project Intake

**Next Steps:**
- Create project intake form
- Define standard project timeline templates
- Set up project management workflow

### 3. Retention & Testimonials

**Post-Project Follow-up:**
- Automated email requesting testimonials
- Offer maintenance packages
- Request case study participation

## Environment Variables

Create `.env.local`:

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=YOUR_HOTJAR_ID

# CRM
HUBSPOT_API_KEY=your_hubspot_key
# OR
PIPEDRIVE_API_TOKEN=your_pipedrive_token

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook
SENDGRID_API_KEY=your_sendgrid_key

# Live Chat
NEXT_PUBLIC_TIDIO_ID=your_tidio_id
# OR
NEXT_PUBLIC_DRIFT_ID=your_drift_id
# OR
NEXT_PUBLIC_INTERCOM_ID=your_intercom_id

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/consultation
```

## Quick Start Checklist

- [ ] Update Calendly URL in CTA component
- [ ] Set up Google Analytics 4
- [ ] Set up Hotjar
- [ ] Configure live chat (Tidio/Drift/Intercom)
- [ ] Set up CRM integration (HubSpot/Pipedrive)
- [ ] Configure email notifications
- [ ] Set up Slack webhook
- [ ] Update form submission handler
- [ ] Test form submission flow
- [ ] Test exit-intent popup
- [ ] Update testimonials with real reviews
- [ ] Create first blog post
- [ ] Set up Google Business Profile
- [ ] Submit to business directories

## Support

For questions or issues, refer to:
- Next.js Documentation: https://nextjs.org/docs
- HubSpot API: https://developers.hubspot.com
- Calendly API: https://developer.calendly.com
