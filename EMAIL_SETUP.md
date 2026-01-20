# Email Setup Guide

## Form Submissions → jawadparvez.dev@gmail.com

The contact form now sends emails directly to **jawadparvez.dev@gmail.com**.

## Email Service Options

### Option 1: Resend (Recommended - Free Tier Available)
1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Add to Vercel environment variables:
   - `RESEND_API_KEY=re_xxxxxxxxxxxxx`
   - `EMAIL_FROM=noreply@yourdomain.com` (must be verified domain)

### Option 2: SendGrid (Free Tier Available)
1. Sign up at https://sendgrid.com
2. Get your API key from Settings → API Keys
3. Add to Vercel environment variables:
   - `SENDGRID_API_KEY=SG.xxxxxxxxxxxxx`
   - `EMAIL_FROM=noreply@yourdomain.com` (must be verified sender)

### Option 3: Development Mode
If no email service is configured, the form will still work but emails will only be logged to the console. This is useful for local development.

## Testing

1. Submit a test form on your website
2. Check your email inbox (jawadparvez.dev@gmail.com)
3. Check Vercel logs if email doesn't arrive

## Email Content

The email includes:
- Name
- Email
- Company
- Project Type
- Region
- Message
