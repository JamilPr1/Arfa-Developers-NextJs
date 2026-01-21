# Calendly → Slack Notifications (Bookings)

This project supports sending **Calendly booking events** to Slack using a webhook endpoint.

## What you get

- `invitee.created` → posts **New Calendly Booking** into Slack
- `invitee.canceled` → posts **Booking Canceled** into Slack

## 1) Set Environment Variables (Vercel)

Make sure this already exists (you said Slack is working):

- `SLACK_WEBHOOK_URL` = your Slack incoming webhook URL

Add this new secret:

- `CALENDLY_WEBHOOK_SECRET` = a random long string (example: `calendly_9d3c2c2b7d2b4b1f9c...`)

## 2) Add Webhook in Calendly

In Calendly:

1. Go to **Integrations** → **Webhooks** (or Admin → Webhooks)
2. Click **Add Webhook**
3. Set **Webhook URL** to:

`https://YOUR_DOMAIN.vercel.app/api/calendly/webhook?secret=YOUR_CALENDLY_WEBHOOK_SECRET`

4. Subscribe to events:
   - `invitee.created`
   - `invitee.canceled`

5. Save

## 3) Test

1. Book a meeting via your embedded Calendly
2. Confirm a message appears in Slack
3. Cancel a meeting and confirm the cancel message appears in Slack

## Notes

- We use a simple `?secret=` to protect the endpoint.
- If you want stronger verification (HMAC signature), tell me and I’ll add signature verification as well.

