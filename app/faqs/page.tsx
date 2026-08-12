import type { Metadata } from 'next'
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import Script from 'next/script'
import { SITE_URL } from '@/lib/seoKeywords'

const pageUrl = `${SITE_URL}/faqs`

export const metadata: Metadata = {
  title: 'Web Development & Project Rescue FAQs | Cost, Timeline & Support | Arfa Developers',
  description:
    'FAQs on web development cost, project rescue, failed freelancer takeovers, timelines, SEO services, and ongoing support. Straight answers from a US web development agency.',
  keywords: [
    'web development cost',
    'project rescue cost',
    'failed freelancer project',
    'how much does web development cost',
    'website rescue FAQ',
    'project takeover FAQ',
    'web development timeline',
    'SEO services FAQ',
  ],
  openGraph: {
    title: 'Web Development & Project Rescue FAQs | Arfa Developers',
    description: 'Answers on cost, timelines, project rescue, and support.',
    type: 'website',
    url: pageUrl,
  },
  alternates: {
    canonical: pageUrl,
  },
}

const faqs = [
  {
    question: 'How much does web development cost?',
    answer: 'Web development costs vary based on project scope, features, and complexity. Our pricing ranges from $2,500 for simple websites to $15,000+ for complex applications. We provide transparent quotes with no hidden costs. Contact us for a detailed estimate based on your specific requirements.',
  },
  {
    question: 'How long does a project take?',
    answer: 'Project timelines depend on scope and complexity. Simple websites typically take 2-4 weeks, while complex applications can take 2-4 months. We provide realistic timelines upfront and keep you informed throughout the process. For project rescues, we often deliver working solutions in days or weeks.',
  },
  {
    question: 'Can you take over an abandoned project?',
    answer: 'Yes! We specialize in rescuing abandoned or broken projects. We can assess any project, identify issues, and provide a recovery plan. We\'ve successfully rescued 200+ projects from freelancers and agencies. Contact us for a free assessment of your project.',
  },
  {
    question: 'Do you provide ongoing support?',
    answer: 'Yes, we offer ongoing support and maintenance packages. Unlike freelancers who disappear after delivery, we provide long-term support, updates, and improvements. Support packages are available starting from $200/month depending on your needs.',
  },
  {
    question: 'What if I\'m not satisfied with the work?',
    answer: 'We work closely with clients throughout the project to ensure satisfaction. If issues arise, we address them immediately. We offer revisions and fixes as part of our service. Our goal is your success, and we stand behind our work.',
  },
  {
    question: 'Do you work with small businesses?',
    answer: 'Absolutely! We work with businesses of all sizes, from startups to enterprises. We understand budget constraints and work within your budget to deliver the best possible solution. Our transparent pricing and flexible packages make quality web development accessible.',
  },
  {
    question: 'What technologies do you use?',
    answer: 'We use modern, industry-standard technologies including React, Next.js, Vue.js, Node.js, and more. We choose technologies based on your project needs, budget, and long-term goals. All our code is clean, documented, and maintainable.',
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Contact us through our contact form, schedule a free consultation, or request a free audit. We\'ll discuss your project, provide a quote, and answer any questions. No obligation, just honest advice.',
  },
  {
    question: 'Do you offer SEO services?',
    answer: 'Yes, we offer comprehensive SEO services including technical SEO, local SEO, SEO audits, and ongoing SEO management. Our SEO services range from $500-$3,000/month depending on your needs. We focus on realistic, long-term growth.',
  },
  {
    question: 'Can you fix a slow website?',
    answer: 'Yes! Website speed optimization is one of our specialties. We identify performance bottlenecks, optimize code, images, and infrastructure to dramatically improve load times. Faster websites rank better and convert more visitors.',
  },
]

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'FAQs',
      item: pageUrl,
    },
  ],
}

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function FAQsPage() {
  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
        <PageHero
          eyebrow={<HelpIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />}
          title={
            <>
              Frequently Asked{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Questions
              </Box>
            </>
          }
          subtitle="Straight answers to common questions about cost, timeline, trust, and our services."
        />

        {/* FAQs */}
        <Container maxWidth="md" sx={{ py: 8 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              elevation={2}
              sx={{
                mb: 2,
                borderRadius: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#0C1222' }} />}
                sx={{
                  backgroundColor: '#F7F8FA',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#F3F4F6',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0C1222' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0C1222' }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
            Contact us and we&apos;ll be happy to answer any questions you have.
          </Typography>
        </Box>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}
