'use client'

import { Box, Container, Typography, Grid, TextField, Button, IconButton, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const quickLinks = [
  { label: 'Home', href: '/', isRoute: true },
  { label: 'Services', href: '/services', isRoute: true },
  { label: 'Portfolio', href: '/portfolio', isRoute: true },
  { label: 'Case Studies', href: '/case-studies', isRoute: true },
  { label: 'About', href: '/about', isRoute: true },
  { label: 'Blog', href: '/blog', isRoute: true },
  { label: 'Contact', href: '/contact', isRoute: true },
  { label: 'Pricing', href: '/pricing', isRoute: true },
  { label: 'Our Process', href: '/our-process', isRoute: true },
  { label: 'Website Rescue', href: '/website-rescue', isRoute: true },
  { label: 'Testimonials', href: '/testimonials', isRoute: true },
  { label: 'FAQs', href: '/faqs', isRoute: true },
  { label: 'Free Audit', href: '/free-audit', isRoute: true },
]

const services = [
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'Website Redesign', href: '/services/website-redesign' },
  { label: 'Landing Pages', href: '/services/landing-pages' },
  { label: 'E-commerce Development', href: '/services/ecommerce-development' },
  { label: 'SEO Services', href: '/services/seo-services' },
  { label: 'Technical SEO', href: '/services/technical-seo' },
  { label: 'Local SEO', href: '/services/local-seo' },
  { label: 'SEO Audit', href: '/services/seo-audit' },
  { label: 'Digital Marketing', href: '/services/digital-marketing' },
  { label: 'Google Ads Management', href: '/services/google-ads-management' },
  { label: 'Content Marketing', href: '/services/content-marketing' },
  { label: 'Email Marketing', href: '/services/email-marketing' },
  { label: 'Mobile App Development', href: '/services/mobile-app-development' },
  { label: 'Cloud Solutions', href: '/services/cloud-solutions' },
  { label: 'Data Analytics', href: '/services/data-analytics' },
  { label: 'Security & Compliance', href: '/services/security-compliance' },
  { label: 'Performance Optimization', href: '/services/performance-optimization' },
  { label: 'Enterprise Solutions', href: '/services/enterprise-solutions' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Refund Policy', href: '/refund-policy' },
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
        <Grid container spacing={{ xs: 3, sm: 4 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <PhoneIcon sx={{ color: '#25D366', fontSize: 24 }} />
                <MuiLink
                  href="https://wa.me/15166037838"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#25D366',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      color: '#128C7E',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  +1 (516) 603-7838
                </MuiLink>
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
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: '#F9FAFB',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, sm: 1 } }}>
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
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            py: 0.5,
                            minHeight: '32px',
                            display: 'flex',
                            alignItems: 'center',
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
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {services.slice(0, 10).map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        style={{ textDecoration: 'none' }}
                      >
                        <MuiLink
                          component="span"
                          sx={{
                            color: '#9CA3AF',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'block',
                            minHeight: '28px',
                            lineHeight: '1.4',
                            py: 0.5,
                            '&:hover': {
                              color: '#2563EB',
                              textDecoration: 'underline',
                            },
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {service.label}
                        </MuiLink>
                      </Link>
                    ))}
                    {/* Move Enterprise Solutions to left column */}
                    {services.slice(17, 18).map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        style={{ textDecoration: 'none' }}
                      >
                        <MuiLink
                          component="span"
                          sx={{
                            color: '#9CA3AF',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'block',
                            minHeight: '28px',
                            lineHeight: '1.4',
                            py: 0.5,
                            '&:hover': {
                              color: '#2563EB',
                              textDecoration: 'underline',
                            },
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {service.label}
                        </MuiLink>
                      </Link>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {services.slice(10, 17).map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        style={{ textDecoration: 'none' }}
                      >
                        <MuiLink
                          component="span"
                          sx={{
                            color: '#9CA3AF',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'block',
                            minHeight: '28px',
                            lineHeight: '1.4',
                            py: 0.5,
                            '&:hover': {
                              color: '#2563EB',
                              textDecoration: 'underline',
                            },
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {service.label}
                        </MuiLink>
                      </Link>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: '#F9FAFB',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}
              >
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
                    contact@arfadevelopers.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: '#2563EB', fontSize: 20 }} />
                  <MuiLink
                    href="https://wa.me/15166037838"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#25D366',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    +1 (516) 603-7838
                  </MuiLink>
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
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: '#F9FAFB',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}
              >
                Newsletter
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2, 
                  color: '#9CA3AF',
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                }}
              >
                Subscribe to get updates on our latest projects and insights.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <TextField
                  placeholder="Enter your email"
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button 
                  variant="contained" 
                  sx={{ 
                    textTransform: 'none',
                    minHeight: { xs: '48px', sm: '40px' },
                    whiteSpace: 'nowrap',
                  }}
                >
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
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            © {new Date().getFullYear()} Arfa Developers. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <MuiLink
                  sx={{
                    color: '#9CA3AF',
                    fontSize: '0.875rem',
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
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
