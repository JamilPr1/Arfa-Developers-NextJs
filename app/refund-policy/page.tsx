import type { Metadata } from 'next'
import { Box, Container, Typography } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Refund / Cancellation Policy | Arfa Developers',
  description: 'Refund and Cancellation Policy for Arfa Developers. Learn about our refund terms and cancellation procedures.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 8, md: 10 }, pb: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, color: '#1E3A8A' }}>
            Refund / Cancellation Policy
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Refund Policy
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151', lineHeight: 1.8 }}>
              We stand behind our work and want you to be satisfied with our services. Our refund policy is as follows:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
              • <strong>Before Work Begins:</strong> If you cancel before we begin work, you will receive a full refund of any deposits or payments made.<br />
              • <strong>During Development:</strong> If you cancel during development, you will be charged only for work completed up to the cancellation date. Any remaining balance will be refunded.<br />
              • <strong>After Completion:</strong> Once a project is completed and delivered, refunds are not available. However, we will fix any bugs or issues as specified in our warranty.<br />
              • <strong>Ongoing Services:</strong> Monthly services (SEO, maintenance, etc.) can be cancelled with 30 days notice. No refunds for the current billing period.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Cancellation Policy
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151', lineHeight: 1.8 }}>
              You may cancel a project or service at any time with written notice:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
              • <strong>Project Cancellation:</strong> Provide written notice via email. You will be responsible for payment of all work completed up to the cancellation date.<br />
              • <strong>Service Cancellation:</strong> For ongoing services, provide 30 days written notice. Services will continue until the end of the current billing period.<br />
              • <strong>No-Show Policy:</strong> If you fail to provide required information or feedback for more than 30 days, we reserve the right to pause or cancel the project.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Refund Processing
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              Approved refunds will be processed within 5-10 business days to the original payment method. Processing times may vary depending on your payment provider.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Disputes
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              If you have concerns about our work or service, please contact us immediately. We are committed to resolving issues and ensuring your satisfaction. Most issues can be resolved through communication and revisions.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              Contact
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              For refund or cancellation requests, please contact us at:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mt: 1, lineHeight: 1.8 }}>
              Email: info@arfadevelopers.com<br />
              Phone: +1 (516) 603-7838
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  )
}
