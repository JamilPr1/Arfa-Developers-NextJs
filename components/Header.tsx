'use client'

import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import PromotionsBanner from './PromotionsBanner'

type NavLink = {
  label: string
  href: string
  hasDropdown?: boolean
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

type ServiceLink = {
  label: string
  href: string
}

const serviceLinks: ServiceLink[] = [
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

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [servicesMenuAnchor, setServicesMenuAnchor] = useState<null | HTMLElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Reset scroll position when pathname changes (navigation to new page)
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }

    // Check initial scroll position
    const checkScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    // Check immediately and after a small delay to ensure DOM is ready
    checkScroll()
    const timer = setTimeout(() => {
      checkScroll()
    }, 100)

    // Listen for scroll events
    const handleScroll = () => {
      checkScroll()
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname]) // Re-run when pathname changes

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMobileOpen(true)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMobileOpen(false)
  }

  const handleServicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setServicesMenuAnchor(event.currentTarget)
  }

  const handleServicesMenuClose = () => {
    setServicesMenuAnchor(null)
  }

  const handleNavClick = (href: string) => {
    handleMenuClose()
    
    // If it's a route (starts with /), use Next.js router
    if (href.startsWith('/')) {
      router.push(href)
      return
    }
    
    // If it's a hash link, scroll to element
    if (href.startsWith('#')) {
      // If we're on a different page, navigate to home first
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push(`/${href}`)
      } else {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
      return
    }
  }

  // Determine if page has colored background at top (for initial header state)
  // Include dynamic service pages (e.g., /services/web-development)
  const hasColoredBackground = pathname === '/' || 
    pathname === '/services' || 
    pathname.startsWith('/services/') ||
    pathname === '/portfolio' || 
    pathname === '/about' || 
    pathname === '/blog' || 
    pathname === '/contact'
  
  return (
    <>
      <PromotionsBanner />
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: scrolled 
              ? 'rgba(255, 255, 255, 0.98)' 
              : hasColoredBackground 
                ? 'transparent' 
                : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: scrolled || !hasColoredBackground ? 'blur(10px)' : 'none',
            boxShadow: scrolled || !hasColoredBackground 
              ? '0 2px 20px rgba(0,0,0,0.1)' 
              : 'none',
            transition: 'all 0.3s ease-in-out',
            zIndex: 1200,
            top: { xs: '40px', sm: '40px' }, // Space for promotions banner
          }}
        >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" style={{ textDecoration: 'none' }} aria-label="Arfa Developers Home">
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: scrolled || !hasColoredBackground 
                      ? '#1E3A8A' // Dark blue for good contrast on white (WCAG AA compliant)
                      : '#FFFFFF', // White for good contrast on blue background
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: '#2563EB',
                    },
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                  }}
                >
                  Arfa Developers
                </Typography>
              </Link>
            </motion.div>

            <Box 
              component="nav"
              aria-label="Main navigation"
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: { md: 2, lg: 3 }, 
                alignItems: 'center' 
              }}
            >
              {navLinks.map((link) => {
                const textColor = scrolled || !hasColoredBackground 
                  ? '#111827' // Dark gray for good contrast on white (WCAG AA: 4.5:1)
                  : '#FFFFFF' // White for good contrast on blue (WCAG AA: 4.5:1)
                
                // Services dropdown menu
                if (link.hasDropdown) {
                  return (
                    <Box key={link.label}>
                      <Button
                        onClick={handleServicesMenuOpen}
                        aria-label={`${link.label} menu`}
                        aria-controls={servicesMenuAnchor ? 'services-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={servicesMenuAnchor ? 'true' : undefined}
                        endIcon={<ArrowDropDownIcon />}
                        sx={{
                          color: textColor,
                          fontWeight: 500,
                          fontSize: { md: '0.9rem', lg: '1rem' },
                          px: { md: 1.5, lg: 2 },
                          '&:hover': {
                            color: '#2563EB',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid #2563EB',
                            outlineOffset: '2px',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {link.label}
                      </Button>
                      <Menu
                        id="services-menu"
                        anchorEl={servicesMenuAnchor}
                        open={Boolean(servicesMenuAnchor)}
                        onClose={handleServicesMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'services-button',
                        }}
                        PaperProps={{
                          sx: {
                            mt: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(37, 99, 235, 0.1)',
                            maxHeight: '280px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            minWidth: '220px',
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
                      >
                        <MenuItem
                          component={Link}
                          href="/services"
                          onClick={handleServicesMenuClose}
                          sx={{
                            fontWeight: 600,
                            color: '#1E3A8A',
                            backgroundColor: '#EFF6FF',
                            borderBottom: '1px solid #DBEAFE',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: '#DBEAFE',
                              color: '#2563EB',
                            },
                            '&:focus-visible': {
                              outline: '2px solid #2563EB',
                              outlineOffset: '-2px',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          All Services
                        </MenuItem>
                        {serviceLinks.map((service) => (
                          <MenuItem
                            key={service.href}
                            component={Link}
                            href={service.href}
                            onClick={handleServicesMenuClose}
                            sx={{
                              px: 2,
                              py: 1.5,
                              color: '#374151',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent',
                              '&:hover': {
                                backgroundColor: '#EFF6FF',
                                color: '#1E3A8A',
                                fontWeight: 500,
                                transform: 'translateX(4px)',
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
                    </Box>
                  )
                }
                
                if (link.href.startsWith('/')) {
                  return (
                    <Link 
                      key={link.label} 
                      href={link.href} 
                      style={{ textDecoration: 'none' }}
                      aria-label={`Navigate to ${link.label}`}
                    >
                      <Button
                        sx={{
                          color: textColor,
                          fontWeight: 500,
                          fontSize: { md: '0.9rem', lg: '1rem' },
                          px: { md: 1.5, lg: 2 },
                          '&:hover': {
                            color: '#2563EB',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid #2563EB',
                            outlineOffset: '2px',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  )
                }
                return (
                  <Button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    aria-label={`Navigate to ${link.label} section`}
                    sx={{
                      color: textColor,
                      fontWeight: 500,
                      fontSize: { md: '0.9rem', lg: '1rem' },
                      px: { md: 1.5, lg: 2 },
                      '&:hover': {
                        color: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #2563EB',
                        outlineOffset: '2px',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Button>
                )
              })}
              <Button
                variant="contained"
                onClick={() => handleNavClick('#contact')}
                aria-label="Get free consultation"
                sx={{
                  ml: { md: 1, lg: 2 },
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: { md: '0.9rem', lg: '1rem' },
                  px: { md: 2, lg: 3 },
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#2563EB',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
                  },
                  '&:focus-visible': {
                    outline: '2px solid #2563EB',
                    outlineOffset: '2px',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Free Consultation
              </Button>
            </Box>

            <IconButton
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                color: scrolled || !hasColoredBackground 
                  ? '#1E3A8A' 
                  : '#FFFFFF',
                minWidth: '44px',
                minHeight: '44px',
                '&:focus-visible': {
                  outline: '2px solid #2563EB',
                  outlineOffset: '2px',
                },
              }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="mobile-menu"
              anchorEl={anchorEl}
              open={mobileOpen}
              onClose={handleMenuClose}
              sx={{ 
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  minWidth: { xs: '280px', sm: '320px' },
                  maxWidth: { xs: '90vw', sm: '400px' },
                  mt: 1,
                  maxHeight: '85vh',
                  overflowY: 'auto',
                },
              }}
              MenuListProps={{
                'aria-labelledby': 'mobile-menu-button',
                sx: { py: 1 },
              }}
            >
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <Box key={link.label}>
                      <MenuItem 
                        onClick={(e) => {
                          const target = e.currentTarget
                          if (servicesMenuAnchor === target) {
                            handleServicesMenuClose()
                          } else {
                            setServicesMenuAnchor(target)
                          }
                        }}
                        sx={{
                          '&:focus-visible': {
                            outline: '2px solid #2563EB',
                            outlineOffset: '-2px',
                          },
                        }}
                      >
                        {link.label} <ArrowDropDownIcon sx={{ ml: 'auto' }} />
                      </MenuItem>
                      <Menu
                        anchorEl={servicesMenuAnchor}
                        open={Boolean(servicesMenuAnchor)}
                        onClose={handleServicesMenuClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(37, 99, 235, 0.1)',
                            maxHeight: '280px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            width: { xs: '90vw', sm: '280px' },
                            minWidth: '220px',
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
                      >
                        <MenuItem
                          component={Link}
                          href="/services"
                          onClick={() => {
                            handleServicesMenuClose()
                            handleMenuClose()
                          }}
                          sx={{
                            fontWeight: 600,
                            color: '#1E3A8A',
                            backgroundColor: '#EFF6FF',
                            borderBottom: '1px solid #DBEAFE',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                              backgroundColor: '#DBEAFE',
                              color: '#2563EB',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          All Services
                        </MenuItem>
                        {serviceLinks.map((service) => (
                          <MenuItem
                            key={service.href}
                            component={Link}
                            href={service.href}
                            onClick={() => {
                              handleServicesMenuClose()
                              handleMenuClose()
                            }}
                            sx={{
                              px: 2,
                              py: 1.5,
                              minHeight: '48px',
                              color: '#374151',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease',
                              borderLeft: '3px solid transparent',
                              '&:hover': {
                                backgroundColor: '#EFF6FF',
                                color: '#1E3A8A',
                                fontWeight: 500,
                                transform: 'translateX(4px)',
                                borderLeftColor: '#2563EB',
                              },
                              '&:focus-visible': {
                                outline: '2px solid #2563EB',
                                outlineOffset: '-2px',
                              },
                            }}
                          >
                            {service.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  )
                }
                
                if (link.href.startsWith('/')) {
                  return (
                    <MenuItem 
                      key={link.label} 
                      component={Link} 
                      href={link.href} 
                      onClick={handleMenuClose}
                      sx={{
                        minHeight: '48px',
                        py: 1.5,
                        '&:focus-visible': {
                          outline: '2px solid #2563EB',
                          outlineOffset: '-2px',
                        },
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  )
                }
                return (
                  <MenuItem 
                    key={link.label} 
                    onClick={() => handleNavClick(link.href)}
                    sx={{
                      minHeight: '48px',
                      py: 1.5,
                      '&:focus-visible': {
                        outline: '2px solid #2563EB',
                        outlineOffset: '-2px',
                      },
                    }}
                  >
                    {link.label}
                  </MenuItem>
                )
              })}
              <MenuItem 
                onClick={() => handleNavClick('#contact')}
                sx={{ 
                  mt: 1,
                  minHeight: 'auto',
                  py: 1.5,
                  '&:focus-visible': {
                    outline: '2px solid #2563EB',
                    outlineOffset: '-2px',
                  },
                }}
              >
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    backgroundColor: '#1E3A8A',
                    minHeight: '48px',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#2563EB',
                    },
                  }}
                >
                  Free Consultation
                </Button>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
    </>
  )
}
