import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  message: string
  timestamp: string
}

// Send chat message to Slack
async function sendToSlack(message: string, timestamp: string): Promise<boolean> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not configured')
    return false
  }

  try {
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `💬 New Website Chat Message`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '💬 New Website Chat Message',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${message}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `📅 ${new Date(timestamp).toLocaleString()}`,
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '💡 *Quick Actions:*\n• Reply in this thread\n• Call: +1-516-603-7838\n• Email: jawadparvez.dev@gmail.com',
            },
          },
        ],
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Error sending to Slack:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatMessage = await request.json()
    const { message, timestamp } = body

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Send to Slack
    const success = await sendToSlack(message.trim(), timestamp || new Date().toISOString())

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send message to Slack' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
