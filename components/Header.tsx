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
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
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
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check initial scroll position
    const checkScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    // Check on mount
    checkScroll()

    // Listen for scroll events
    const handleScroll = () => {
      checkScroll()
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMobileOpen(true)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMobileOpen(false)
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
  const hasColoredBackground = pathname === '/' || pathname === '/services'
  
  return (
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
          zIndex: 1100,
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
              sx={{ display: { xs: 'flex', md: 'none' }, color: scrolled ? 'text.primary' : 'white' }}
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
                  minWidth: 200,
                  mt: 1,
                },
              }}
              MenuListProps={{
                'aria-labelledby': 'mobile-menu-button',
              }}
            >
              {navLinks.map((link) => {
                if (link.href.startsWith('/')) {
                  return (
                    <MenuItem 
                      key={link.label} 
                      component={Link} 
                      href={link.href} 
                      onClick={handleMenuClose}
                      sx={{
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
  )
}
