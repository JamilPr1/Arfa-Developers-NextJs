import { NextRequest, NextResponse } from 'next/server'
import { verifyChatToken } from '@/lib/chatToken'

type SlackRepliesResponse = {
  ok: boolean
  messages?: Array<{
    ts: string
    text?: string
    user?: string
    bot_id?: string
    subtype?: string
    metadata?: { event_type?: string; event_payload?: any }
  }>
  error?: string
}

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

export async function GET(request: NextRequest) {
  try {
    const slackBotToken = process.env.SLACK_BOT_TOKEN
    const tokenSecret = process.env.CHAT_SESSION_SECRET
    if (!slackBotToken || !tokenSecret) {
      return NextResponse.json({ success: false, error: 'Not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || ''
    const cursor = searchParams.get('cursor') || '' // last seen ts

    const verified = verifyChatToken(token, tokenSecret)
    if (!verified) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    const resp = (await slackApi('conversations.replies', slackBotToken, {
      channel: verified.channelId,
      ts: verified.threadTs,
      limit: 50,
      inclusive: true,
    })) as SlackRepliesResponse

    if (!resp.ok || !resp.messages) {
      return NextResponse.json({ success: false, error: `Slack error: ${resp.error || 'unknown'}` }, { status: 502 })
    }

    // Filter out visitor messages (posted by bot with metadata sender=visitor) and the thread starter header.
    const agentMessages = resp.messages
      .filter((m) => {
        if (!m.ts) return false
        if (cursor && parseFloat(m.ts) <= parseFloat(cursor)) return false

        // Ignore bot-posted visitor messages
        const isVisitorMeta = m.metadata?.event_type === 'webchat_message' && m.metadata?.event_payload?.sender === 'visitor'
        if (isVisitorMeta) return false

        // Ignore the thread starter message (typically has no user reply content)
        // Keep only user messages from team members
        if (m.subtype) return false
        if (!m.user) return false
        return true
      })
      .map((m) => ({
        id: m.ts,
        ts: m.ts,
        text: (m.text || '').replace(/^<@[^>]+>\s*/g, '').trim(),
      }))

    const newCursor = resp.messages.length ? resp.messages[resp.messages.length - 1].ts : cursor

    return NextResponse.json({ success: true, messages: agentMessages, cursor: newCursor })
  } catch (error) {
    console.error('Chat poll error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

