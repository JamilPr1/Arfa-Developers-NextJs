'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Link from 'next/link'

const MediaPanel = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 280,
  marginTop: theme.spacing(6),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `
    linear-gradient(135deg, hsla(210, 100%, 96%, 0.9) 0%, hsla(220, 30%, 97%, 0.4) 40%, transparent 70%),
    linear-gradient(180deg, #fff 0%, hsl(220, 35%, 97%) 100%)
  `,
  backgroundSize: 'cover',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(8),
    height: 420,
  },
}))

/** Official MUI Marketing Hero layout with Arfa copy. */
export default function MarketingHero() {
  return (
    <Box
      id="home"
      sx={{
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 16, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '80%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: 'clamp(2.2rem, 6vw, 3.4rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: -0.5,
            }}
          >
            US Web Development&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{ fontSize: 'inherit', color: 'primary.main', fontWeight: 600 }}
            >
              Agency
            </Typography>
          </Typography>
          <Typography
            data-seo-lead
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.65,
            }}
          >
            We rescue failed freelancer and agency builds, ship production-ready Next.js/React apps,
            and build AI voice agents, LLM integrations, and automation for US businesses.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: 'center' }}
          >
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              color="primary"
              size="large"
            >
              Get a Free Consultation
            </Button>
            <Button
              component={Link}
              href="/free-audit"
              variant="outlined"
              color="primary"
              size="large"
            >
              Free Website Audit
            </Button>
            <Button
              component={Link}
              href="/project-rescue"
              variant="text"
              color="primary"
              size="large"
            >
              Project Rescue
            </Button>
          </Stack>
        </Stack>

        <MediaPanel>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              gap: 2,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}
            >
              Built for production
            </Typography>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 600,
                color: 'text.primary',
                maxWidth: 520,
              }}
            >
            Project Rescue · Custom Web Apps · AI & Automation
          </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
              {['Next.js', 'React', 'TypeScript', 'OpenAI', 'Python', 'AWS'].map((t) => (
                <Box
                  key={t}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  {t}
                </Box>
              ))}
            </Stack>
          </Box>
        </MediaPanel>
      </Container>
    </Box>
  )
}
