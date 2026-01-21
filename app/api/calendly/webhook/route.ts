import { NextRequest, NextResponse } from 'next/server'

/**
 * Calendly → Slack webhook forwarder
 *
 * Configure Calendly Webhooks to send events like:
 * - invitee.created
 * - invitee.canceled
 *
 * Security:
 * - Set CALENDLY_WEBHOOK_SECRET in env
 * - Use webhook URL with ?secret=YOUR_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.CALENDLY_WEBHOOK_SECRET
    if (!expectedSecret) {
      console.warn('Calendly webhook secret not configured (CALENDLY_WEBHOOK_SECRET)')
      return NextResponse.json({ success: false }, { status: 500 })
    }

    const providedSecret = new URL(request.url).searchParams.get('secret')
    if (providedSecret !== expectedSecret) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    if (!process.env.SLACK_WEBHOOK_URL) {
      console.warn('Slack webhook URL not configured (SLACK_WEBHOOK_URL)')
      return NextResponse.json({ success: false }, { status: 500 })
    }

    const payload = await request.json()

    const eventType: string | undefined = payload?.event
    const data = payload?.payload

    // Calendly payload fields we care about (best-effort; structure varies by webhook type)
    const invitee = data?.invitee
    const event = data?.event

    const name = invitee?.name || 'N/A'
    const email = invitee?.email || 'N/A'
    const status = invitee?.status || eventType || 'calendly'
    const startTime = event?.start_time || event?.start_time_pretty || event?.start_time_localized || 'N/A'
    const endTime = event?.end_time || event?.end_time_pretty || event?.end_time_localized || 'N/A'
    const timezone = invitee?.timezone || event?.timezone || 'N/A'
    const eventName = event?.name || event?.event_type?.name || data?.event_type?.name || 'Calendly Booking'
    const location = event?.location?.location || invitee?.location || 'N/A'
    const eventUri = event?.uri || event?.uuid || ''
    const inviteeUri = invitee?.uri || invitee?.uuid || ''

    const isCreated = eventType === 'invitee.created'
    const isCanceled = eventType === 'invitee.canceled'

    const headerText = isCreated
      ? '📅 New Calendly Booking'
      : isCanceled
        ? '❌ Calendly Booking Canceled'
        : '📅 Calendly Update'

    const slackPayload = {
      text: `${headerText}: ${name} (${email}) - ${eventName}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: headerText },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Name:*\n${name}` },
            { type: 'mrkdwn', text: `*Email:*\n${email}` },
            { type: 'mrkdwn', text: `*Event:*\n${eventName}` },
            { type: 'mrkdwn', text: `*Status:*\n${status}` },
            { type: 'mrkdwn', text: `*Start:*\n${startTime}` },
            { type: 'mrkdwn', text: `*End:*\n${endTime}` },
            { type: 'mrkdwn', text: `*Timezone:*\n${timezone}` },
            { type: 'mrkdwn', text: `*Location:*\n${location}` },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Event URI:* ${eventUri || 'N/A'}  |  *Invitee URI:* ${inviteeUri || 'N/A'}`,
            },
          ],
        },
      ],
    }

    const resp = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    })

    if (!resp.ok) {
      const txt = await resp.text()
      console.error('Slack webhook failed:', resp.status, txt)
      return NextResponse.json({ success: false }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Calendly webhook error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

