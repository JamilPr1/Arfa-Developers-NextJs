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
      console.error('[Chat Poll] Slack API error:', resp.error, { channel: verified.channelId, threadTs: verified.threadTs })
      return NextResponse.json({ success: false, error: `Slack error: ${resp.error || 'unknown'}` }, { status: 502 })
    }

    console.log(`[Chat Poll] Fetched ${resp.messages.length} messages from thread ${verified.threadTs}, cursor: ${cursor || 'none'}`)

    // Filter out visitor messages (posted by bot with metadata sender=visitor) and the thread starter header.
    const agentMessages = resp.messages
      .filter((m) => {
        if (!m.ts) return false
        
        // Skip messages we've already seen (cursor-based filtering)
        if (cursor && parseFloat(m.ts) <= parseFloat(cursor)) {
          return false
        }

        // Ignore bot-posted visitor messages (these are the website visitor messages)
        const isVisitorMeta = m.metadata?.event_type === 'webchat_message' && m.metadata?.event_payload?.sender === 'visitor'
        if (isVisitorMeta) {
          return false
        }

        // Ignore messages with subtypes (like thread_broadcast, etc.)
        if (m.subtype) {
          return false
        }

        // Keep only messages from real users (team members) - must have a user ID
        // Bot messages have bot_id, user messages have user
        if (!m.user || m.bot_id) {
          return false
        }

        // Must have text content
        if (!m.text || m.text.trim().length === 0) {
          return false
        }

        return true
      })
      .map((m) => ({
        id: m.ts!,
        ts: m.ts!,
        text: (m.text || '').replace(/^<@[^>]+>\s*/g, '').trim(),
      }))

    // Update cursor to the latest message timestamp in the thread
    // Slack returns messages in chronological order, so the last one is the most recent
    const latestMessage = resp.messages[resp.messages.length - 1]
    const newCursor = latestMessage?.ts || cursor

    // Debug logging (remove in production if needed)
    if (agentMessages.length > 0) {
      console.log(`[Chat Poll] Found ${agentMessages.length} new agent messages for thread ${verified.threadTs}`)
    }

    return NextResponse.json({ success: true, messages: agentMessages, cursor: newCursor })
  } catch (error) {
    console.error('Chat poll error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

