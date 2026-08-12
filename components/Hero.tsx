'use client'

import { Box, Container, Typography, Button, Link as MuiLink } from '@mui/material'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from 'next/link'
import { brand, gray } from '@/lib/theme/marketingPrimitives'

const quickLinks = [
  { label: 'Project Rescue', href: '/project-rescue' },
  { label: 'Free Website Audit', href: '/free-audit' },
  { label: 'Web Dev Agency USA', href: '/web-development-agency-usa' },
]

const tech = ['React', 'Next.js', 'Node.js', 'TypeScript']

export default function Hero() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '88vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 14, md: 16 },
        pb: { xs: 8, md: 12 },
        bgcolor: 'background.default',
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, ${brand[100]}, transparent),
          radial-gradient(ellipse 60% 40% at 100% 0%, ${brand[50]}, transparent)
        `,
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
            gap: { xs: 5, md: 6 },
            alignItems: 'center',
          }}
        >
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Typography
                component="p"
                sx={{
                  mb: 2,
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Arfa Developers
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  color: 'text.primary',
                  mb: 2.5,
                  fontWeight: 600,
                  fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
                  lineHeight: 1.15,
                  letterSpacing: -0.5,
                  maxWidth: 640,
                }}
                data-aos="fade-up"
                suppressHydrationWarning
              >
                US Web Development Agency —{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Project Rescue
                </Box>{' '}
                &amp; Custom Web Apps
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <Typography
                variant="h5"
                component="p"
                data-seo-lead
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  fontWeight: 400,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  lineHeight: 1.65,
                  maxWidth: 560,
                }}
                data-aos="fade-up"
                data-aos-delay="100"
                suppressHydrationWarning
              >
                We rescue failed freelancer and agency builds, fix broken websites, and ship
                production-ready Next.js/React applications for US businesses.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 4 }}>
                {quickLinks.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      border: `1px solid ${gray[200]}`,
                      borderRadius: '999px',
                      px: 1.75,
                      py: 0.85,
                      bgcolor: 'background.paper',
                      '&:hover': { borderColor: gray[300], bgcolor: gray[50] },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavClick('#contact')}
                data-aos="fade-up"
                data-aos-delay="200"
                suppressHydrationWarning
              >
                Get a Free Consultation
              </Button>
              <Button
                component={Link}
                href="/free-audit"
                variant="outlined"
                size="large"
                data-aos="fade-up"
                data-aos-delay="300"
                suppressHydrationWarning
              >
                Free Website Audit
              </Button>
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 3,
                border: `1px solid ${gray[200]}`,
                bgcolor: '#fff',
                p: { xs: 3, md: 4 },
                boxShadow: 1,
                overflow: 'hidden',
              }}
              data-aos="fade-left"
              suppressHydrationWarning
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${brand[400]}, ${gray[800]})`,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Built for production
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                Modern stack, clean architecture, and shipping discipline — so your product works
                in the real world, not just the demo.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tech.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.5,
                      py: 0.85,
                      borderRadius: 2,
                      border: `1px solid ${gray[200]}`,
                      bgcolor: gray[50],
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  mt: 3.5,
                  pt: 3,
                  borderTop: `1px solid ${gray[200]}`,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                }}
              >
                {[
                  { value: 'USA', label: 'Focused delivery' },
                  { value: '24h', label: 'Response goal' },
                ].map((stat) => (
                  <Box key={stat.label}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}
