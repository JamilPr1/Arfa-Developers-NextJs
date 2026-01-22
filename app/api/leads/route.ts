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

// Send Slack notification (optional)
async function sendSlackNotification(data: LeadData): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.warn('[Slack] ⚠️ SLACK_WEBHOOK_URL not configured in environment variables')
    return
  }

  console.log('[Slack] Sending notification to webhook...')
  try {
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🎯 New Lead: ${data.name} (${data.email}) - ${data.projectType}`,
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
                text: `*Phone:*\n${data.company || 'N/A'}`,
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
        ],
      }),
    })

    const responseText = await response.text()
    
    if (!response.ok) {
      console.error('[Slack] ❌ Webhook request failed:', response.status, responseText)
      throw new Error(`Slack webhook failed: ${response.status} - ${responseText}`)
    }

    console.log('[Slack] ✅ Notification sent successfully. Response:', responseText)
  } catch (error) {
    console.error('[Slack] ❌ Notification error:', error)
    throw error
  }
}

// Send email directly using Resend API (free tier available)
async function sendDirectEmail(data: LeadData): Promise<{ success: boolean }> {
  const recipientEmail = 'jawadparvez.dev@gmail.com'
  
  // Use Resend API if API key is provided, otherwise use a simple email service
  if (process.env.RESEND_API_KEY) {
    console.log('[Email] Using Resend API...')
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@arfadevelopers.com',
          to: recipientEmail,
          subject: `🎯 New Lead: ${data.name} - ${data.projectType || 'General Inquiry'}`,
          html: `
            <h2>New Lead Submission from Website</h2>
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
              <p><strong>Project Type:</strong> ${data.projectType || 'N/A'}</p>
              <p><strong>Region:</strong> ${data.region || 'US'}</p>
              <hr style="margin: 20px 0;">
              <p><strong>Message:</strong></p>
              <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${data.message || 'No message provided'}</p>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">Submitted from: ${data.source || 'website-form'}</p>
            </div>
          `,
        }),
      })

      const responseData = await response.json()
      
      if (response.ok) {
        console.log('[Email] ✅ Resend API success:', responseData)
        return { success: true }
      } else {
        console.error('[Email] ❌ Resend API failed:', response.status, responseData)
        return { success: false, error: responseData }
      }
    } catch (error) {
      console.error('[Email] ❌ Resend API error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Fallback: Use SendGrid if configured
  if (process.env.SENDGRID_API_KEY) {
    try {
      const assignedManager = assignLeadByRegion(data.region)
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: recipientEmail }],
              subject: `🎯 New Lead: ${data.name} - ${data.projectType || 'General Inquiry'}`,
            },
          ],
          from: { email: process.env.EMAIL_FROM || 'noreply@arfadevelopers.com', name: 'Arfa Developers' },
          content: [
            {
              type: 'text/html',
              value: `
                <h2>New Lead Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
                <p><strong>Project Type:</strong> ${data.projectType || 'N/A'}</p>
                <p><strong>Region:</strong> ${data.region || 'US'}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${data.message || 'No message provided'}</p>
              `,
            },
          ],
        }),
      })

      if (response.ok) {
        console.log('[Email] ✅ SendGrid API success')
        return { success: true }
      } else {
        const errorText = await response.text()
        console.error('[Email] ❌ SendGrid API failed:', response.status, errorText)
      }
    } catch (error) {
      console.error('[Email] ❌ SendGrid error:', error)
    }
  }

  // If no email service configured, log the lead (for development)
  console.warn('[Email] ⚠️ No email service configured (RESEND_API_KEY or SENDGRID_API_KEY missing)')
  console.log('📧 LEAD SUBMISSION (Email service not configured):', {
    to: recipientEmail,
    name: data.name,
    email: data.email,
    company: data.company,
    projectType: data.projectType,
    message: data.message,
  })

  // Return success even without email service (for development)
  // In production, you should configure an email service
  return { success: true }
}

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

    // Send email directly to jawadparvez.dev@gmail.com
    console.log('[Leads API] Attempting to send email...')
    const emailResult = await sendDirectEmail(leadDataWithMessage)
    console.log('[Leads API] Email result:', emailResult)

    // Send Slack notification (optional)
    console.log('[Leads API] Attempting to send Slack notification...')
    let slackSent = false
    try {
      await sendSlackNotification(leadDataWithMessage)
      slackSent = true
      console.log('[Leads API] Slack notification sent')
    } catch (error) {
      console.error('[Leads API] Slack notification error:', error)
    }

    // Log for debugging
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL
    console.log('[Leads API] Lead submitted:', {
      name: leadDataWithMessage.name,
      email: leadDataWithMessage.email,
      company: leadDataWithMessage.company,
      projectType: leadDataWithMessage.projectType,
      region: leadDataWithMessage.region,
      emailSent: emailResult.success,
      slackSent: slackSent,
      assignedTo: assignLeadByRegion(leadDataWithMessage.region),
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasSendGridKey: !!process.env.SENDGRID_API_KEY,
      hasSlackWebhook: !!slackWebhookUrl,
      slackWebhookUrl: slackWebhookUrl ? slackWebhookUrl.substring(0, 50) + '...' : 'NOT SET',
    })

    // Return success even if email fails (to not block user experience)
    // But log the issue for debugging
    if (!emailResult.success) {
      console.warn('[Leads API] ⚠️ Email sending failed, but continuing...')
    }

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
