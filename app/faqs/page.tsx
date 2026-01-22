import type { Metadata } from 'next'
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'FAQs - Straight Answers to Common Questions | Arfa Developers',
  description: 'Straight answers to common questions about cost, timeline, trust, and our services. Get clarity on web development, project rescue, and pricing.',
  keywords: [
    'web development FAQs',
    'project rescue questions',
    'pricing questions',
    'timeline questions',
    'web development cost',
    'project rescue cost',
  ],
  openGraph: {
    title: 'FAQs - Straight Answers to Common Questions | Arfa Developers',
    description: 'Straight answers to common questions about cost, timeline, and our services.',
    type: 'website',
    url: 'https://arfadevelopers.com/faqs',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/faqs',
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
      item: 'https://arfadevelopers.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'FAQs',
      item: 'https://arfadevelopers.com/faqs',
    },
  ],
}

export default function FAQsPage() {
  return (
    <>
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            color: 'white',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 12 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <HelpIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                color: 'white',
              }}
            >
              Frequently Asked <span style={{ color: '#F59E0B' }}>Questions</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                maxWidth: 800,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              Straight answers to common questions about cost, timeline, trust, and our services.
            </Typography>
          </Container>
        </Box>

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
                expandIcon={<ExpandMoreIcon sx={{ color: '#1E3A8A' }} />}
                sx={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#F3F4F6',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
            Contact us and we'll be happy to answer any questions you have.
          </Typography>
        </Box>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}
