import { NextRequest, NextResponse } from 'next/server'
import type { LeadData } from '@/lib/formHandler'

// Lead assignment by region
function assignLeadByRegion(region?: string): string {
  const regionMap: Record<string, string> = {
    US: process.env.SALES_MANAGER_US || 'sales-us@arfadevelopers.com',
    UK: process.env.SALES_MANAGER_UK || 'sales-uk@arfadevelopers.com',
    Qatar: process.env.SALES_MANAGER_QATAR || 'sales-qatar@arfadevelopers.com',
    KSA: process.env.SALES_MANAGER_KSA || 'sales-ksa@arfadevelopers.com',
  }
  return regionMap[region || 'US'] || regionMap.US
}

// Slack API helper (same as chat route)
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
    console.log(`[Slack API] ${method} response:`, { ok: result.ok, error: result.error })
    return result as any
  } catch (error) {
    console.error('[Slack API] Network error:', error)
    throw error
  }
}

// Send Slack notification using Bot Token API (same as chat)
async function sendSlackNotification(data: LeadData): Promise<void> {
  const slackBotToken = process.env.SLACK_BOT_TOKEN
  const slackChannelId = process.env.SLACK_CHANNEL_ID || 'C0AA2KHR02Z'

  if (!slackBotToken) {
    console.warn('[Slack] ⚠️ SLACK_BOT_TOKEN not configured in environment variables')
    throw new Error('SLACK_BOT_TOKEN not configured')
  }

  console.log('[Slack] Sending lead notification to channel:', slackChannelId)
  
  try {
    // Format message with lead details
    const messageText = `🎯 *New Lead Submission*\n\n` +
      `*Name:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Company/Phone:* ${data.company || 'N/A'}\n` +
      `*Project Type:* ${data.projectType || 'N/A'}\n` +
      `*Region:* ${data.region || 'US'}\n` +
      `*Assigned To:* ${assignLeadByRegion(data.region)}\n` +
      `*Source:* ${data.source || 'website-form'}\n\n` +
      `*Message:*\n${data.message || 'No message provided'}`

    const result = await slackApi('chat.postMessage', slackBotToken, {
      channel: slackChannelId,
      text: `🎯 New Lead: ${data.name} (${data.email}) - ${data.projectType || 'General Inquiry'}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New Lead Submission',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Name:*\n${data.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email}`,
            },
            {
              type: 'mrkdwn',
              text: `*Company/Phone:*\n${data.company || 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Project Type:*\n${data.projectType || 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Region:*\n${data.region || 'US'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Assigned To:*\n${assignLeadByRegion(data.region)}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${data.message || 'No message provided'}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Source: ${data.source || 'website-form'}`,
            },
          ],
        },
      ],
    })

    if (!result.ok) {
      console.error('[Slack] ❌ Message post failed:', result.error)
      throw new Error(`Slack API error: ${result.error || 'Failed to send message'}`)
    }

    console.log('[Slack] ✅ Notification sent successfully to channel:', slackChannelId)
  } catch (error) {
    console.error('[Slack] ❌ Notification error:', error)
    throw error
  }
}

// Email submission removed - only sending to Slack

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json()

    console.log('[Leads API] Received lead data:', {
      name: data.name,
      email: data.email,
      company: data.company,
      projectType: data.projectType,
      message: data.message,
      source: data.source,
      region: data.region,
    })

    // Validate required fields (allow "Not provided" as valid values)
    const hasName = data.name && data.name.trim() && data.name !== 'Not provided'
    const hasEmail = data.email && data.email.trim() && data.email !== 'Not provided'
    const hasMessage = data.message && data.message.trim() && data.message !== 'Not provided'

    if (!hasName || !hasEmail) {
      console.error('[Leads API] Validation failed - missing name or email:', { hasName, hasEmail })
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Ensure message exists (use default if not provided)
    const finalMessage = hasMessage ? data.message : (data.message || 'No message provided')

    // Prepare data with final message
    const leadDataWithMessage = {
      ...data,
      message: finalMessage,
    }

    // Send Slack notification only (email removed)
    console.log('[Leads API] Attempting to send Slack notification...')
    let slackSent = false
    try {
      await sendSlackNotification(leadDataWithMessage)
      slackSent = true
      console.log('[Leads API] ✅ Slack notification sent successfully')
    } catch (error) {
      console.error('[Leads API] ❌ Slack notification error:', error)
      // Still return success to not block user experience
    }

    // Log for debugging
    const slackBotToken = process.env.SLACK_BOT_TOKEN
    const slackChannelId = process.env.SLACK_CHANNEL_ID || 'C0AA2KHR02Z'
    console.log('[Leads API] Lead submitted:', {
      name: leadDataWithMessage.name,
      email: leadDataWithMessage.email,
      company: leadDataWithMessage.company,
      projectType: leadDataWithMessage.projectType,
      region: leadDataWithMessage.region,
      slackSent: slackSent,
      assignedTo: assignLeadByRegion(leadDataWithMessage.region),
      hasSlackBotToken: !!slackBotToken,
      slackChannelId: slackChannelId,
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll get back to you within 24 hours.',
    })
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
