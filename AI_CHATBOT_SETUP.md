# AI Chatbot Setup Guide

## Free AI Chatbot Options

The website supports two free AI chatbot services that can read your website content and auto-reply to customer queries.

### Option 1: Tawk.to (Recommended - Free Forever)

**Features:**
- ✅ Free forever
- ✅ AI-powered auto-replies
- ✅ Can read website content
- ✅ Mobile app available
- ✅ Multi-language support

**Setup Steps:**
1. Sign up at https://www.tawk.to (free)
2. Create a new property for your website
3. Copy your Property ID (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_TAWK_TO_PROPERTY_ID=your_property_id_here
   ```
5. Add to Vercel environment variables:
   - Variable: `NEXT_PUBLIC_TAWK_TO_PROPERTY_ID`
   - Value: Your Tawk.to Property ID

**Configure AI Auto-Reply:**
1. Log into Tawk.to dashboard
2. Go to Settings → Chat Widget → AI Assistant
3. Enable "AI Assistant"
4. Train it with your website content or let it crawl your site
5. Set up auto-replies for common questions

### Option 2: Crisp (Free Tier)

**Features:**
- ✅ Free tier available
- ✅ AI chatbot with auto-replies
- ✅ Website content integration
- ✅ Mobile app

**Setup Steps:**
1. Sign up at https://crisp.chat
2. Create a website
3. Copy your Website ID
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CRISP_WEBSITE_ID=your_website_id_here
   ```
5. Add to Vercel environment variables:
   - Variable: `NEXT_PUBLIC_CRISP_WEBSITE_ID`
   - Value: Your Crisp Website ID

**Note:** If both Tawk.to and Crisp IDs are provided, Tawk.to will be used first.

## Testing

1. Visit your website
2. Look for the chat widget in the bottom-right corner
3. Send a test message
4. Verify the AI responds (if configured)

## Redirecting to Form

Both chatbots can be configured to:
- Answer common questions automatically
- Redirect users to the contact form for complex inquiries
- Collect user information before connecting to a human agent

Configure these behaviors in your chatbot dashboard settings.
