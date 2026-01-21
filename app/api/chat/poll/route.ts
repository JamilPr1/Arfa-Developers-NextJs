import { NextRequest, NextResponse } from 'next/server'
import { verifyChatToken } from '@/lib/chatToken'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

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
  warning?: string
  response_metadata?: any
}

async function slackApi(method: string, token: string, payload: Record<string, any>) {
  try {
    const resp = await fetch(`https://slack.com/api/${method}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })
    if (!resp.ok) {
      console.error(`[Slack API] HTTP error: ${resp.status} ${resp.statusText}`)
    }
    return (await resp.json()) as any
  } catch (error) {
    console.error('[Slack API] Network error:', error)
    throw error
  }
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

    if (!resp.ok) {
      const slackError = resp.error || 'unknown_error'
      const errorDetails = {
        error: slackError,
        channel: verified.channelId,
        threadTs: verified.threadTs,
        warning: resp.warning,
        response_metadata: resp.response_metadata,
      }
      console.error('[Chat Poll] Slack API error:', errorDetails)
      
      // Provide helpful error messages based on common errors
      let userFriendlyError = `Slack API error: ${slackError}`
      if (slackError === 'missing_scope') {
        userFriendlyError = 'Bot is missing required scope: channels:history. Please add this scope and reinstall the app.'
      } else if (slackError === 'channel_not_found') {
        userFriendlyError = 'Channel not found. Please ensure the bot is added to the channel.'
      } else if (slackError === 'thread_not_found') {
        userFriendlyError = 'Thread not found. The chat session may have expired.'
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: userFriendlyError,
          details: slackError, // Include raw error for debugging
        }, 
        { status: 502 }
      )
    }

    if (!resp.messages || !Array.isArray(resp.messages)) {
      console.error('[Chat Poll] Invalid response format:', { resp })
      return NextResponse.json(
        { success: false, error: 'Invalid response from Slack API' },
        { status: 502 }
      )
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
    console.error('[Chat Poll] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        success: false, 
        error: `Server error: ${errorMessage}. Check Vercel logs for details.` 
      }, 
      { status: 500 }
    )
  }
}

