import type { Metadata } from 'next'
import { Box, Container, Typography } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Privacy Policy | Arfa Developers',
  description: 'Privacy Policy for Arfa Developers. Learn how we collect, use, and protect your personal information.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <Box component="main" sx={{ pt: { xs: 8, md: 10 }, pb: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, color: '#1E3A8A' }}>
            Privacy Policy
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151', lineHeight: 1.8 }}>
              We collect information that you provide directly to us, including:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
              • Name and contact information (email, phone number)<br />
              • Company information<br />
              • Project details and requirements<br />
              • Payment information (processed securely through third-party providers)<br />
              • Communication records
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151', lineHeight: 1.8 }}>
              We use the information we collect to:
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
              • Provide, maintain, and improve our services<br />
              • Process transactions and send related information<br />
              • Send technical notices, updates, and support messages<br />
              • Respond to your comments and questions<br />
              • Monitor and analyze trends and usage
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              3. Information Sharing
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only with trusted service providers who assist us in operating our business, conducting our business, or serving our users, as long as those parties agree to keep this information confidential.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              4. Data Security
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              5. Your Rights
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              You have the right to access, update, or delete your personal information. You may also opt-out of certain communications from us. To exercise these rights, please contact us.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              6. Cookies
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              7. Changes to This Policy
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
              8. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
              If you have any questions about this Privacy Policy, please contact us at:
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
