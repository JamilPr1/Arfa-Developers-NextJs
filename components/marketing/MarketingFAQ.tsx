'use client'

import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NextLink from 'next/link'
import { siteConfig } from '@/lib/siteConfig'

const faqs = [
  {
    q: 'Can you take over an unfinished project from a freelancer or agency?',
    a: 'Yes. We run a quick triage on the repo, hosting, and logs, then take ownership of delivery with a clear rescue plan.',
  },
  {
    q: 'How fast can you rescue a project?',
    a: 'Most rescues start with critical fixes in days. Full stabilization depends on scope — we prioritize the fastest path to production.',
  },
  {
    q: 'Do you work with US time zones?',
    a: 'Yes. We schedule overlapping hours for US teams and provide clear weekly updates.',
  },
  {
    q: 'What tech stack do you specialize in?',
    a: 'Next.js, React, TypeScript, Node.js, Python, PostgreSQL/Prisma, Docker, AWS/Vercel — plus OpenAI/LLM apps, RAG chatbots, voice agents, and WhatsApp/Meta automation.',
  },
  {
    q: 'Do you build AI and automation products?',
    a: 'Yes. We ship AI voice agents, sales copilots, WhatsApp automation, Meta CRM workflows, and custom LLM integrations grounded in your business data.',
  },
  {
    q: 'How do I get started?',
    a: `Book a free consultation or email ${siteConfig.contactEmail}. We’ll review your goals and recommend the next step.`,
  },
]

export default function MarketingFAQ() {
  const [expanded, setExpanded] = React.useState<string[]>(['panel0'])

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel))
    }

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 6, sm: 10 },
        pb: { xs: 8, sm: 12 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 5 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          fontWeight: 600,
        }}
      >
        Frequently asked questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        {faqs.map((item, i) => {
          const panel = `panel${i}`
          return (
            <Accordion
              key={panel}
              expanded={expanded.includes(panel)}
              onChange={handleChange(panel)}
              sx={{
                bgcolor: 'transparent',
                boxShadow: 'none',
                '&:before': { display: 'none' },
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${panel}-content`}>
                <Typography component="span" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: { md: '70%' } }}>
                  {item.a.includes(siteConfig.contactEmail) ? (
                    <>
                      Book a free consultation or email{' '}
                      <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>
                      . We&apos;ll review your goals and recommend the next step.
                    </>
                  ) : (
                    item.a
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>
      <Button component={NextLink} href="/faqs" variant="outlined">
        View all FAQs
      </Button>
    </Container>
  )
}
