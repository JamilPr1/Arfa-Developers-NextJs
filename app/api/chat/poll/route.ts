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
        
        // Test if token has channels:history scope by attempting a simple history call
        // This helps diagnose if the token actually has the required scopes
        try {
          const scopeTest = await slackApi('conversations.history', slackBotToken, {
            channel: 'C0AA2KHR02Z', // Test with default channel
            limit: 1,
          }, 3000) as any
          
          if (scopeTest.ok) {
            console.log('[Chat Poll] ✅ Scope test passed: Token has channels:history scope')
          } else if (scopeTest.error === 'missing_scope') {
            console.error('[Chat Poll] 🚨 SCOPE TEST FAILED: Token is MISSING channels:history scope!')
            console.error('[Chat Poll] 🚨 This means:')
            console.error('[Chat Poll] 🚨   1. Scopes may be added in Slack app settings, BUT')
            console.error('[Chat Poll] 🚨   2. The app was NOT reinstalled after adding scopes')
            console.error('[Chat Poll] 🚨   3. The token in Vercel is an OLD token without the new scopes')
            console.error('[Chat Poll] 🚨 FIX: Reinstall the app → Get NEW token → Update Vercel')
          } else {
            console.warn('[Chat Poll] Scope test returned:', scopeTest.error, '(may be channel access issue, not scope issue)')
          }
        } catch (scopeError) {
          console.warn('[Chat Poll] Could not test scopes (non-critical):', scopeError)
        }
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

    // Check bot access to channel and verify permissions
    try {
      const channelInfo = (await slackApi('conversations.info', slackBotToken, {
        channel: String(verified.channelId).trim(),
      }, 5000)) as any
      
      if (!channelInfo.ok) {
        console.error('[Chat Poll] ❌ Channel access check failed:', {
          error: channelInfo.error,
          channel: verified.channelId,
        })
        
        if (channelInfo.error === 'channel_not_found') {
          return NextResponse.json({
            success: false,
            error: `Channel not found. Please ensure: 1) The bot is added to the channel, 2) The channel ID (${verified.channelId}) is correct, 3) Update SLACK_CHANNEL_ID in Vercel if using a different channel.`,
          }, { status: 404 })
        } else if (channelInfo.error === 'missing_scope') {
          return NextResponse.json({
            success: false,
            error: 'Bot is missing required scopes. Please add channels:read, channels:history, and chat:write to your Slack app, then REINSTALL the app to your workspace, copy the NEW bot token, and update SLACK_BOT_TOKEN in Vercel.',
          }, { status: 403 })
        } else if (channelInfo.error === 'not_in_channel') {
          return NextResponse.json({
            success: false,
            error: `Bot is not a member of channel ${verified.channelId}. Add the bot to the channel using /invite @YourBotName`,
          }, { status: 403 })
        }
      } else {
        console.log('[Chat Poll] ✅ Channel access verified:', {
          channel: verified.channelId,
          channelName: channelInfo.channel?.name,
          isMember: channelInfo.channel?.is_member,
        })
      }
    } catch (error) {
      console.warn('[Chat Poll] Channel access check failed (non-critical):', error)
      // Continue anyway - the actual API call will fail if there's a real issue
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
    
    // Use conversations.replies to get thread replies (this is the correct API for threads)
    // conversations.history doesn't return thread replies, only top-level messages
    try {
      // First, verify the parent message exists by trying to get it
      // This helps diagnose if the thread timestamp is valid
      let parentMessageExists = false
      try {
        const parentCheck = await slackApi('conversations.history', slackBotToken, {
          channel: String(verified.channelId).trim(),
          latest: threadTsString,
          limit: 1,
          inclusive: true,
        }, 3000) as any
        
        if (parentCheck.ok && parentCheck.messages && parentCheck.messages.length > 0) {
          const parentMsg = parentCheck.messages[0]
          if (parentMsg.ts === threadTsString) {
            parentMessageExists = true
            console.log('[Chat Poll] ✅ Parent message verified:', {
              ts: parentMsg.ts,
              text: parentMsg.text?.substring(0, 50),
              hasThread: !!parentMsg.thread_ts,
            })
          }
        }
      } catch (e) {
        console.warn('[Chat Poll] Could not verify parent message (non-critical):', e)
      }
      
      // Build the API payload - ensure all values are correct types
      const apiPayload: Record<string, any> = {
        channel: String(verified.channelId).trim(),
        ts: threadTsString, // Thread timestamp (parent message timestamp)
        limit: 100, // Get up to 100 messages from the thread
      }
      
      console.log('[Chat Poll] 📤 Calling conversations.replies with payload:', {
        channel: apiPayload.channel,
        ts: apiPayload.ts,
        tsType: typeof apiPayload.ts,
        tsLength: apiPayload.ts.length,
        limit: apiPayload.limit,
        parentMessageExists,
      })
      
      const resp = (await slackApi('conversations.replies', slackBotToken, apiPayload, 8000)) as SlackRepliesResponse
      
      if (!resp.ok) {
        // Log the error with full details
        console.error('[Chat Poll] ❌ conversations.replies FAILED:', {
          error: resp.error,
          warning: resp.warning,
          channel: verified.channelId,
          threadTs: threadTsString,
          payload: apiPayload,
          parentMessageExists,
          fullResponse: JSON.stringify(resp, null, 2),
        })
        
        // Provide specific error messages
        if (resp.error === 'missing_scope') {
          console.error('[Chat Poll] 🚨 CRITICAL: Bot missing required OAuth scopes!')
          console.error('[Chat Poll] 🚨 Required scopes: channels:history, channels:read')
          console.error('[Chat Poll] 🚨 Fix steps:')
          console.error('[Chat Poll] 🚨   1. Go to https://api.slack.com/apps → Select your app')
          console.error('[Chat Poll] 🚨   2. Navigate to "OAuth & Permissions" → "Bot Token Scopes"')
          console.error('[Chat Poll] 🚨   3. Add these scopes: channels:history, channels:read, chat:write')
          console.error('[Chat Poll] 🚨   4. Click "Reinstall to Workspace" (IMPORTANT!)')
          console.error('[Chat Poll] 🚨   5. Copy the NEW Bot User OAuth Token (starts with xoxb-)')
          console.error('[Chat Poll] 🚨   6. Update SLACK_BOT_TOKEN in Vercel with the new token')
          console.error('[Chat Poll] 🚨   7. Redeploy your Vercel project')
          
          // Return explicit error for missing_scope
          return NextResponse.json({
            success: false,
            messages: [],
            cursor: cursor,
            error: 'missing_scope',
            errorMessage: 'Bot is missing channels:history scope. Messages can be sent but replies cannot be fetched. Add channels:history scope in Slack app settings, reinstall the app, and update SLACK_BOT_TOKEN in Vercel.',
          }, { status: 403 })
        } else if (resp.error === 'invalid_arguments') {
          console.error('[Chat Poll] 🚨 CRITICAL: Invalid arguments to conversations.replies!')
          console.error('[Chat Poll] 🚨 Attempting fallback: using conversations.history with thread filter...')
          
          // Fallback: Try using conversations.history and filter by thread_ts
          // This works when conversations.replies fails due to invalid_arguments
          try {
            const threadTsFloat = parseFloat(threadTsString)
            const fallbackResp = await slackApi('conversations.history', slackBotToken, {
              channel: String(verified.channelId).trim(),
              oldest: String(threadTsFloat - 3600), // 1 hour before thread (as string)
              latest: String(Date.now() / 1000), // Now (as string)
              limit: 200,
            }, 8000) as any
            
            if (fallbackResp.ok && fallbackResp.messages && Array.isArray(fallbackResp.messages)) {
              // Filter messages that belong to this thread
              // A message is in the thread if:
              // 1. Its thread_ts matches the thread timestamp, OR
              // 2. Its ts matches the thread timestamp (it's the parent message)
              const threadMessages = fallbackResp.messages.filter((m: any) => {
                const msgThreadTs = m.thread_ts ? String(m.thread_ts) : null
                const msgTs = m.ts ? String(m.ts) : null
                return (msgThreadTs === threadTsString) || (msgTs === threadTsString)
              })
              
              console.log('[Chat Poll] ✅ Fallback successful! Found', threadMessages.length, 'messages in thread (out of', fallbackResp.messages.length, 'total)')
              
              if (threadMessages.length > 0) {
                // Use fallback messages - modify resp to continue processing
                resp.ok = true
                resp.messages = threadMessages
                resp.error = undefined // Clear error since fallback worked
                console.log('[Chat Poll] 🔄 Using fallback method - processing', threadMessages.length, 'messages')
              } else {
                console.warn('[Chat Poll] ⚠️ Fallback found no thread messages')
                return NextResponse.json({
                  success: true,
                  messages: [],
                  cursor: cursor,
                  error: 'Thread not found or empty',
                })
              }
            } else {
              const fallbackError = fallbackResp.error || 'Unknown error'
              console.error('[Chat Poll] ❌ Fallback also failed:', fallbackError)
              
              if (fallbackError === 'missing_scope') {
                console.error('[Chat Poll] 🚨 CRITICAL: Bot missing channels:history scope!')
                console.error('[Chat Poll] 🚨 Both conversations.replies AND conversations.history failed due to missing_scope')
                console.error('[Chat Poll] 🚨 This means the bot token does NOT have channels:history scope')
                console.error('[Chat Poll] 🚨 Fix: Add channels:history scope → Reinstall App → Update SLACK_BOT_TOKEN in Vercel')
              }
              
              // For missing_scope, return a more explicit error so the widget knows what's wrong
              if (fallbackError === 'missing_scope') {
                return NextResponse.json({
                  success: false,
                  messages: [],
                  cursor: cursor,
                  error: 'missing_scope',
                  errorMessage: 'Bot is missing channels:history scope. Messages can be sent but replies cannot be fetched. Add channels:history scope in Slack app settings, reinstall the app, and update SLACK_BOT_TOKEN in Vercel.',
                }, { status: 403 })
              }
              
              return NextResponse.json({
                success: true,
                messages: [],
                cursor: cursor,
                error: `Slack API error: ${fallbackError}`,
                warning: resp.warning,
              })
            }
          } catch (fallbackError) {
            console.error('[Chat Poll] ❌ Fallback error:', fallbackError)
            return NextResponse.json({
              success: true,
              messages: [],
              cursor: cursor,
              error: resp.error,
              warning: resp.warning,
            })
          }
        } else {
          // For other errors, return empty but still indicate there was an error
          return NextResponse.json({
            success: true,
            messages: [],
            cursor: cursor,
            error: resp.error,
            errorMessage: resp.error ? `Slack API error: ${resp.error}` : undefined,
            warning: resp.warning,
          })
        }
      }
      
      // If we got here and resp.ok is still false, return empty
      if (!resp.ok) {
        return NextResponse.json({
          success: true,
          messages: [],
          cursor: cursor,
          error: resp.error,
          warning: resp.warning,
        })
      }
      
      if (!resp.messages || !Array.isArray(resp.messages)) {
        console.warn('[Chat Poll] Invalid response format, returning empty')
        return NextResponse.json({
          success: true,
          messages: [],
          cursor: cursor,
        })
      }
      
      console.log(`[Chat Poll] ✅ Fetched ${resp.messages.length} messages from thread ${threadTsString}`)
      console.log(`[Chat Poll] 📋 All messages in thread:`, resp.messages.map((m: any) => ({
        ts: m.ts,
        user: m.user,
        bot_id: m.bot_id,
        text: m.text?.substring(0, 50),
        thread_ts: m.thread_ts,
        subtype: m.subtype,
        metadata: m.metadata,
        isThreadStarter: m.ts === threadTsString,
        isAfterCursor: cursor ? parseFloat(m.ts) > parseFloat(cursor) : true,
        cursorComparison: cursor ? `${parseFloat(m.ts)} > ${parseFloat(cursor)} = ${parseFloat(m.ts) > parseFloat(cursor)}` : 'no cursor',
      })))
      
      // Filter for agent messages (exclude visitor messages and thread starter)
      const agentMessages = resp.messages
        .filter((m) => {
          if (!m.ts) {
            console.log(`[Chat Poll] ⏭️ Skipping message: no ts`)
            return false
          }
          
          // Skip the thread starter message itself
          if (m.ts === threadTsString) {
            console.log(`[Chat Poll] ⏭️ Skipping thread starter: ${m.ts}`)
            return false
          }
          
          // Skip messages we've already seen
          // Use strict comparison: only skip if timestamp is strictly less than or equal to cursor
          // Add small epsilon to handle floating point precision issues
          if (cursor) {
            const msgTs = parseFloat(m.ts)
            const cursorTs = parseFloat(cursor)
            // Only skip if message timestamp is clearly older than cursor (with 0.1s buffer for precision)
            if (msgTs <= cursorTs + 0.1) {
              console.log(`[Chat Poll] ⏭️ Skipping already seen message: ${m.ts} (cursor: ${cursor}, diff: ${msgTs - cursorTs}s)`)
              return false
            } else {
              console.log(`[Chat Poll] ✅ Message is new: ${m.ts} > cursor ${cursor} (diff: ${msgTs - cursorTs}s)`)
            }
          }
          
          // Skip bot-posted visitor messages (identified by metadata)
          const isVisitorMeta = m.metadata?.event_type === 'webchat_message' && 
                               m.metadata?.event_payload?.sender === 'visitor'
          if (isVisitorMeta) {
            console.log(`[Chat Poll] ⏭️ Skipping visitor message: ${m.ts}`)
            return false
          }
          
          // Skip messages that are clearly bot/system messages (but allow user messages with some subtypes)
          // Allow messages with subtypes like 'thread_broadcast' (when agent replies and also sends to channel)
          const allowedSubtypes = ['thread_broadcast']
          if (m.subtype && !allowedSubtypes.includes(m.subtype)) {
            console.log(`[Chat Poll] ⏭️ Skipping message with subtype: ${m.ts} (subtype: ${m.subtype})`)
            return false
          }
          
          // Must have a user ID (real human user, not a bot)
          // Bot messages have bot_id but no user, or have user but it's a bot user
          // Real user messages have user ID and no bot_id (or bot_id is null/undefined)
          if (!m.user) {
            console.log(`[Chat Poll] ⏭️ Skipping message without user: ${m.ts} (bot_id: ${m.bot_id})`)
            return false
          }
          
          // Skip if it's a bot message (has bot_id and no real user context)
          // But allow if it's a thread_broadcast from a user (those can have bot_id but are still user messages)
          // IMPORTANT: Allow messages with user ID even if they have bot_id (some integrations set both)
          // Only skip if there's NO user ID AND there's a bot_id
          if (m.bot_id && !m.user && m.subtype !== 'thread_broadcast') {
            console.log(`[Chat Poll] ⏭️ Skipping bot message: ${m.ts} (user: ${m.user || 'none'}, bot_id: ${m.bot_id}, subtype: ${m.subtype})`)
            return false
          }
          
          // If message has both user and bot_id, it's likely an agent message posted via integration
          // Allow it through
          if (m.user && m.bot_id) {
            console.log(`[Chat Poll] ✅ Allowing message with both user and bot_id (likely agent via integration): ${m.ts} (user: ${m.user}, bot_id: ${m.bot_id})`)
          }
          
          // Must have text
          if (!m.text || m.text.trim().length === 0) {
            console.log(`[Chat Poll] ⏭️ Skipping empty message: ${m.ts}`)
            return false
          }
          
          console.log(`[Chat Poll] ✅ Keeping agent message: ${m.ts} from user ${m.user} (subtype: ${m.subtype || 'none'}, bot_id: ${m.bot_id || 'none'})`)
          return true
        })
        .map((m) => ({
          id: m.ts!,
          ts: m.ts!,
          text: (m.text || '').replace(/^<@[^>]+>\s*/g, '').trim(),
        }))
      
      // Set cursor to the latest message timestamp (highest ts value)
      // This ensures we don't miss messages that arrive between polls
      let newCursor = cursor
      if (agentMessages.length > 0) {
        // Find the message with the highest timestamp
        const latestMessage = agentMessages.reduce((latest, current) => {
          return parseFloat(current.ts) > parseFloat(latest.ts) ? current : latest
        })
        newCursor = latestMessage.ts
        console.log(`[Chat Poll] 📍 Setting cursor to latest message: ${newCursor} (from ${agentMessages.length} new messages)`)
      } else if (resp.messages.length > 0) {
        // Even if no agent messages, update cursor to latest message in thread to avoid re-checking old messages
        // But only if we have messages - this handles the case where all messages are filtered out
        const allTimestamps = resp.messages
          .map((m: any) => m.ts)
          .filter((ts: string) => ts && parseFloat(ts) > parseFloat(threadTsString))
          .sort((a: string, b: string) => parseFloat(b) - parseFloat(a))
        
        if (allTimestamps.length > 0 && cursor) {
          const latestTs = allTimestamps[0]
          const cursorTs = parseFloat(cursor)
          const latestTsNum = parseFloat(latestTs)
          
          // Only update cursor if latest message is newer than current cursor
          if (latestTsNum > cursorTs) {
            newCursor = latestTs
            console.log(`[Chat Poll] 📍 Updating cursor to latest thread message (even though filtered): ${newCursor}`)
          }
        }
      }
      
      // Log detailed filtering breakdown
      const filteredBreakdown = {
        totalMessages: resp.messages.length,
        skippedThreadStarter: resp.messages.filter((m: any) => m.ts === threadTsString).length,
        skippedByCursor: cursor ? resp.messages.filter((m: any) => m.ts && parseFloat(m.ts) <= parseFloat(cursor) + 0.1).length : 0,
        skippedVisitor: resp.messages.filter((m: any) => m.metadata?.event_type === 'webchat_message' && m.metadata?.event_payload?.sender === 'visitor').length,
        skippedNoUser: resp.messages.filter((m: any) => !m.user).length,
        skippedBot: resp.messages.filter((m: any) => m.bot_id && m.subtype !== 'thread_broadcast').length,
        skippedEmpty: resp.messages.filter((m: any) => !m.text || m.text.trim().length === 0).length,
        skippedSubtype: resp.messages.filter((m: any) => m.subtype && !['thread_broadcast'].includes(m.subtype)).length,
        kept: agentMessages.length,
      }
      
      console.log(`[Chat Poll] 📊 Filtering results:`, {
        ...filteredBreakdown,
        cursor: cursor || 'none',
        newCursor: newCursor || 'none',
        agentMessageDetails: agentMessages.map(m => ({ id: m.id, text: m.text.substring(0, 50), ts: m.ts })),
      })
      
      // If we have messages but none passed filtering, log a warning
      if (resp.messages.length > 0 && agentMessages.length === 0 && cursor) {
        console.warn(`[Chat Poll] ⚠️ WARNING: ${resp.messages.length} messages in thread but none passed filtering!`)
        console.warn(`[Chat Poll] ⚠️ This might indicate: 1) All messages are before cursor, 2) All messages are visitor messages, 3) All messages are bot messages`)
        console.warn(`[Chat Poll] ⚠️ Current cursor: ${cursor}, Thread messages:`, resp.messages.map((m: any) => ({
          ts: m.ts,
          user: m.user || 'none',
          bot_id: m.bot_id || 'none',
          text: m.text?.substring(0, 30) || 'empty',
          isAfterCursor: parseFloat(m.ts) > parseFloat(cursor),
        })))
      }
      
      return NextResponse.json({
        success: true,
        messages: agentMessages,
        cursor: newCursor,
      })
    } catch (error) {
      // On any error, return empty messages instead of failing
      console.warn('[Chat Poll] Error fetching messages (returning empty):', error instanceof Error ? error.message : error)
      return NextResponse.json({
        success: true,
        messages: [],
        cursor: cursor,
      })
    }
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

