'use client'

import { Box, Container, Typography, Grid, TextField, Button, IconButton, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const quickLinks = [
  { label: 'Home', href: '/', isRoute: true },
  { label: 'Services', href: '/services', isRoute: true },
  { label: 'Portfolio', href: '#portfolio', isRoute: false },
  { label: 'About', href: '#about', isRoute: false },
  { label: 'Blog', href: '#blog', isRoute: false },
  { label: 'Contact', href: '#contact', isRoute: false },
]

const services = [
  'Web Development',
  'Mobile Apps',
  'Cloud Solutions',
  'Data Analytics',
  'Security',
  'Consulting',
]

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (href: string, isRoute: boolean) => {
    if (isRoute) {
      router.push(href)
    } else {
      // For hash links, navigate to home page first if not already there
      if (pathname !== '/') {
        router.push(`/${href}`)
      } else {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1F2937', // Dark Slate
        color: '#F9FAFB', // Light Gray text
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#F9FAFB',
                }}
              >
                Arfa Developers
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#9CA3AF' }}>
                Building web solutions that scale globally. From startups to enterprises, we deliver excellence.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: '#F9FAFB',
                    '&:hover': { backgroundColor: '#2563EB', color: '#FFFFFF' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#F9FAFB',
                    '&:hover': { backgroundColor: '#2563EB', color: '#FFFFFF' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#F9FAFB',
                    '&:hover': { backgroundColor: '#2563EB', color: '#FFFFFF' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#F9FAFB',
                    '&:hover': { backgroundColor: '#2563EB', color: '#FFFFFF' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#F9FAFB',
                    '&:hover': { backgroundColor: '#2563EB', color: '#FFFFFF' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F9FAFB' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickLinks.map((link) => {
                  if (link.isRoute) {
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        style={{ textDecoration: 'none' }}
                      >
                        <MuiLink
                          component="span"
                          sx={{
                            color: '#9CA3AF',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#2563EB',
                              textDecoration: 'underline',
                            },
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {link.label}
                        </MuiLink>
                      </Link>
                    )
                  }
                  return (
                    <MuiLink
                      key={link.label}
                      component="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href, link.isRoute)
                      }}
                      sx={{
                        color: '#9CA3AF',
                        textDecoration: 'none',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#2563EB',
                          textDecoration: 'underline',
                        },
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  )
                })}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F9FAFB' }}>
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {services.map((service) => (
                  <Typography
                    key={service}
                    variant="body2"
                    sx={{
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#2563EB',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {service}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F9FAFB' }}>
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    contact@arfadevelopers.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationIcon sx={{ color: '#2563EB', fontSize: 20, mt: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    United States & Pakistan
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F9FAFB' }}>
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#9CA3AF' }}>
                Subscribe to get updates on our latest projects and insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Enter your email"
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button variant="contained" sx={{ textTransform: 'none' }}>
                  Subscribe
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            © {new Date().getFullYear()} Arfa Developers. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
