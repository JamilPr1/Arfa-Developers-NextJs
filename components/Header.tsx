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

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
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
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    handleMenuClose()
  }

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: scrolled ? '#1E3A8A' : 'white',
                  cursor: 'pointer',
                }}
                onClick={() => handleNavClick('#home')}
              >
                Arfa Developers
              </Typography>
            </motion.div>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: scrolled ? '#111827' : 'white',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#2563EB',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                variant="contained"
                onClick={() => handleNavClick('#contact')}
                sx={{
                  ml: 2,
                  backgroundColor: '#1E3A8A',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#2563EB',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
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
              anchorEl={anchorEl}
              open={mobileOpen}
              onClose={handleMenuClose}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {navLinks.map((link) => (
                <MenuItem key={link.label} onClick={() => handleNavClick(link.href)}>
                  {link.label}
                </MenuItem>
              ))}
              <MenuItem onClick={() => handleNavClick('#contact')}>
                <Button variant="contained" fullWidth>
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
