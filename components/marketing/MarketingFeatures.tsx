'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import MuiChip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WebIcon from '@mui/icons-material/Web'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import CloudIcon from '@mui/icons-material/Cloud'
import SpeedIcon from '@mui/icons-material/Speed'
import SecurityIcon from '@mui/icons-material/Security'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import Link from 'next/link'

type FeatureItem = {
  icon: React.ReactElement
  title: string
  description: string
  href: string
  previewTitle: string
  previewBody: string
  highlights: string[]
  stack: string[]
  outcome: string
}

const items: FeatureItem[] = [
  {
    icon: <WebIcon />,
    title: 'Web Development',
    description:
      'Custom web apps with React, Next.js, TypeScript, and modern APIs — scalable and production-ready.',
    href: '/services/web-development',
    previewTitle: 'Web apps that ship',
    previewBody:
      'SSR, dashboards, portals, and SaaS frontends with clean architecture — built for performance, SEO, and long-term maintainability.',
    highlights: [
      'Next.js App Router, React Server Components, and TypeScript end-to-end',
      'Admin dashboards, customer portals, and multi-tenant SaaS UIs',
      'REST/GraphQL APIs, auth, payments, and role-based access',
      'Accessibility, Core Web Vitals, and production monitoring',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    outcome: 'Ship a production-ready web product with a codebase your team can own.',
  },
  {
    icon: <AnalyticsIcon />,
    title: 'AI / ML & LLM Apps',
    description:
      'OpenAI integrations, RAG chatbots, voice agents, and AI automation wired into real products.',
    href: '/products/ai-sales-agents',
    previewTitle: 'AI that drives revenue',
    previewBody:
      'Voice agents, sales copilots, WhatsApp AI, and grounded LLM apps — connected to your CRM, knowledge base, and workflows.',
    highlights: [
      'RAG chatbots grounded on your docs, policies, and product data',
      'AI voice agents for inbound sales, support, and lead qualification',
      'OpenAI / LLM tooling with guardrails and low-hallucination prompts',
      'Embedded AI in existing apps — not demos that never leave the lab',
    ],
    stack: ['OpenAI', 'RAG', 'Voice AI', 'LangChain', 'WhatsApp'],
    outcome: 'Turn AI into a measurable channel: more leads answered, less manual follow-up.',
  },
  {
    icon: <PhoneAndroidIcon />,
    title: 'Mobile Apps',
    description: 'Native and cross-platform iOS/Android apps with React Native and Flutter expertise.',
    href: '/services/mobile-app-development',
    previewTitle: 'Mobile that performs',
    previewBody:
      'Store-ready iOS and Android apps with solid UX, analytics, push notifications, and offline-friendly flows.',
    highlights: [
      'React Native or Flutter for shared code and faster release cycles',
      'Auth, payments, maps, and camera flows built for real devices',
      'App Store / Play Store submission support and release checklists',
      'Crash reporting, analytics, and iterative UX polish post-launch',
    ],
    stack: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    outcome: 'Launch a polished mobile product users can download and trust.',
  },
  {
    icon: <CloudIcon />,
    title: 'Cloud & DevOps',
    description: 'AWS, Azure, GCP, Docker, and Vercel — secure, scalable, cost-aware delivery.',
    href: '/services/cloud-solutions',
    previewTitle: 'Cloud that scales',
    previewBody:
      'CI/CD, containers, serverless, and resilient environments — so deploys are boring and outages stay rare.',
    highlights: [
      'AWS, Azure, GCP, and Vercel setups tailored to your stack',
      'Docker, Kubernetes, and serverless where they actually help',
      'CI/CD pipelines, staging environments, and rollback-safe releases',
      'Cost controls, secrets management, and observability basics',
    ],
    stack: ['AWS', 'Azure', 'Docker', 'Vercel', 'CI/CD'],
    outcome: 'Deploy with confidence — scalable infra without surprise cloud bills.',
  },
  {
    icon: <SpeedIcon />,
    title: 'Automation',
    description: 'WhatsApp, Meta CRM, and workflow automation that cuts manual ops for sales & support.',
    href: '/products/whatsapp-automation',
    previewTitle: 'Automate the busywork',
    previewBody:
      'Message automation, AI drafts, CRM sync, and smart handoff to humans when the conversation needs a person.',
    highlights: [
      'WhatsApp Business and Meta messaging flows for sales & support',
      'CRM sync, lead routing, and follow-up reminders on autopilot',
      'AI-assisted replies with clear escalation to your team',
      'Ops dashboards so you can see what automation is actually doing',
    ],
    stack: ['WhatsApp', 'Meta CRM', 'Zapier', 'n8n', 'AI drafts'],
    outcome: 'Cut repetitive ops work and keep response times consistently fast.',
  },
  {
    icon: <SecurityIcon />,
    title: 'Security & Rescue',
    description: 'Project rescue, hardening, and compliance-minded delivery for failed or risky builds.',
    href: '/project-rescue',
    previewTitle: 'Stabilize & ship',
    previewBody:
      'Take over unfinished codebases, fix critical paths, harden security, and get stalled projects to production safely.',
    highlights: [
      'Codebase audit: architecture, debt, security, and ship-blockers',
      'Stabilization sprints for broken releases and failed handoffs',
      'Auth, secrets, and dependency hardening before go-live',
      'Clear rescue plan with milestones — not endless “almost done”',
    ],
    stack: ['Audits', 'Hardening', 'Next.js', 'Legacy rescue', 'Compliance'],
    outcome: 'Rescue the build, reduce risk, and get a reliable path to launch.',
  },
]

const SelectChip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  ...(selected && {
    background: 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
    color: '#fff',
    borderColor: theme.palette.primary.light,
    '& .MuiChip-label': { color: '#fff' },
  }),
}))

/** Interactive Features section — official Marketing layout. */
export default function MarketingFeatures() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0)
  const selectedFeature = items[selectedItemIndex]

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 12 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' }, mb: { xs: 3, sm: 4 } }}>
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
          What we build
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Comprehensive web solutions tailored to your business — from rescue and rebuild to new product delivery.
        </Typography>
      </Box>

      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {items.map(({ title }, index) => (
          <SelectChip
            key={title}
            label={title}
            onClick={() => setSelectedItemIndex(index)}
            selected={selectedItemIndex === index}
            clickable
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          width: '100%',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1.5,
            flex: { md: '0 0 42%' },
            width: { sm: '100%', md: 'auto' },
            maxWidth: { md: '42%' },
          }}
        >
          {items.map((item, index) => {
            const selected = selectedItemIndex === index
            return (
              <Box
                key={item.title}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItemIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedItemIndex(index)
                  }
                }}
                sx={{
                  p: 2,
                  width: '100%',
                  flexShrink: 0,
                  height: 'auto',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : 'transparent',
                  bgcolor: selected ? 'action.selected' : 'transparent',
                  transition: 'background-color 120ms ease, border-color 120ms ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: 'primary.main' }}>
                  {item.icon}
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </Box>
            )
          })}
          <Button component={Link} href="/services" variant="outlined" sx={{ mt: 1, alignSelf: 'flex-start' }}>
            View all services
          </Button>
        </Box>

        <Card
          variant="outlined"
          sx={{
            flex: { md: '1 1 58%' },
            width: { xs: '100%', md: 'auto' },
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            p: { xs: 3, sm: 4 },
            alignSelf: 'stretch',
            background: `linear-gradient(160deg, hsl(210, 100%, 97%) 0%, #fff 45%, hsl(220, 35%, 97%) 100%)`,
            boxShadow: 'none',
            '&:hover': { transform: 'none', boxShadow: 'none' },
          }}
        >
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
            Service focus
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1.5, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            {selectedFeature.previewTitle}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.7 }}>
            {selectedFeature.previewBody}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25, color: 'text.primary' }}>
            What you get
          </Typography>
          <Stack spacing={1.25} sx={{ mb: 3 }}>
            {selectedFeature.highlights.map((line) => (
              <Box key={line} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 20, mt: '2px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
                  {line}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.25, color: 'text.primary' }}>
            Typical stack
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 3 }}>
            {selectedFeature.stack.map((tag) => (
              <MuiChip key={tag} label={tag} size="small" variant="outlined" color="primary" />
            ))}
          </Stack>

          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 2, lineHeight: 1.6 }}>
              {selectedFeature.outcome}
            </Typography>
            <Button
              component={Link}
              href={selectedFeature.href}
              variant="contained"
              color="primary"
              sx={{ alignSelf: 'flex-start' }}
            >
              Learn more
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedFeature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedFeature.description}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}
