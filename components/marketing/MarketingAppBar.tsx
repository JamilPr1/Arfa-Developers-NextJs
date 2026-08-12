'use client'

import { useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import PromotionsBanner from '@/components/PromotionsBanner'
import ArfaLogo from '@/components/ArfaLogo'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
  gap: 8,
  minHeight: 56,
}))

const navLinks = [
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Project Rescue', href: '/project-rescue' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'Free Audit', href: '/free-audit' },
  { label: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { label: 'All Services', href: '/services' },
  { label: 'Project Rescue (USA)', href: '/project-rescue' },
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'Website Redesign', href: '/services/website-redesign' },
  { label: 'E-commerce Development', href: '/services/ecommerce-development' },
  { label: 'SEO Services', href: '/services/seo-services' },
  { label: 'Mobile App Development', href: '/services/mobile-app-development' },
  { label: 'Cloud Solutions', href: '/services/cloud-solutions' },
  { label: 'Custom Software Development USA', href: '/custom-software-development-usa' },
]

/** Official MUI Marketing floating AppBar — Arfa nav + services. */
export default function MarketingAppBar() {
  const [open, setOpen] = useState(false)
  const [servicesAnchor, setServicesAnchor] = useState<null | HTMLElement>(null)
  const [bannerOffset, setBannerOffset] = useState(40)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const el = document.querySelector('[data-promotions-banner]')
    if (el) setBannerOffset((el as HTMLElement).offsetHeight || 40)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setServicesAnchor(null)
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        router.push(`/${href}`)
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    router.push(href)
  }

  return (
    <>
      <PromotionsBanner />
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: `${bannerOffset}px`,
          zIndex: 1200,
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <ArfaLogo height={36} />

              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center', ml: 1 }}>
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <Box key={link.label}>
                      <Button
                        size="small"
                        color="info"
                        endIcon={<ArrowDropDownIcon />}
                        onClick={(e) => setServicesAnchor(e.currentTarget)}
                        sx={{ color: 'text.primary', minWidth: 0 }}
                      >
                        {link.label}
                      </Button>
                      <Menu
                        anchorEl={servicesAnchor}
                        open={Boolean(servicesAnchor)}
                        onClose={() => setServicesAnchor(null)}
                        PaperProps={{ sx: { maxHeight: 320, minWidth: 240 } }}
                      >
                        {serviceLinks.map((s) => (
                          <MenuItem
                            key={s.href}
                            component={Link}
                            href={s.href}
                            onClick={() => setServicesAnchor(null)}
                          >
                            {s.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Button
                      key={link.href}
                      component={Link}
                      href={link.href}
                      size="small"
                      color="info"
                      sx={{ color: 'text.primary', minWidth: 0 }}
                    >
                      {link.label}
                    </Button>
                  )
                )}
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button
                component={Link}
                href="/contact"
                color="primary"
                variant="contained"
                size="small"
              >
                Free Consultation
              </Button>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
              <IconButton aria-label="Menu" onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </StyledToolbar>
        </Container>

        <Drawer
          anchor="top"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              top: bannerOffset,
              backgroundImage: 'none',
              backgroundColor: 'background.default',
            },
          }}
        >
          <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
            {navLinks.map((link) => (
              <MenuItem key={link.href} onClick={() => go(link.href)}>
                {link.label}
              </MenuItem>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <MenuItem>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => go('/contact')}
              >
                Free Consultation
              </Button>
            </MenuItem>
          </Box>
        </Drawer>
      </AppBar>
    </>
  )
}
