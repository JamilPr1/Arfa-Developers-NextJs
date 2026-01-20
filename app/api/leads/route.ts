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

// HubSpot CRM Integration (Free Tier Compatible)
async function createHubSpotContact(data: LeadData): Promise<{ success: boolean; contactId?: string }> {
  if (!process.env.HUBSPOT_API_KEY) {
    console.warn('HubSpot API key not configured')
    return { success: false }
  }

  try {
    const nameParts = data.name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Use only standard HubSpot properties (free tier compatible)
    // Standard properties: email, firstname, lastname, company, phone, website, lifecyclestage, lead_status
    const contactProperties: Record<string, string> = {
      email: data.email,
      firstname: firstName,
      lastname: lastName,
      company: data.company || '',
      lifecyclestage: 'lead', // Mark as lead
    }

    // Add message to notes field if available (standard property)
    // For free tier, we'll include key info in the company description or use notes
    const noteContent = `Project Type: ${data.projectType || 'N/A'}\nRegion: ${data.region || 'US'}\nSource: ${data.source || 'website'}\n\nMessage:\n${data.message || 'No message'}`

    // Create or update contact in HubSpot (free tier supports this)
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: contactProperties,
      }),
    })

    if (!response.ok) {
      // If contact already exists (409), try to update it
      if (response.status === 409) {
        // Get existing contact by email
        const searchResponse = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(data.email)}?idProperty=email`,
          {
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            },
          }
        )

        if (searchResponse.ok) {
          const existingContact = await searchResponse.json()
          const contactId = existingContact.id

          // Update the contact
          await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              properties: {
                company: data.company || existingContact.properties.company || '',
              },
            }),
          })

          // Create a note (free tier supports basic notes)
          try {
            await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                properties: {
                  hs_note_body: noteContent,
                  hs_timestamp: new Date().toISOString(),
                },
                associations: [
                  {
                    to: { id: contactId },
                    types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }],
                  },
                ],
              }),
            })
          } catch (noteError) {
            // Note creation is optional, don't fail if it doesn't work
            console.warn('Could not create note:', noteError)
          }

          return { success: true, contactId }
        }
      }

      const errorData = await response.text()
      console.error('HubSpot API error:', errorData)
      return { success: false }
    }

    const result = await response.json()
    const contactId = result.id

    // Create a note with the message (free tier supports basic notes)
    try {
      await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            hs_note_body: noteContent,
            hs_timestamp: new Date().toISOString(),
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }],
            },
          ],
        }),
      })
    } catch (noteError) {
      // Note creation is optional, don't fail if it doesn't work
      console.warn('Could not create note:', noteError)
    }

    return { success: true, contactId }
  } catch (error) {
    console.error('HubSpot integration error:', error)
    return { success: false }
  }
}

// Send Slack notification
async function sendSlackNotification(data: LeadData): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not configured')
    return
  }

  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
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
                text: `*Company:*\n${data.company || 'N/A'}`,
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
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View in HubSpot',
                },
                url: process.env.HUBSPOT_PORTAL_ID
                  ? `https://app.hubspot.com/contacts/${process.env.HUBSPOT_PORTAL_ID}/contact/${data.email}`
                  : `https://app.hubspot.com/contacts/list/all/view/all/?email=${encodeURIComponent(data.email)}`,
                style: 'primary',
              },
            ],
          },
        ],
      }),
    })
  } catch (error) {
    console.error('Slack notification error:', error)
  }
}

// Send email notification (using a simple email service)
async function sendEmailNotification(data: LeadData): Promise<void> {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_TO) {
    console.warn('Email service not configured')
    return
  }

  try {
    const assignedManager = assignLeadByRegion(data.region)

    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: process.env.EMAIL_TO }],
            cc: assignedManager ? [{ email: assignedManager }] : [],
            subject: `🎯 New Lead: ${data.name} - ${data.projectType}`,
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
              <p><strong>Assigned To:</strong> ${assignedManager}</p>
              <hr>
              <p><strong>Message:</strong></p>
              <p>${data.message || 'No message provided'}</p>
            `,
          },
        ],
      }),
    })
  } catch (error) {
    console.error('Email notification error:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create contact in HubSpot CRM
    const hubspotResult = await createHubSpotContact(data)

    // Send notifications (run in parallel, don't wait for completion)
    Promise.all([
      sendSlackNotification(data),
      sendEmailNotification(data),
    ]).catch((error) => {
      console.error('Notification error:', error)
    })

    // Log for debugging
    console.log('Lead submitted:', {
      name: data.name,
      email: data.email,
      company: data.company,
      projectType: data.projectType,
      region: data.region,
      hubspotSuccess: hubspotResult.success,
      assignedTo: assignLeadByRegion(data.region),
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ll get back to you within 24 hours.',
      contactId: hubspotResult.contactId,
    })
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
