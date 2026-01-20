# Tawk.to Training & Configuration Guide

## How to Change "We Are Here!" Text

The widget text is configured in your Tawk.to dashboard. Here's how to change it:

### Method 1: Dashboard Settings (Recommended)

1. **Log into Tawk.to Dashboard**
   - Go to https://dashboard.tawk.to
   - Sign in with your account

2. **Navigate to Widget Settings**
   - Click on your property/website
   - Go to **Settings** → **Chat Widget** → **Widget Settings**

3. **Change the Welcome Message**
   - Look for **"Welcome Message"** or **"Bubble Text"** field
   - Change from "We Are Here!" to "💬 Need Help?" or your preferred text
   - Click **Save**

4. **Alternative: Customize Widget**
   - Go to **Settings** → **Chat Widget** → **Widget Customization**
   - Find **"Offline Message"** or **"Bubble Text"**
   - Update the text
   - Save changes

### Method 2: Using Tawk.to API (Advanced)

You can also use Tawk.to's JavaScript API to change the text dynamically. The code in `components/AIChatbot.tsx` already attempts this, but the dashboard setting takes priority.

---

## How to Train Tawk.to AI Chatbot

### Step 1: Enable AI Assistant

1. Log into Tawk.to dashboard
2. Go to **Settings** → **Chat Widget** → **AI Assistant**
3. Toggle **"Enable AI Assistant"** to ON
4. Choose your AI model (OpenAI GPT-3.5 or GPT-4)

### Step 2: Train with Website Content

**Option A: Automatic Website Crawling**
1. In AI Assistant settings, find **"Knowledge Base"**
2. Click **"Add Knowledge Source"**
3. Select **"Website URL"**
4. Enter your website URL: `https://arfadevelopers.com`
5. Click **"Crawl Website"**
6. Tawk.to will automatically extract content from your website

**Option B: Manual Knowledge Base**
1. Go to **Settings** → **AI Assistant** → **Knowledge Base**
2. Click **"Add Article"** or **"Add FAQ"**
3. Create articles about:
   - Your services (Web Development, Mobile Apps, etc.)
   - Common questions (pricing, timeline, process)
   - Company information
   - Project rescue services

### Step 3: Create Custom Responses

1. Go to **Settings** → **AI Assistant** → **Custom Responses**
2. Click **"Add Response"**
3. Create responses for common queries:

   **Example 1: Service Inquiry**
   - **Trigger:** "What services do you offer?"
   - **Response:** "We offer custom web development, mobile apps, enterprise solutions, and specialize in rescuing failed projects from freelancers. Would you like to schedule a free consultation?"

   **Example 2: Pricing**
   - **Trigger:** "How much does it cost?"
   - **Response:** "Our pricing depends on your project requirements. We offer a free 30-minute consultation to discuss your needs. Would you like to schedule one?"

   **Example 3: Project Rescue**
   - **Trigger:** "Can you fix my broken project?"
   - **Response:** "Yes! We specialize in rescuing projects abandoned or poorly executed by freelancers. We can assess, fix, and rebuild your project quickly. Let's discuss your situation."

### Step 4: Set Up Auto-Reply Rules

1. Go to **Settings** → **AI Assistant** → **Auto-Reply Rules**
2. Create rules like:
   - **When:** Visitor asks about services
   - **Action:** AI responds with service information
   - **Fallback:** Redirect to contact form if AI can't answer

3. **Redirect to Form:**
   - Create a rule: "If question is about pricing or complex project"
   - **Action:** "Redirect to contact form" or "Schedule consultation"
   - Add link: `#contact` or your Calendly URL

### Step 5: Train with Past Conversations

1. Go to **Chats** → **History**
2. Review past conversations
3. Mark good AI responses as **"Correct"**
4. Mark incorrect responses and provide feedback
5. The AI will learn from these interactions

### Step 6: Configure AI Behavior

1. **Response Style:**
   - Go to **Settings** → **AI Assistant** → **Behavior**
   - Set tone: Professional, Friendly, or Custom
   - Set response length: Short, Medium, or Detailed

2. **Handoff to Human:**
   - Enable **"Escalate to human agent"**
   - Set triggers: "When AI confidence is low" or "When user requests human"
   - Set message: "Let me connect you with our team..."

### Step 7: Test Your AI

1. Visit your website
2. Open the chat widget
3. Ask test questions:
   - "What services do you offer?"
   - "Can you help with a failed project?"
   - "How do I get started?"
4. Verify responses are accurate
5. Adjust training as needed

---

## Best Practices for Training

### 1. Start with Common Questions
- Create 10-20 FAQ responses first
- Cover: Services, Pricing, Process, Timeline, Support

### 2. Use Your Website Content
- Let Tawk.to crawl your website automatically
- It will learn from your existing content

### 3. Regular Updates
- Review AI responses weekly
- Add new FAQs as you get common questions
- Update responses based on customer feedback

### 4. Redirect Complex Queries
- Set up rules to redirect complex questions to your contact form
- Example: "For detailed project quotes, please fill out our form: [link]"

### 5. Monitor Performance
- Check **Analytics** → **AI Performance**
- See which questions the AI handles well
- Identify areas needing more training

---

## Quick Setup Checklist

- [ ] Enable AI Assistant in dashboard
- [ ] Crawl website content automatically
- [ ] Create 10+ custom responses for common questions
- [ ] Set up auto-reply rules
- [ ] Configure handoff to human agent
- [ ] Test with sample questions
- [ ] Update widget text from "We Are Here!" to "💬 Need Help?"
- [ ] Monitor and refine based on real conversations

---

## Need Help?

- Tawk.to Documentation: https://help.tawk.to
- Tawk.to Community: https://www.tawk.to/community
- Contact Tawk.to Support: Available in dashboard

---

## Important Notes

1. **Widget Text:** The "We Are Here!" text is set in the Tawk.to dashboard, not in code. Change it in **Settings → Chat Widget → Widget Settings**.

2. **AI Training:** The AI improves over time as it learns from conversations. Be patient and keep training it.

3. **Free Tier:** Tawk.to's free tier includes AI Assistant, but with some limitations. Check their pricing for advanced features.
