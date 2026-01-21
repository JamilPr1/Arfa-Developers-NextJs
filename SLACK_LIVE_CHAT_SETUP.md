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

- `chat:write` (to post messages and create threads)
- `channels:read` (to read channel information)
- `channels:history` (to read messages and thread replies - **REQUIRED for polling**)
- `groups:history` (only if you will use a private channel)

**Important:** After adding scopes, you **must reinstall the app** to your workspace for the new permissions to take effect.

Then click **Install to Workspace** and copy the **Bot User OAuth Token**.

## 3) Pick the Slack channel

**Default Channel ID:** `D0AA3JR33T8` (already configured in code)

If you want to use a different channel:
- Create (or pick) a channel like `#website-chat`
- Right click channel → "View channel details" → copy Channel ID
- Set `SLACK_CHANNEL_ID` in Vercel to override the default

## 4) Set Vercel Environment Variables

Add these in Vercel (Production + Preview + Development):

- `SLACK_BOT_TOKEN` = `xoxb-...` (required)
- `SLACK_CHANNEL_ID` = `D0AA3JR33T8` (optional - defaults to this channel if not set)
- `CHAT_SESSION_SECRET` = random long string (required - used to sign chat session tokens)

**Important:** If you have an old `SLACK_CHANNEL_ID` value set to `C0A9W02H09Y`, update it to `D0AA3JR33T8` or remove it to use the default.

Note: You can keep `SLACK_WEBHOOK_URL` for lead notifications; live chat uses the bot token.

## 5) How your team replies

When a visitor sends a message:
- A Slack message appears in the channel
- Each visitor chat is a **Slack thread**

To reply to the visitor:
- Reply **in the thread** (not in the main channel)
- The website will show that reply to the visitor automatically (polled every ~2.5 seconds)

## Troubleshooting

### 502 Bad Gateway errors on `/api/chat/poll`

If you see 502 errors when polling for replies:

1. **Check Vercel logs** (Project → Logs) to see the actual Slack API error
2. **Verify bot scopes**: Ensure `channels:history` is added and the app is reinstalled
3. **Verify bot is in channel**: The bot must be a member of the channel
4. **Check thread exists**: Make sure you're replying in the thread (not posting new messages)

Common Slack API errors:
- `channel_not_found` → Bot not in channel or wrong channel ID
- `missing_scope` → Bot needs `channels:history` scope
- `thread_not_found` → Invalid thread timestamp (shouldn't happen if using the token)

