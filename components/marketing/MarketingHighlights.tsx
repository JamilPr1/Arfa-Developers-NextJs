'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded'
import Link from 'next/link'

const items = [
  {
    icon: <WarningAmberRoundedIcon />,
    title: 'Freelancer disappeared',
    description: 'Partial code, no handover, and a deadline still looming — we take ownership fast.',
  },
  {
    icon: <BuildRoundedIcon />,
    title: 'Broken features',
    description: 'Checkout fails, auth breaks, integrations crash. We stabilize critical paths first.',
  },
  {
    icon: <SpeedRoundedIcon />,
    title: 'Slow & unreliable',
    description: 'Poor performance, timeouts, and failed deploys — we harden the delivery pipeline.',
  },
  {
    icon: <SecurityRoundedIcon />,
    title: 'Security risks',
    description: 'Outdated deps, exposed secrets, missing practices — we fix what puts you at risk.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Ongoing support',
    description: 'Unlike one-off freelancers, we stay for maintenance, SLAs, and continuous shipping.',
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: 'Production-ready',
    description: 'Clean architecture, monitoring, and a release you can trust in the real world.',
  },
]

/** Dark Highlights section — Project Rescue focus. */
export default function MarketingHighlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 6, sm: 12 },
        pb: { xs: 8, sm: 14 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: { sm: '100%', md: '70%' }, textAlign: 'center' }}>
          <Typography component="h2" variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Project Rescue highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            We specialize in taking over failed builds and shipping what freelancers and agencies left unfinished.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                  boxShadow: 'none',
                  '&:hover': { borderColor: 'primary.light', transform: 'none', boxShadow: 'none' },
                }}
              >
                <Box sx={{ opacity: 0.7, color: 'primary.light' }}>{item.icon}</Box>
                <Box>
                  <Typography gutterBottom sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Button
          component={Link}
          href="/project-rescue"
          variant="contained"
          color="primary"
          size="large"
        >
          Start a project rescue
        </Button>
      </Container>
    </Box>
  )
}
