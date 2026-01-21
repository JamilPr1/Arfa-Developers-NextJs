import { NextRequest, NextResponse } from 'next/server'
import { signChatToken, verifyChatToken } from '@/lib/chatToken'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

interface ChatMessage {
  message: string
  timestamp: string
  sessionId?: string
  pageUrl?: string
  token?: string
}

type SlackPostMessageResponse = { ok: boolean; ts?: string; error?: string }

async function slackApi(method: string, token: string, payload: Record<string, any>) {
  const resp = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  })
  return (await resp.json()) as any
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatMessage = await request.json()
    const { message, timestamp, sessionId, pageUrl, token } = body

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

    const slackBotToken = process.env.SLACK_BOT_TOKEN
    // Default channel: C0A9W02H09Y (can be overridden via SLACK_CHANNEL_ID env var)
    const slackChannelId = process.env.SLACK_CHANNEL_ID || 'C0A9W02H09Y'
    const tokenSecret = process.env.CHAT_SESSION_SECRET

    if (!slackBotToken || !tokenSecret) {
      console.error('Missing environment variables:', {
        hasBotToken: !!slackBotToken,
        hasTokenSecret: !!tokenSecret,
        channelId: slackChannelId,
      })
      return NextResponse.json(
        {
          success: false,
          error:
            'Slack live chat is not configured. Please set SLACK_BOT_TOKEN and CHAT_SESSION_SECRET in Vercel environment variables. After adding them, redeploy your project.',
        },
        { status: 500 }
      )
    }

    const safeSession = sessionId && sessionId.length < 200 ? sessionId : `chat_${Date.now()}`
    const safePageUrl = pageUrl && pageUrl.length < 1000 ? pageUrl : undefined

    let threadTs: string | undefined
    let channelId: string | undefined

    if (token) {
      const verified = verifyChatToken(token, tokenSecret)
      if (verified && verified.sessionId === safeSession) {
        threadTs = verified.threadTs
        channelId = verified.channelId
      }
    }

    // Create a new thread for this session on first message
    if (!threadTs) {
      const introBlocks: any[] = [
        {
          type: 'header',
          text: { type: 'plain_text', text: '💬 New Website Live Chat' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Session:*\n\`${safeSession}\`` },
            { type: 'mrkdwn', text: `*Time:*\n${new Date(timestamp || new Date().toISOString()).toLocaleString()}` },
          ],
        },
      ]
      if (safePageUrl) {
        introBlocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `*Page:*\n${safePageUrl}` },
        })
      }
      introBlocks.push({ type: 'divider' })

      const intro = (await slackApi('chat.postMessage', slackBotToken, {
        channel: slackChannelId,
        text: `New website chat (${safeSession})`,
        blocks: introBlocks,
      })) as SlackPostMessageResponse

      if (!intro.ok || !intro.ts) {
        console.error('Slack intro message error:', intro.error, intro)
        return NextResponse.json({ 
          success: false, 
          error: `Slack API error: ${intro.error || 'Failed to create chat thread. Please check your Slack Bot Token and channel permissions.'}` 
        }, { status: 502 })
      }

      threadTs = intro.ts
      channelId = slackChannelId
    }

    // Post visitor message into the thread (as bot)
    const msg = (await slackApi('chat.postMessage', slackBotToken, {
      channel: channelId,
      thread_ts: threadTs,
      text: `👤 Visitor: ${message.trim()}`,
      metadata: {
        event_type: 'webchat_message',
        event_payload: {
          sessionId: safeSession,
          sender: 'visitor',
        },
      },
    })) as SlackPostMessageResponse

    if (!msg.ok) {
      console.error('Slack message post error:', msg.error, msg)
      return NextResponse.json({ 
        success: false, 
        error: `Slack API error: ${msg.error || 'Failed to send message. Please check your Slack Bot Token permissions.'}` 
      }, { status: 502 })
    }

    const newToken = signChatToken(
      { sessionId: safeSession, channelId: channelId!, threadTs: threadTs! },
      tokenSecret
    )

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      token: newToken,
      threadTs,
    })
  } catch (error) {
    console.error('Error processing chat message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: `Server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
