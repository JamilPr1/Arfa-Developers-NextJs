// Form submission handler for lead capture
// Integrate with your backend API, HubSpot, or email service

export interface LeadData {
  name: string
  email: string
  company: string
  projectType: string
  message: string
  source?: string
  region?: string
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; message: string }> {
  try {
    // TODO: Replace with your actual API endpoint
    // Example: HubSpot, Pipedrive, or custom backend
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to submit lead')
    }

    // Send notification to Slack/Email (implement in your backend)
    // await sendNotification(data)

    return { success: true, message: 'Thank you! We\'ll get back to you soon.' }
  } catch (error) {
    console.error('Error submitting lead:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}

// Detect user region based on timezone/IP
export function detectRegion(): string {
  if (typeof window === 'undefined') return 'US'
  
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  if (timezone.includes('America')) return 'US'
  if (timezone.includes('Europe/London')) return 'UK'
  if (timezone.includes('Asia/Qatar')) return 'Qatar'
  if (timezone.includes('Asia/Riyadh')) return 'KSA'
  
  return 'US' // Default
}
