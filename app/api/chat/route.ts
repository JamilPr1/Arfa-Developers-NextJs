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
  leadInfo?: {
    projectType?: string
    timeline?: string
    budget?: string
    name?: string
    email?: string
    projectDetails?: string
  }
}

type SlackPostMessageResponse = { ok: boolean; ts?: string; error?: string }

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
    const result = await resp.json()
    console.log(`[Slack API] ${method} response:`, { ok: result.ok, error: result.error, hasTs: !!result.ts })
    return result as any
  } catch (error) {
    console.error('[Slack API] Network error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatMessage = await request.json()
    const { message, timestamp, sessionId, pageUrl, token, leadInfo } = body

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
    // Default channel: C0AA2KHR02Z (support-team-channel) - can be overridden via SLACK_CHANNEL_ID env var
    const slackChannelId = process.env.SLACK_CHANNEL_ID || 'C0AA2KHR02Z'
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

    // Validate channel access before attempting to post messages
    if (!token) {
      // Only check channel access on first message (when creating new thread)
      try {
        const channelInfo = (await slackApi('conversations.info', slackBotToken, {
          channel: slackChannelId,
        })) as any
        
        if (!channelInfo.ok) {
          console.error('[Chat API] ❌ Channel access check failed:', {
            error: channelInfo.error,
            channel: slackChannelId,
            hasEnvVar: !!process.env.SLACK_CHANNEL_ID,
          })
          
          if (channelInfo.error === 'channel_not_found') {
            return NextResponse.json({
              success: false,
              error: `Channel not found (${slackChannelId}). Please ensure: 1) The bot is added to the channel, 2) The channel ID is correct, 3) Update SLACK_CHANNEL_ID in Vercel to C0AA2KHR02Z (support-team-channel) and redeploy.`,
            }, { status: 404 })
          } else if (channelInfo.error === 'missing_scope') {
            return NextResponse.json({
              success: false,
              error: 'Bot is missing required scopes. Please add channels:read, channels:history, and chat:write to your Slack app, then REINSTALL the app to your workspace, copy the NEW bot token, and update SLACK_BOT_TOKEN in Vercel.',
            }, { status: 403 })
          } else if (channelInfo.error === 'invalid_arguments') {
            console.error('[Chat API] 🚨 Invalid arguments error - this may indicate:')
            console.error('[Chat API] 🚨   1. Channel ID format is incorrect')
            console.error('[Chat API] 🚨   2. Bot token is missing channels:read scope')
            console.error('[Chat API] 🚨   3. Channel ID does not exist in this workspace')
            // Continue - let the actual API call handle the error
          } else if (channelInfo.error === 'not_in_channel') {
            return NextResponse.json({
              success: false,
              error: `Bot is not a member of channel ${slackChannelId}. Add the bot to the channel using /invite @YourBotName, or set SLACK_CHANNEL_ID in Vercel to a channel where the bot is already a member.`,
            }, { status: 403 })
          }
        } else {
          console.log('[Chat API] ✅ Channel access verified:', {
            channel: slackChannelId,
            channelName: channelInfo.channel?.name,
            isMember: channelInfo.channel?.is_member,
          })
        }
      } catch (error) {
        console.warn('[Chat API] Channel access check failed (non-critical):', error)
        // Continue anyway - the actual API call will fail if there's a real issue
      }
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
      
      // Add lead information if available
      if (leadInfo && (leadInfo.projectType || leadInfo.timeline || leadInfo.budget || leadInfo.name || leadInfo.email || leadInfo.projectDetails)) {
        introBlocks.push({ type: 'divider' })
        introBlocks.push({
          type: 'header',
          text: { type: 'plain_text', text: '📋 Lead Information' },
        })
        
        // Contact Information (Name and Email) - Most Important
        if (leadInfo.name || leadInfo.email) {
          const contactFields: any[] = []
          if (leadInfo.name) {
            contactFields.push({ type: 'mrkdwn', text: `*Name:*\n${leadInfo.name}` })
          }
          if (leadInfo.email) {
            contactFields.push({ type: 'mrkdwn', text: `*Email:*\n${leadInfo.email}` })
          }
          if (contactFields.length > 0) {
            introBlocks.push({
              type: 'section',
              fields: contactFields,
            })
          }
        }
        
        // Project Information
        const leadFields: any[] = []
        if (leadInfo.projectType) {
          leadFields.push({ type: 'mrkdwn', text: `*Project Type:*\n${leadInfo.projectType}` })
        }
        if (leadInfo.timeline) {
          leadFields.push({ type: 'mrkdwn', text: `*Timeline:*\n${leadInfo.timeline}` })
        }
        if (leadInfo.budget) {
          leadFields.push({ type: 'mrkdwn', text: `*Budget:*\n${leadInfo.budget}` })
        }
        
        if (leadFields.length > 0) {
          introBlocks.push({
            type: 'section',
            fields: leadFields,
          })
        }
        
        if (leadInfo.projectDetails && leadInfo.projectDetails !== 'Skipped') {
          introBlocks.push({
            type: 'section',
            text: { type: 'mrkdwn', text: `*Project Details:*\n${leadInfo.projectDetails}` },
          })
        }
      }
      
      introBlocks.push({ type: 'divider' })

      console.log('[Chat API] Creating new chat thread in Slack:', {
        channel: slackChannelId,
        sessionId: safeSession,
      })
      
      const intro = (await slackApi('chat.postMessage', slackBotToken, {
        channel: slackChannelId,
        text: `New website chat (${safeSession})`,
        blocks: introBlocks,
      })) as SlackPostMessageResponse

      if (!intro.ok || !intro.ts) {
        console.error('[Chat API] Slack intro message error:', {
          error: intro.error,
          warning: (intro as any).warning,
          fullResponse: intro,
          channelId: slackChannelId,
        })
        
        // Provide helpful error messages
        let errorMessage = `Slack API error: ${intro.error || 'Failed to create chat thread'}`
        if (intro.error === 'channel_not_found') {
          errorMessage = `Channel not found (${slackChannelId}). Please ensure: 1) The bot is added to the channel, 2) The channel ID is correct, 3) Update SLACK_CHANNEL_ID in Vercel if using a different channel.`
        } else if (intro.error === 'missing_scope') {
          errorMessage = 'Bot is missing required scopes. Please add chat:write, channels:read, and channels:history to your Slack app, then REINSTALL the app to your workspace, copy the NEW bot token, and update SLACK_BOT_TOKEN in Vercel.'
        } else if (intro.error === 'not_in_channel') {
          errorMessage = `Bot is not a member of channel ${slackChannelId}. Add the bot to the channel using /invite @YourBotName`
        }
        
        return NextResponse.json({ 
          success: false, 
          error: errorMessage
        }, { status: 502 })
      }

      // Ensure threadTs is stored as a string (Slack returns it as string)
      threadTs = String(intro.ts)
      channelId = slackChannelId
      
      console.log('[Chat API] Thread created successfully:', {
        threadTs,
        channelId,
        threadTsType: typeof threadTs,
      })
    }

    // Post visitor message into the thread (as bot)
    console.log('[Chat API] Posting visitor message to Slack:', {
      channel: channelId,
      threadTs,
      messageLength: message.trim().length,
      sessionId: safeSession,
    })
    
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
      console.error('[Chat API] Slack message post error:', {
        error: msg.error,
        warning: (msg as any).warning,
        response: msg,
      })
      
      let errorMessage = `Slack API error: ${msg.error || 'Failed to send message'}`
      if (msg.error === 'missing_scope') {
        errorMessage = 'Bot is missing required scope: chat:write. Please add this scope to your Slack app, then REINSTALL the app to your workspace, copy the NEW bot token, and update SLACK_BOT_TOKEN in Vercel.'
      } else if (msg.error === 'channel_not_found') {
        errorMessage = `Channel not found (${channelId}). Please ensure: 1) The bot is added to the channel, 2) The channel ID is correct, 3) Set SLACK_CHANNEL_ID in Vercel to your channel ID and redeploy.`
      } else if (msg.error === 'not_in_channel') {
        errorMessage = `Bot is not a member of channel ${channelId}. Add the bot to the channel using /invite @YourBotName, or set SLACK_CHANNEL_ID in Vercel to a channel where the bot is already a member.`
      }
      
      return NextResponse.json({ 
        success: false, 
        error: errorMessage
      }, { status: 502 })
    }
    
    console.log('[Chat API] Message sent successfully to Slack:', { threadTs: msg.ts })

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
