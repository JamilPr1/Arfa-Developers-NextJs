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

**⚠️ CRITICAL STEP:** After adding scopes, you **MUST reinstall the app** to your workspace:

1. Click **"Reinstall to Workspace"** button (or **"Install to Workspace"** if not yet installed)
2. Authorize the app with the new scopes
3. **Copy the NEW Bot User OAuth Token** (starts with `xoxb-`)
4. **Update `SLACK_BOT_TOKEN` in Vercel** with this new token
5. **Redeploy your Vercel project**

**Common mistake:** Adding scopes but forgetting to reinstall the app. The old token won't have the new permissions!

## 3) Pick the Slack channel

**Default Channel ID:** `C0AA2KHR02Z` (support-team-channel - already configured in code)

If you want to use a different channel:
- Create (or pick) a channel like `#website-chat`
- Right click channel → "View channel details" → copy Channel ID
- Set `SLACK_CHANNEL_ID` in Vercel to override the default

## 4) Set Vercel Environment Variables

Add these in Vercel (Production + Preview + Development):

- `SLACK_BOT_TOKEN` = `xoxb-...` (required - **exact name must be `SLACK_BOT_TOKEN`**)
- `SLACK_CHANNEL_ID` = `C0AA2KHR02Z` (optional - defaults to support-team-channel if not set)
- `CHAT_SESSION_SECRET` = random long string (required - used to sign chat session tokens)

**⚠️ CRITICAL:** The variable name must be exactly `SLACK_BOT_TOKEN` (not `Bot_User_OAuth_Token` or any other name). The code looks for this exact name.

**Important:** If you have an old `SLACK_CHANNEL_ID` value set to `C0A9W02H09Y` or `D0AA3JR33T8`, update it to `C0AA2KHR02Z` or remove it to use the default.

**Note:** 
- You can keep `SLACK_WEBHOOK_URL` for lead notifications; live chat uses the bot token.
- The `User_OAuth_Token` (starting with `xoxp-`) is not used by this code and can be removed.

## 5) How your team replies

When a visitor sends a message:
- A Slack message appears in the channel
- Each visitor chat is a **Slack thread**

To reply to the visitor:
- Reply **in the thread** (not in the main channel)
- The website will show that reply to the visitor automatically (polled every ~2.5 seconds)

## Troubleshooting

### `missing_scope` Error (Most Common Issue)

If you see `[Chat Poll] ❌ Fallback also failed: missing_scope` in Vercel logs:

**This means your bot token doesn't have the required OAuth scopes.**

**Fix Steps:**
1. Go to https://api.slack.com/apps → Select your app
2. Navigate to **"OAuth & Permissions"** → **"Bot Token Scopes"**
3. Verify these scopes are added:
   - ✅ `channels:history` (REQUIRED for polling replies)
   - ✅ `channels:read` (REQUIRED for channel info)
   - ✅ `chat:write` (REQUIRED for posting messages)
4. **Click "Reinstall to Workspace"** (this is critical!)
5. Authorize the app with the new permissions
6. **Copy the NEW Bot User OAuth Token** (it will be different after reinstall)
7. **Update `SLACK_BOT_TOKEN` in Vercel** with the new token
8. **Redeploy your Vercel project**

**Why this happens:** Adding scopes doesn't automatically grant them to existing tokens. You must reinstall the app to get a new token with the updated permissions.

### 502 Bad Gateway errors on `/api/chat/poll`

If you see 502 errors when polling for replies:

1. **Check Vercel logs** (Project → Logs) to see the actual Slack API error
2. **Verify bot scopes**: Ensure `channels:history` is added and the app is reinstalled
3. **Verify bot is in channel**: The bot must be a member of the channel
4. **Check thread exists**: Make sure you're replying in the thread (not posting new messages)

Common Slack API errors:
- `channel_not_found` → Bot not in channel or wrong channel ID
- `missing_scope` → Bot needs `channels:history` scope (see fix above)
- `thread_not_found` → Invalid thread timestamp (shouldn't happen if using the token)
- `not_in_channel` → Bot is not a member of the channel (invite bot with `/invite @YourBotName`)

### "Missing environment variables" Error

If you see `Missing environment variables: { hasBotToken: false, ... }`:

**This means Vercel can't find the `SLACK_BOT_TOKEN` variable.**

**Fix Steps:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Check if you have a variable named `SLACK_BOT_TOKEN` (exact name, case-sensitive)
3. If you have `Bot_User_OAuth_Token` or any other name, **delete it and create a new one** with the exact name `SLACK_BOT_TOKEN`
4. Set the value to your bot token (starts with `xoxb-`)
5. Make sure it's enabled for **Production**, **Preview**, and **Development** environments
6. **Redeploy your project** (or wait for automatic redeploy)

**Common mistake:** Using `Bot_User_OAuth_Token` instead of `SLACK_BOT_TOKEN`. The code looks for the exact name `SLACK_BOT_TOKEN`.

