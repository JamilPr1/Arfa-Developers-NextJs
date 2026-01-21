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

async function slackApi(method: string, token: string, payload: Record<string, any>, timeoutMs = 10000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    const resp = await fetch(`https://slack.com/api/${method}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!resp.ok) {
      console.error(`[Slack API] HTTP error: ${resp.status} ${resp.statusText}`)
    }
    return (await resp.json()) as any
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[Slack API] Request timeout')
      throw new Error('Slack API request timed out')
    }
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
    
    // Test if bot token has the required scope by calling auth.test
    // This helps diagnose scope issues
    try {
      const authTest = (await slackApi('auth.test', slackBotToken, {}, 3000)) as any
      if (authTest.ok) {
        console.log('[Chat Poll] Bot token verified:', {
          botId: authTest.bot_id,
          userId: authTest.user_id,
          team: authTest.team,
        })
      } else {
        console.error('[Chat Poll] Bot token invalid:', authTest.error)
      }
    } catch (error) {
      console.warn('[Chat Poll] Could not verify bot token (non-critical):', error)
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

    // Ensure threadTs is a string (Slack API requires string format)
    // Also ensure it's in the correct format (timestamp with decimal)
    const threadTsString = String(verified.threadTs).trim()
    
    // Double-check the format is correct
    if (!/^\d+\.\d+$/.test(threadTsString)) {
      console.error('[Chat Poll] ThreadTs format validation failed after string conversion:', threadTsString)
      return NextResponse.json(
        { success: false, error: 'Invalid thread timestamp format in token' },
        { status: 400 }
      )
    }
    
    console.log('[Chat Poll] Calling Slack API with:', {
      channel: verified.channelId,
      ts: threadTsString,
      tsType: typeof threadTsString,
    })
    
    // Build API payload - ensure all values are strings
    const apiPayload: Record<string, string | number> = {
      channel: String(verified.channelId).trim(),
      ts: threadTsString,
      limit: 50,
    }
    
    console.log('[Chat Poll] Slack API payload:', JSON.stringify(apiPayload))
    console.log('[Chat Poll] Payload types:', {
      channel: typeof apiPayload.channel,
      ts: typeof apiPayload.ts,
      limit: typeof apiPayload.limit,
    })
    
    // First, verify the channel and bot membership using conversations.info
    // This helps diagnose if the issue is with the thread or the API call
    try {
      const channelInfo = (await slackApi('conversations.info', slackBotToken, {
        channel: verified.channelId,
      }, 5000)) as any
      
      if (!channelInfo.ok) {
        console.error('[Chat Poll] Channel info check failed:', channelInfo.error)
        if (channelInfo.error === 'missing_scope') {
          return NextResponse.json(
            {
              success: false,
              error: 'Bot is missing channels:read scope. Even though scope is in UI, app must be REINSTALLED after adding scopes.',
              details: channelInfo.error,
            },
            { status: 502 }
          )
        }
      } else {
        console.log('[Chat Poll] Channel verified:', {
          channelId: verified.channelId,
          channelName: channelInfo.channel?.name,
          isMember: channelInfo.channel?.is_member,
          isPrivate: channelInfo.channel?.is_private,
        })
        
        if (!channelInfo.channel?.is_member) {
          console.error('[Chat Poll] Bot is not a member of the channel!')
        }
      }
    } catch (error) {
      console.warn('[Chat Poll] Could not verify channel (non-critical):', error)
    }

    // Use conversations.history instead of conversations.replies for simpler, more reliable polling
    // This gets recent messages from the channel and we filter for thread replies
    let resp: any
    try {
      // Get recent messages from the channel (last 50 messages)
      resp = (await slackApi('conversations.history', slackBotToken, {
        channel: verified.channelId,
        limit: 50,
      }, 8000)) as any
      
      // If that works, filter for messages in our thread
      if (resp.ok && resp.messages) {
        // Find the thread starter message
        const threadStarter = resp.messages.find((m: { ts?: string }) => m.ts === threadTsString)
        
        if (!threadStarter) {
          console.log('[Chat Poll] Thread starter not found in recent history, thread may be older')
          // Return empty but success - thread exists but no new replies
          return NextResponse.json({
            success: true,
            messages: [],
            cursor: cursor,
          })
        }
        
        // Get all messages that are replies to this thread (have thread_ts matching our thread)
        const threadReplies = resp.messages.filter((m: { thread_ts?: string; ts?: string }) => 
          m.thread_ts === threadTsString && m.ts !== threadTsString
        )
        
        // Convert to our format
        const agentMessages = threadReplies
          .filter((m: { metadata?: { event_type?: string; event_payload?: { sender?: string } }; ts?: string; user?: string; bot_id?: string; text?: string }) => {
            // Skip bot-posted visitor messages
            const isVisitorMeta = m.metadata?.event_type === 'webchat_message' && 
                                 m.metadata?.event_payload?.sender === 'visitor'
            if (isVisitorMeta) return false
            
            // Skip messages we've already seen
            if (cursor && m.ts && parseFloat(m.ts) <= parseFloat(cursor)) return false
            
            // Only real user messages (not bot messages)
            if (!m.user || m.bot_id) return false
            if (!m.text || m.text.trim().length === 0) return false
            
            return true
          })
          .map((m: { ts: string; text?: string }) => ({
            id: m.ts,
            ts: m.ts,
            text: (m.text || '').replace(/^<@[^>]+>\s*/g, '').trim(),
          }))
        
        const newCursor = threadReplies.length > 0 
          ? threadReplies[threadReplies.length - 1].ts 
          : cursor
        
        console.log(`[Chat Poll] Found ${agentMessages.length} agent messages using conversations.history`)
        
        return NextResponse.json({
          success: true,
          messages: agentMessages,
          cursor: newCursor,
        })
      }
      
      // If conversations.history failed, fall back to conversations.replies
      console.log('[Chat Poll] conversations.history failed, trying conversations.replies as fallback')
      resp = (await slackApi('conversations.replies', slackBotToken, apiPayload, 8000)) as SlackRepliesResponse
    } catch (error) {
      // Handle timeout or network errors gracefully
      console.error('[Chat Poll] Slack API call failed:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Slack API request failed. This might be temporary - please try again.',
          details: error instanceof Error ? error.message : 'Unknown error',
          retry: true,
        },
        { status: 502 }
      )
    }

    if (!resp.ok) {
      // Log the full response for debugging
      console.error('[Chat Poll] Full Slack API response:', JSON.stringify(resp, null, 2))
      
      // If it's invalid_arguments, log full details for debugging
      if (resp.error === 'invalid_arguments') {
        const errorDetails = {
          error: resp.error,
          warning: resp.warning,
          response_metadata: resp.response_metadata,
          payload: apiPayload,
          payloadStringified: JSON.stringify(apiPayload),
          channelId: verified.channelId,
          threadTs: threadTsString,
        }
        console.error('[Chat Poll] Invalid arguments - FULL DETAILS:', JSON.stringify(errorDetails, null, 2))
        
        // Check response_metadata for more details
        if (resp.response_metadata?.messages) {
          console.error('[Chat Poll] Response metadata messages:', resp.response_metadata.messages)
        }
        
        // Try to get more info about why it's invalid
        // Sometimes Slack returns additional error context
        const errorMsg = resp.warning || resp.error || 'invalid_arguments'
        
        // Check if it's a timing issue (thread just created) vs a real error
        // If we've been polling for a while, it's likely a real error
        const isRecentThread = Date.now() - (parseFloat(threadTsString) * 1000) < 30000 // 30 seconds
        
        if (isRecentThread) {
          // Thread was just created, might need time to index
          return NextResponse.json(
            {
              success: false,
              error: `Thread may not be indexed yet. Please wait a moment and try again.`,
              details: resp.error,
              retry: true,
            },
            { status: 200 }
          )
        } else {
          // Thread is older, this is likely a real error
          // Try to verify if the thread actually exists by checking the channel history
          try {
            const historyCheck = (await slackApi('conversations.history', slackBotToken, {
              channel: verified.channelId,
              latest: threadTsString,
              limit: 1,
              inclusive: true,
            }, 5000)) as any
            
            if (!historyCheck.ok) {
              console.error('[Chat Poll] History check failed:', historyCheck.error)
            } else {
              console.log('[Chat Poll] History check result:', {
                hasMessages: historyCheck.messages?.length > 0,
                messageTs: historyCheck.messages?.[0]?.ts,
                matchesThread: historyCheck.messages?.[0]?.ts === threadTsString,
              })
            }
          } catch (err) {
            console.warn('[Chat Poll] Could not verify thread in history:', err)
          }
          
          return NextResponse.json(
            {
              success: false,
              error: `Slack API error: ${errorMsg}. Check Vercel logs for full details. Possible causes: 1) Bot not in channel, 2) Thread doesn't exist, 3) Missing scope (even if shown in UI, app may need reinstall), 4) Thread timestamp format issue.`,
              details: resp.error,
              retry: false, // Don't retry if it's a persistent error
            },
            { status: 502 }
          )
        }
      }
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
        console.error('[Chat Poll] Invalid arguments details:', {
          channel: verified.channelId,
          threadTs: verified.threadTs,
          threadTsType: typeof verified.threadTs,
          channelType: typeof verified.channelId,
          channelStartsWith: verified.channelId?.[0],
          threadTsFormat: /^\d+\.\d+$/.test(String(verified.threadTs)),
          fullResponse: resp,
        })
        
        // invalid_arguments for conversations.replies almost always means missing channels:history scope
        // Check if it's a private channel issue (private channels start with 'G')
        if (verified.channelId?.startsWith('G')) {
          userFriendlyError = `CRITICAL: Bot is missing 'groups:history' scope. Go to https://api.slack.com/apps → Your App → OAuth & Permissions → Add 'groups:history' → Reinstall App → Update SLACK_BOT_TOKEN in Vercel`
        } else {
          userFriendlyError = `CRITICAL: Bot is missing 'channels:history' scope. This is REQUIRED for reading thread replies. Fix: 1) Go to https://api.slack.com/apps → Your App → OAuth & Permissions, 2) Add 'channels:history' scope, 3) Click 'Reinstall to Workspace', 4) Copy new Bot Token, 5) Update SLACK_BOT_TOKEN in Vercel, 6) Redeploy`
        }
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

