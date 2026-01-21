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

    // Validate threadTs format (should be a timestamp string like "1234567890.123456")
    if (!verified.threadTs || !/^\d+\.\d+$/.test(verified.threadTs)) {
      console.error('[Chat Poll] Invalid threadTs format:', verified.threadTs)
      return NextResponse.json(
        { success: false, error: 'Invalid thread timestamp format' },
        { status: 400 }
      )
    }

    // Validate channel ID format (should start with C, G, or D)
    if (!verified.channelId || !/^[CGD]/.test(verified.channelId)) {
      console.error('[Chat Poll] Invalid channelId format:', verified.channelId)
      return NextResponse.json(
        { success: false, error: 'Invalid channel ID format' },
        { status: 400 }
      )
    }

    console.log('[Chat Poll] Fetching replies:', {
      channel: verified.channelId,
      threadTs: verified.threadTs,
      cursor: cursor || 'none',
    })

    const resp = (await slackApi('conversations.replies', slackBotToken, {
      channel: verified.channelId,
      ts: verified.threadTs,
      limit: 50,
      // Remove inclusive parameter - it might be causing issues
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
        userFriendlyError = `Channel not found (${verified.channelId}). Please ensure: 1) The bot is added to the channel, 2) The channel ID is correct, 3) Update SLACK_CHANNEL_ID in Vercel if using a different channel.`
      } else if (slackError === 'not_in_channel') {
        userFriendlyError = `Bot is not a member of channel ${verified.channelId}. Add the bot to the channel using /invite @YourBotName`
      } else if (slackError === 'thread_not_found') {
        userFriendlyError = 'Thread not found. The chat session may have expired.'
      } else if (slackError === 'invalid_arguments') {
        userFriendlyError = `Invalid API arguments. Thread timestamp: ${verified.threadTs}, Channel: ${verified.channelId}. Please check if the thread still exists.`
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
        
        // Always skip the thread starter message itself (it's the header)
        if (m.ts === verified.threadTs) return false
        
        // Skip messages we've already seen (cursor-based filtering)
        // Only filter if cursor is set and is NOT the thread starter (threadTs)
        // This ensures we don't filter out messages that come after the thread starter
        if (cursor && cursor !== verified.threadTs && parseFloat(m.ts) <= parseFloat(cursor)) {
          return false
        }

        // Ignore bot-posted visitor messages (these are the website visitor messages)
        const isVisitorMeta = m.metadata?.event_type === 'webchat_message' && m.metadata?.event_payload?.sender === 'visitor'
        if (isVisitorMeta) return false

        // Ignore messages with subtypes (like thread_broadcast, etc.)
        if (m.subtype) return false

        // Keep only messages from real users (team members) - must have a user ID
        // Bot messages have bot_id, user messages have user
        if (!m.user || m.bot_id) return false

        // Must have text content
        if (!m.text || m.text.trim().length === 0) return false

        return true
      })
      .map((m) => ({
        id: m.ts!,
        ts: m.ts!,
        text: (m.text || '').replace(/^<@[^>]+>\s*/g, '').trim(),
      }))

    // Update cursor to the latest message timestamp in the thread
    // Slack returns messages in chronological order, so the last one is the most recent
    // Only update cursor if we have messages, and use the latest agent message timestamp
    let newCursor = cursor
    if (agentMessages.length > 0) {
      // Use the latest agent message timestamp as the new cursor
      const latestAgentMsg = agentMessages[agentMessages.length - 1]
      newCursor = latestAgentMsg.ts
      console.log(`[Chat Poll] Found ${agentMessages.length} new agent messages for thread ${verified.threadTs}`)
      console.log(`[Chat Poll] Agent messages:`, agentMessages.map(m => ({ ts: m.ts, text: m.text?.substring(0, 50) })))
    } else if (resp.messages.length > 0) {
      // If no agent messages but we have messages, update cursor to latest message
      // This prevents re-fetching the same messages
      const latestMessage = resp.messages[resp.messages.length - 1]
      if (latestMessage?.ts && latestMessage.ts !== verified.threadTs) {
        newCursor = latestMessage.ts
      }
    }

    console.log(`[Chat Poll] Returning ${agentMessages.length} agent messages, cursor: ${newCursor}`)

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

