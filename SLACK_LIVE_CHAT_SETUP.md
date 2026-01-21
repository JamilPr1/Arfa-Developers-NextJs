# Slack 2‑Way Live Chat Setup (Website ↔ Slack)

This enables a **true 2‑way live chat**:
- Visitors chat on the website
- Messages go into a **Slack thread**
- Any team member can reply in that thread
- Replies show up back inside the website chat (polled every ~2.5s)

## 1) Create a Slack App

1. Go to Slack Apps: `https://api.slack.com/apps`
2. **Create New App** → “From scratch”
3. Pick your workspace

## 2) Add OAuth Scopes (Bot Token Scopes)

In **OAuth & Permissions** → **Bot Token Scopes**, add:

- `chat:write`
- `channels:read`
- `channels:history`
- `groups:history` (only if you will use a private channel)

Then click **Install to Workspace** and copy the **Bot User OAuth Token**.

## 3) Pick the Slack channel

Create (or pick) a channel like `#website-chat`.

Copy the **Channel ID**:
- Right click channel → “View channel details” → copy Channel ID

## 4) Set Vercel Environment Variables

Add these in Vercel (Production + Preview + Development):

- `SLACK_BOT_TOKEN` = `xoxb-...`
- `SLACK_CHANNEL_ID` = `C0123ABCDEF` (or `G...` for private)
- `CHAT_SESSION_SECRET` = random long string (used to sign chat session tokens)

Note: You can keep `SLACK_WEBHOOK_URL` for lead notifications; live chat uses the bot token.

## 5) How your team replies

When a visitor sends a message:
- A Slack message appears in the channel
- Each visitor chat is a **Slack thread**

To reply to the visitor:
- Reply **in the thread**
- The website will show that reply to the visitor automatically.

