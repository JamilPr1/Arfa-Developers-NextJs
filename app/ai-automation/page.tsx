import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  SmartToy as AiIcon,
  Hub as AutomationIcon,
  RecordVoiceOver as VoiceIcon,
  Storage as RagIcon,
  WhatsApp as WhatsAppIcon,
  Psychology as MlIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import ExpandableImage from '@/components/ExpandableImage'

const baseUrl = 'https://www.arfadevelopers.com'
const pageUrl = `${baseUrl}/ai-automation`

export const metadata: Metadata = {
  title:
    'AI Automation Agency USA | LLM Apps, RAG Chatbots, n8n & Voice Agents | Arfa Developers',
  description:
    'Build production AI automation for US businesses: OpenAI/LLM apps, RAG chatbots, AI voice agents, n8n workflows, WhatsApp AI, and CRM automation. Humanized systems that save hours and convert more leads.',
  keywords: [
    'AI automation agency USA',
    'LLM application development',
    'OpenAI integration services',
    'RAG chatbot development',
    'AI voice agents',
    'n8n automation',
    'n8n workflow automation',
    'WhatsApp AI automation',
    'AI sales agents',
    'custom GPT integration',
    'machine learning consulting USA',
    'business process automation AI',
    'LangChain development',
    'conversational AI for business',
    'AI chatbot development company',
    'CRM automation with AI',
    'Zapier alternative n8n',
    'AI workflow automation',
    'generative AI development agency',
    'AI software development USA',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'AI Automation Agency USA | LLM, RAG, n8n & Voice Agents',
    description:
      'Production AI systems — LLM apps, RAG assistants, voice agents, and n8n automations wired into your CRM and messaging stack.',
    type: 'website',
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/images/ai-automation/n8n-automation-workflow.webp`,
        width: 1200,
        height: 675,
        alt: 'n8n AI workflow automation canvas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Agency USA | LLM Apps & n8n Workflows',
    description:
      'OpenAI/LLM apps, RAG chatbots, AI voice agents, and n8n automations for US teams that want results — not demos.',
  },
}

const offerings = [
  {
    icon: <AiIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'LLM apps & custom GPT integrations',
    desc: 'Ship OpenAI-powered products with tool calling, guardrails, cost controls, and clear UX — built for production, not a weekend prototype.',
  },
  {
    icon: <RagIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'RAG chatbots grounded on your data',
    desc: 'Assistants that answer from your docs, policies, and product catalog — with citations, so teams can trust what the model says.',
  },
  {
    icon: <VoiceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'AI voice agents for sales & support',
    desc: 'Speech-to-text, reasoning, and natural TTS that qualify leads, book demos, and hand off to humans when it matters.',
  },
  {
    icon: <AutomationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'n8n workflow automation',
    desc: 'Visual workflows that connect webhooks, CRMs, Slack, email, and AI steps — with retries, logs, and ownership your ops team can maintain.',
  },
  {
    icon: <WhatsAppIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'WhatsApp & messaging AI',
    desc: 'Automated replies, lead capture, and CRM sync on messaging channels — with AI drafts and a clean path to human takeover.',
  },
  {
    icon: <MlIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'ML-assisted ops & scoring',
    desc: 'Lead scoring, triage, and enrichment that plug into the tools you already use — practical machine learning, not science-fair slides.',
  },
]

const workflows = [
  {
    title: 'Lead → qualify → CRM → follow-up',
    detail:
      'Inbound form or WhatsApp message triggers an n8n flow: AI qualifies intent, writes a CRM note, assigns an owner, and schedules a follow-up if no human replies.',
  },
  {
    title: 'Support inbox with AI drafts',
    detail:
      'Tickets land in one place. The model drafts a reply from your knowledge base; agents edit and send. Escalations route by urgency — not guesswork.',
  },
  {
    title: 'Voice agent → calendar booking',
    detail:
      'A voice agent greets callers, answers FAQs from your RAG index, and books a meeting when the prospect is ready — then posts the transcript to Slack.',
  },
  {
    title: 'Ops alerts that actually help',
    detail:
      'Failed payments, stuck jobs, or empty pipelines trigger smart alerts with context — so your team fixes the issue instead of digging through logs.',
  },
]

const stack = [
  'OpenAI',
  'GPT-4o',
  'LangChain',
  'RAG',
  'Pinecone',
  'pgvector',
  'Whisper',
  'TTS',
  'n8n',
  'Zapier',
  'Make',
  'WhatsApp Business API',
  'Meta APIs',
  'Next.js',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Redis',
  'Vercel',
  'Docker',
]

const industries = [
  {
    title: 'SaaS & startups',
    copy: 'Onboarding copilots, in-app assistants, and churn-saving support flows that scale without hiring a floor of agents.',
  },
  {
    title: 'Agencies & service businesses',
    copy: 'Faster lead response on WhatsApp and web chat, CRM hygiene, and proposal follow-ups that stop deals from going cold.',
  },
  {
    title: 'Healthcare & clinics',
    copy: 'Appointment reminders, intake Q&A, and staff assistants grounded on approved protocols — designed with privacy in mind.',
  },
  {
    title: 'E-commerce & retail',
    copy: 'Product Q&A, order status bots, and recovery sequences that feel helpful instead of spammy.',
  },
]

const process = [
  {
    step: '01',
    title: 'Discover the real bottleneck',
    desc: 'We map the painful manual work — missed leads, slow replies, tribal knowledge — and pick the highest-ROI automation first.',
  },
  {
    step: '02',
    title: 'Design the human + AI flow',
    desc: 'Clear handoffs, tone guidelines, and escalation rules so automation never leaves a customer stranded.',
  },
  {
    step: '03',
    title: 'Build LLM + n8n systems',
    desc: 'RAG indexes, prompts, tool calls, and workflows with logging, rate limits, and secrets handled properly.',
  },
  {
    step: '04',
    title: 'Ship, measure, tighten',
    desc: 'We watch conversion, deflection, and cost per conversation — then refine until the system earns its keep.',
  },
]

const faqs = [
  {
    q: 'What is an AI automation agency, and how is Arfa different?',
    a: 'We build AI that sits inside real operations — CRM, messaging, and web products — not slide decks. You get LLM apps, RAG assistants, voice agents, and n8n workflows with ownership, monitoring, and a human handoff path.',
  },
  {
    q: 'Do you build RAG chatbots that use our private documents?',
    a: 'Yes. We index your approved knowledge (docs, FAQs, product data), add retrieval with citations, and tune prompts so answers stay grounded. Sensitive data stays under your controls.',
  },
  {
    q: 'Can you set up n8n automation for our existing tools?',
    a: 'Absolutely. We connect CRMs, Slack, email, WhatsApp, calendars, and custom APIs in n8n — with retries, error alerts, and documentation your team can maintain.',
  },
  {
    q: 'How long does an AI voice agent or LLM pilot take?',
    a: 'A focused pilot often lands in 2–4 weeks depending on data readiness and integrations. We prioritize a thin, production-ready slice over a bloated demo.',
  },
  {
    q: 'Will AI replace our support or sales team?',
    a: 'No — and that is intentional. Automation handles the repetitive 60–80% so your people spend time on judgment calls, relationships, and complex deals.',
  },
  {
    q: 'Do you work with US time zones and sign NDAs?',
    a: 'Yes. We schedule overlapping hours for US teams, provide clear weekly updates, and can sign an NDA before reviewing sensitive systems.',
  },
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseUrl}/services` },
    { '@type': 'ListItem', position: 3, name: 'AI Automation', item: pageUrl },
  ],
}

const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Automation, LLM Apps & n8n Workflows',
  provider: {
    '@type': 'Organization',
    name: 'Arfa Developers',
    url: baseUrl,
  },
  areaServed: 'United States',
  url: pageUrl,
  description:
    'AI automation agency services including LLM application development, RAG chatbot development, AI voice agents, n8n workflow automation, and WhatsApp AI automation for US businesses.',
  serviceType: [
    'AI automation',
    'LLM application development',
    'RAG chatbot development',
    'n8n automation',
    'AI voice agents',
  ],
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function AiAutomationPage() {
  return (
    <>
      <Script
        id="ai-automation-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="ai-automation-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <Script
        id="ai-automation-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <Header />

      <PageHero
        align="left"
        media={
          <ExpandableImage
            src="/images/ai-automation/n8n-automation-workflow.webp"
            alt="n8n-style AI workflow automation connecting webhooks, OpenAI, CRM, and messaging"
            priority
          />
        }
        eyebrow={
          <Typography
            component="p"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              mb: 1.5,
            }}
          >
            AI / ML · LLM · Automation
          </Typography>
        }
        title={
          <>
            AI automation that works in your business —{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              not another demo
            </Box>
          </>
        }
        subtitle="We design and ship LLM apps, RAG chatbots, AI voice agents, and n8n workflows for US teams that need faster replies, cleaner CRM data, and fewer manual handoffs."
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1 }}>
            <Button component={Link} href="/contact" variant="contained" size="large">
              Book a free AI consult
            </Button>
            <Button component={Link} href="/services/ai-ml-llm" variant="outlined" size="large">
              View AI / ML service
            </Button>
          </Stack>
        }
      />

      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Most “AI projects” stall because nobody owns the workflow
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.75, fontSize: '1.05rem' }}>
                A chatbot that cannot reach your CRM is a novelty. A voice agent that cannot book a
                meeting is a recording. We start from the outcome you care about — qualified leads,
                answered support tickets, recovered carts — then wire models, retrieval, and
                automation around that outcome.
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, fontSize: '1.05rem' }}>
                That means OpenAI and LangChain where language understanding helps, RAG where
                accuracy matters, and n8n (or custom Node jobs) where systems need to talk to each
                other at 2 a.m. without waking your team.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <ExpandableImage
                src="/images/ai-automation/ai-llm-apps.webp"
                alt="LLM application dashboard with RAG answers and source citations"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 720, mx: 'auto' }}>
            <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
              What we build for AI-ready teams
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              High-demand capabilities US companies are actively searching for — delivered as
              maintainable software, not a black-box subscription you cannot audit.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {offerings.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 1.5 }}>{item.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <ExpandableImage
                src="/images/ai-automation/ai-voice-agent-ui.webp"
                alt="AI voice agent console with live transcript and CRM sync"
              />
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                LLM apps & AI voice agents that feel human
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.75 }}>
                Prospects do not want to talk to a script. They want quick, accurate answers — and
                a smooth path to a person when the question gets nuanced. We build conversational
                AI with retrieval, tool calling, and evaluation loops so quality stays high as
                volume grows.
              </Typography>
              <List dense>
                {[
                  'OpenAI / GPT integrations with function calling into your APIs',
                  'RAG pipelines on docs, help centers, and product catalogs',
                  'Voice agents using Whisper + TTS for sales and support',
                  'Prompt evaluation, cost tracking, and hallucination controls',
                ].map((text) => (
                  <ListItem key={text} sx={{ px: 0, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                      <CheckIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ sx: { color: 'text.primary', lineHeight: 1.55 } }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                component={Link}
                href="/services/ai-ml-llm"
                variant="outlined"
                sx={{ mt: 1 }}
              >
                AI / ML & LLM service details
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                n8n automation that your ops team can actually own
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.75 }}>
                Spreadsheets and “someone will remember to do it” do not scale. We design n8n
                workflows with clear naming, error handling, and documentation — so automation
                survives after the kickoff call. Prefer Zapier or Make? We can start there and
                migrate complex flows to n8n when you outgrow click-ops limits.
              </Typography>
              <Stack spacing={2}>
                {workflows.map((w) => (
                  <Box
                    key={w.title}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{w.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {w.detail}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Button
                component={Link}
                href="/services/business-automation"
                variant="outlined"
                sx={{ mt: 3 }}
              >
                Business automation service details
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <ExpandableImage
                  src="/images/ai-automation/n8n-automation-workflow.webp"
                  alt="n8n workflow automation canvas with AI and CRM nodes"
                />
                <ExpandableImage
                  src="/images/ai-automation/whatsapp-ai-automation.webp"
                  alt="Messaging AI automation with suggested replies and human handoff"
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
              Stacks buyers are searching for right now
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 640, mx: 'auto', lineHeight: 1.7 }}>
              We implement the tools that show up in real RFPs and Google searches — OpenAI,
              LangChain, RAG, n8n, WhatsApp Business API, Next.js, and more.
            </Typography>
          </Box>
          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            spacing={1}
            justifyContent="center"
            sx={{ maxWidth: 900, mx: 'auto' }}
          >
            {stack.map((t) => (
              <Chip
                key={t}
                label={t}
                sx={{
                  fontWeight: 600,
                  bgcolor: 'grey.100',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}
          >
            Built for industries where speed-to-reply wins
          </Typography>
          <Grid container spacing={3}>
            {industries.map((item) => (
              <Grid item xs={12} sm={6} key={item.title}>
                <Box
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                    {item.copy}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}
          >
            A calm process from idea to production AI
          </Typography>
          <Grid container spacing={3}>
            {process.map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p.step}>
                <Box sx={{ pr: { md: 1 } }}>
                  <Typography
                    sx={{
                      color: 'primary.main',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      mb: 1,
                    }}
                  >
                    {p.step}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {p.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                    {p.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Pilots in weeks, not quarters
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Secrets, rate limits & audit-friendly logs
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h4"
            sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}
          >
            Frequently asked questions
          </Typography>
          <Stack spacing={2.5} divider={<Divider flexItem />}>
            {faqs.map((f) => (
              <Box key={f.q}>
                <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {f.q}
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{f.a}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <Typography component="h2" variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to automate the work that drains your team?
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
            Tell us about your leads, support volume, or ops bottlenecks. We will recommend a
            practical AI + n8n plan you can ship without disrupting the rest of the business.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            <Button component={Link} href="/contact" variant="contained" size="large">
              Start a free consultation
            </Button>
            <Button component={Link} href="/free-audit" variant="outlined" size="large">
              Request a free audit
            </Button>
          </Stack>
        </Container>
      </Box>

      <CTA />
      <Footer />
    </>
  )
}
