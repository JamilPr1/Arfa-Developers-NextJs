'use client'

import { useState } from 'react'
import { Box, Container, Typography, Grid, TextField, Button, IconButton, Link as MuiLink, Menu, MenuItem } from '@mui/material'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowDropDown as ArrowDropDownIcon,
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
  const [servicesAnchorEl, setServicesAnchorEl] = useState<null | HTMLElement>(null)
  const servicesMenuOpen = Boolean(servicesAnchorEl)

  const handleServicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchorEl(event.currentTarget)
  }

  const handleServicesMenuClose = () => {
    setServicesAnchorEl(null)
  }

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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#F9FAFB' }}>
                  Services
                </Typography>
                <MuiLink
                  component="button"
                  onClick={handleServicesMenuOpen}
                  sx={{
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#2563EB',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  View All
                  <ArrowDropDownIcon sx={{ fontSize: '1rem' }} />
                </MuiLink>
              </Box>
              <Menu
                anchorEl={servicesAnchorEl}
                open={servicesMenuOpen}
                onClose={handleServicesMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.1)',
                    maxHeight: '200px',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#F3F4F6',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#9CA3AF',
                      borderRadius: '3px',
                      '&:hover': {
                        background: '#6B7280',
                      },
                    },
                  },
                }}
                MenuListProps={{
                  sx: {
                    py: 0.5,
                  },
                }}
              >
                {services.map((service, index) => (
                  <MenuItem
                    key={service.href}
                    component={Link}
                    href={service.href}
                    onClick={handleServicesMenuClose}
                    sx={{
                      px: 2,
                      py: 1,
                      color: '#374151',
                      fontSize: '0.875rem',
                      minHeight: '40px',
                      transition: 'all 0.2s ease',
                      borderLeft: '3px solid transparent',
                      '&:hover': {
                        backgroundColor: '#EFF6FF',
                        color: '#1E3A8A',
                        fontWeight: 500,
                        borderLeftColor: '#2563EB',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #2563EB',
                        outlineOffset: '-2px',
                        backgroundColor: '#EFF6FF',
                      },
                    }}
                  >
                    {service.label}
                  </MenuItem>
                ))}
              </Menu>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {services.slice(0, 5).map((service) => (
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
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        '&:hover': {
                          color: '#2563EB',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          textDecoration: 'none',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {service.label}
                    </MuiLink>
                  </Link>
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
