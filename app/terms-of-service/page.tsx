import type { Metadata } from 'next'
import { Box, Container, Typography } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Terms of Service | Arfa Developers',
  description: 'Terms of Service for Arfa Developers. Read our terms and conditions for using our services.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 8, md: 10 }, pb: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, color: '#1E3A8A' }}>
            Terms of Service
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              By accessing and using the services of Arfa Developers, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              2. Services
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              Arfa Developers provides web development, design, and related technology services. All services are provided subject to these Terms of Service and any applicable service agreements.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              3. Payment Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151', lineHeight: 1.8 }}>
              Payment terms will be specified in your service agreement. Generally:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
              • Payment is due according to the schedule in your agreement<br />
              • Late payments may incur fees<br />
              • All prices are in USD unless otherwise specified<br />
              • Refunds are subject to our Refund Policy
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              4. Intellectual Property
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              Upon full payment, you will own the custom work created specifically for you. We retain rights to any pre-existing code, frameworks, or tools used in your project. We may use your project (with permission) as a portfolio example.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              5. Client Responsibilities
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151', lineHeight: 1.8 }}>
              Clients are responsible for:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
              • Providing accurate and complete information<br />
              • Timely feedback and approvals<br />
              • Payment according to agreed terms<br />
              • Maintaining backups of their data
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              6. Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              Arfa Developers shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with our services. Our total liability shall not exceed the amount paid by you for the specific service.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              7. Warranty
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              We warrant that our services will be performed in a professional and workmanlike manner. We provide support and bug fixes as specified in your service agreement. We do not guarantee specific results or outcomes.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              8. Termination
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              Either party may terminate a service agreement with written notice. Upon termination, you are responsible for payment of all work completed up to the termination date.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              9. Changes to Terms
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of modified terms.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              10. Contact
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              For questions about these Terms of Service, please contact us at:
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
