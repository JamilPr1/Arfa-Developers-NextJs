'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import NextLink from 'next/link'
import { siteConfig } from '@/lib/siteConfig'
import ArfaLogo from '@/components/ArfaLogo'

const productLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'AI Automation', href: '/ai-automation' },
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Case Studies', href: '/case-studies' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Free Audit', href: '/free-audit' },
  { label: 'Contact', href: '/contact' },
  { label: 'Join Our Team', href: '/join-our-team' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link component={NextLink} color="text.secondary" href="/">
        Arfa Developers
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

/** Official Marketing Footer layout with Arfa links. */
export default function MarketingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: { xs: 4, sm: 6 },
          py: { xs: 6, sm: 8 },
          textAlign: 'left',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: { xs: 4, md: 3 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: { md: '1 1 34%' },
              maxWidth: { md: 380 },
              alignItems: 'flex-start',
              textAlign: 'left',
            }}
          >
            <ArfaLogo height={36} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.7,
                textAlign: 'left',
                width: '100%',
              }}
            >
              US-focused web development agency. Project rescue, Next.js/React apps, AI voice
              agents, LLM integrations, and business automation.
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {siteConfig.phoneDisplay}
              </Typography>
              <IconButton
                component="a"
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                size="small"
                sx={{
                  color: '#25D366',
                  p: 0.5,
                  '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.12)' },
                }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack spacing={0.25} sx={{ alignItems: 'flex-start' }}>
              <Link
                href={`mailto:${siteConfig.contactEmail}`}
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                {siteConfig.contactEmail}
              </Link>
              <Link
                href={`mailto:${siteConfig.contactEmailAlt}`}
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                {siteConfig.contactEmailAlt}
              </Link>
            </Stack>

            <Button
              component={NextLink}
              href="/contact"
              variant="contained"
              color="primary"
              size="small"
              sx={{ alignSelf: 'flex-start', width: 'fit-content', mt: 0.5 }}
            >
              Free Consultation
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Product
            </Typography>
            {productLinks.map((l) => (
              <Link key={l.href} component={NextLink} color="text.secondary" href={l.href} variant="body2">
                {l.label}
              </Link>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            {companyLinks.map((l) => (
              <Link key={l.href} component={NextLink} color="text.secondary" href={l.href} variant="body2">
                {l.label}
              </Link>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Legal
            </Typography>
            {legalLinks.map((l) => (
              <Link key={l.href} component={NextLink} color="text.secondary" href={l.href} variant="body2">
                {l.label}
              </Link>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: { xs: 2, sm: 3 },
            width: '100%',
            borderTop: '1px solid',
            borderColor: 'divider',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Copyright />
          <Stack direction="row" spacing={0.5} useFlexGap sx={{ color: 'text.secondary' }}>
            <IconButton
              color="inherit"
              size="small"
              href={siteConfig.social.facebook}
              aria-label="Arfa Developers on Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              href={siteConfig.social.linkedin}
              aria-label="Arfa Developers on LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              href={siteConfig.social.instagram}
              aria-label="Arfa Developers on Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
