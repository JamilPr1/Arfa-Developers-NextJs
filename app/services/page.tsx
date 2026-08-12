import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Card, CardContent, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Divider, Chip } from '@mui/material'
import {
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  ShoppingCart as EcommerceIcon,
  Business as EnterpriseIcon,
  Storage as DatabaseIcon,
  Api as ApiIcon,
  Refresh as RedesignIcon,
  Campaign as LandingPageIcon,
  Search as SeoIcon,
  Build as TechnicalSeoIcon,
  LocationOn as LocalSeoIcon,
  Assessment as SeoAuditIcon,
  Campaign as DigitalMarketingIcon,
  AdsClick as GoogleAdsIcon,
  Article as ContentMarketingIcon,
  Email as EmailMarketingIcon,
  SmartToy as AiIcon,
  Hub as AutomationIcon,
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import PageHero from '@/components/PageHero'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Our Services - AI/ML, LLM Apps, Web, Automation & Cloud | Arfa Developers',
  description:
    'US web development agency offering AI/ML & LLM apps, voice agents, business automation, Next.js/React development, mobile apps, cloud, and project rescue.',
  keywords: [
    'AI ML LLM development',
    'OpenAI integration services',
    'RAG chatbot development',
    'AI voice agents',
    'business automation',
    'WhatsApp automation',
    'web development services',
    'custom web applications',
    'mobile app development',
    'cloud solutions',
    'Next.js development',
    'React development',
    'project rescue USA',
    'web development company USA',
  ],
  openGraph: {
    title: 'Our Services - AI/ML, LLM, Automation & Web Development | Arfa Developers',
    description:
      'AI/ML & LLM apps, voice agents, automation, Next.js/React web apps, mobile, cloud, and project rescue for US businesses.',
    type: 'website',
    url: 'https://arfadevelopers.com/services',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/services',
  },
}

const services = [
  {
    id: 'ai-ml-llm',
    icon: <AiIcon sx={{ fontSize: 60 }} />,
    title: 'AI / ML & LLM Apps',
    shortDescription:
      'OpenAI integrations, RAG chatbots, AI voice agents, and LLM-powered products wired into real business workflows.',
    fullDescription:
      'We build production AI systems — not demos. From grounded RAG assistants and sales voice agents to custom LLM workflows, we connect models to your data, CRM, and ops so AI actually drives revenue and saves time.',
    features: [
      'OpenAI / LLM app development with guardrails',
      'RAG chatbots grounded on your docs and product data',
      'AI voice agents for sales, support, and lead qualification',
      'Embeddings, vector search, and knowledge-base pipelines',
      'Prompt engineering, evaluation, and low-hallucination design',
      'Tool calling / function calling into your APIs and CRM',
      'WhatsApp & messaging AI with human handoff',
      'Fine-tuning and retrieval strategies for domain accuracy',
      'Analytics on AI usage, cost, and conversion impact',
      'Secure deployment with secrets, rate limits, and monitoring',
    ],
    technologies: [
      'OpenAI',
      'GPT-4o',
      'LangChain',
      'RAG',
      'Pinecone',
      'pgvector',
      'Whisper',
      'TTS',
      'Next.js',
      'Python',
    ],
    useCases: [
      'AI sales & support voice agents',
      'Internal knowledge assistants',
      'Customer-facing chatbots',
      'Document Q&A and compliance helpers',
      'Lead qualification copilots',
      'Product recommendation agents',
    ],
  },
  {
    id: 'web-development',
    icon: <WebIcon sx={{ fontSize: 60 }} />,
    title: 'Web Development',
    shortDescription:
      'Custom web apps with React, Next.js, TypeScript, and modern APIs — scalable, SEO-ready, and production-grade.',
    fullDescription:
      'We specialize in building custom web applications that are scalable, performant, and user-friendly. Our team ships with Next.js App Router, React, TypeScript, and modern backends so your product is maintainable long after launch.',
    features: [
      'Custom Web Application Development',
      'Next.js App Router, React Server Components & TypeScript',
      'Progressive Web Apps (PWA)',
      'Single Page Applications (SPA)',
      'Server-Side Rendering (SSR) & SEO-ready architecture',
      'Responsive Design & Mobile-First Approach',
      'API Integration & Third-Party Services',
      'Headless CMS & content platforms',
      'E-commerce Platform Development',
      'Real-time Applications with WebSockets',
    ],
    technologies: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'MongoDB',
      'Prisma',
      'Tailwind',
      'Vercel',
      'Supabase',
    ],
    useCases: [
      'Business Web Applications',
      'Customer Portals',
      'Admin Dashboards',
      'SaaS Platforms',
      'E-commerce Stores',
      'Content Management Systems',
    ],
  },
  {
    id: 'business-automation',
    icon: <AutomationIcon sx={{ fontSize: 60 }} />,
    title: 'Business Automation',
    shortDescription:
      'WhatsApp, Meta CRM, workflow automation, and AI drafts that cut manual ops for sales and support teams.',
    fullDescription:
      'We automate the busywork — messaging flows, CRM sync, lead routing, follow-ups, and AI-assisted replies — so your team focuses on conversations that need a human. Built for US sales and support ops that need reliability, not fragile Zap spaghetti.',
    features: [
      'WhatsApp Business & Meta messaging automation',
      'CRM sync, lead capture, and pipeline routing',
      'AI draft replies with clear human escalation',
      'n8n / Zapier / custom workflow orchestration',
      'Appointment booking and reminder automation',
      'Invoice, notification, and status update flows',
      'Ops dashboards for automation health & volume',
      'Multi-channel inbox handoff (web, chat, WhatsApp)',
      'Error handling, retries, and audit logs',
      'Integration with Stripe, calendars, and internal APIs',
    ],
    technologies: ['WhatsApp API', 'Meta CRM', 'n8n', 'Zapier', 'OpenAI', 'Make', 'Node.js', 'Webhooks', 'Slack'],
    useCases: [
      'Sales follow-up automation',
      'Support ticket triage',
      'Lead qualification bots',
      'Appointment & reminder flows',
      'CRM enrichment pipelines',
      'Internal ops alerts',
    ],
  },
  {
    id: 'mobile-app-development',
    icon: <MobileIcon sx={{ fontSize: 60 }} />,
    title: 'Mobile App Development',
    shortDescription: 'Native and cross-platform mobile applications for iOS and Android. React Native and Flutter expertise.',
    fullDescription: 'We develop high-performance mobile applications for iOS and Android platforms. Whether you need native apps or cross-platform solutions, we deliver apps that provide exceptional user experiences and drive engagement.',
    features: [
      'Native iOS Development (Swift, Objective-C)',
      'Native Android Development (Kotlin, Java)',
      'Cross-Platform Development (React Native, Flutter)',
      'Mobile App UI/UX Design',
      'App Store Optimization (ASO)',
      'Push Notifications Integration',
      'In-App Purchases & Payment Integration',
      'Offline Functionality',
      'App Analytics & Performance Monitoring',
      'App Maintenance & Updates',
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS SDK', 'Android SDK', 'Firebase', 'AWS Amplify'],
    useCases: [
      'Consumer Mobile Apps',
      'Enterprise Mobile Solutions',
      'E-commerce Mobile Apps',
      'Social Media Applications',
      'Healthcare Apps',
      'FinTech Applications',
    ],
  },
  {
    id: 'cloud-solutions',
    icon: <CloudIcon sx={{ fontSize: 60 }} />,
    title: 'Cloud Solutions',
    shortDescription: 'AWS, Azure, and GCP cloud infrastructure setup and management. Scalable cloud architectures for your business.',
    fullDescription: 'We help businesses migrate to the cloud and build scalable, secure cloud infrastructures. Our cloud solutions reduce costs, improve performance, and enable global scalability.',
    features: [
      'Cloud Migration & Strategy',
      'AWS, Azure, and GCP Setup',
      'Serverless Architecture',
      'Container Orchestration (Docker, Kubernetes)',
      'Cloud Security & Compliance',
      'Auto-scaling & Load Balancing',
      'Cloud Cost Optimization',
      'Disaster Recovery & Backup Solutions',
      'CI/CD Pipeline Setup',
      'Infrastructure as Code (IaC)',
    ],
    technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Vercel', 'CI/CD'],
    useCases: [
      'Cloud Migration Projects',
      'Scalable Web Applications',
      'Microservices Architecture',
      'Big Data Processing',
      'IoT Solutions',
      'Enterprise Cloud Infrastructure',
    ],
  },
  {
    id: 'data-analytics',
    icon: <AnalyticsIcon sx={{ fontSize: 60 }} />,
    title: 'Data Analytics & ML Insights',
    shortDescription:
      'Business intelligence, predictive analytics, and ML-powered dashboards that turn data into decisions.',
    fullDescription:
      'We transform raw data into actionable business insights. From BI dashboards to predictive models, we help you spot trends, forecast demand, and optimize operations with clear reporting.',
    features: [
      'Business Intelligence (BI) Solutions',
      'Data Warehousing & ETL Processes',
      'Real-time Analytics Dashboards',
      'Predictive Analytics & Machine Learning',
      'Data Visualization & Reporting',
      'Custom Analytics Platforms',
      'Data Integration Services',
      'Performance Metrics & KPI Tracking',
      'Customer Analytics',
      'Financial Analytics & Reporting',
    ],
    technologies: ['Python', 'SQL', 'Tableau', 'Power BI', 'TensorFlow', 'Pandas', 'dbt', 'BigQuery'],
    useCases: [
      'Business Intelligence Dashboards',
      'Sales & Marketing Analytics',
      'Customer Behavior Analysis',
      'Financial Reporting Systems',
      'Operational Analytics',
      'Predictive Modeling',
    ],
  },
  {
    id: 'security-compliance',
    icon: <SecurityIcon sx={{ fontSize: 60 }} />,
    title: 'Security & Compliance',
    shortDescription: 'Enterprise-grade security solutions. GDPR, HIPAA, and SOC 2 compliance implementation.',
    fullDescription: 'We implement enterprise-grade security measures and ensure compliance with industry standards. Protect your applications and data with robust security solutions tailored to your industry requirements.',
    features: [
      'Security Audits & Penetration Testing',
      'GDPR Compliance Implementation',
      'HIPAA Compliance for Healthcare',
      'SOC 2 Type II Compliance',
      'PCI DSS Compliance for Payments',
      'SSL/TLS Certificate Management',
      'Identity & Access Management (IAM)',
      'Data Encryption & Protection',
      'Security Monitoring & Incident Response',
      'Vulnerability Assessment',
    ],
    technologies: ['OWASP', 'SSL/TLS', 'OAuth 2.0', 'JWT', 'Encryption', 'Firewalls', 'SIEM', 'Security Frameworks'],
    useCases: [
      'Healthcare Applications (HIPAA)',
      'Financial Services (PCI DSS)',
      'E-commerce Security',
      'Enterprise Data Protection',
      'Government Compliance',
      'International Data Regulations',
    ],
  },
  {
    id: 'performance-optimization',
    icon: <SpeedIcon sx={{ fontSize: 60 }} />,
    title: 'Performance Optimization',
    shortDescription: 'Speed up your applications with advanced optimization techniques. Improve SEO and user experience.',
    fullDescription: 'We optimize your applications for maximum performance, speed, and user experience. Our optimization services improve load times, reduce bounce rates, and enhance overall user satisfaction while boosting SEO rankings.',
    features: [
      'Website Speed Optimization',
      'Database Query Optimization',
      'Code Optimization & Refactoring',
      'CDN Setup & Configuration',
      'Image & Asset Optimization',
      'Caching Strategy Implementation',
      'SEO Optimization',
      'Core Web Vitals Improvement',
      'Mobile Performance Optimization',
      'API Performance Tuning',
    ],
    technologies: ['CDN', 'Redis', 'Memcached', 'Webpack', 'Vite', 'Lighthouse', 'PageSpeed Insights', 'Optimization Tools'],
    useCases: [
      'Slow Website Optimization',
      'E-commerce Performance',
      'API Performance Improvement',
      'Mobile App Performance',
      'SEO Ranking Improvement',
      'User Experience Enhancement',
    ],
  },
  {
    id: 'ecommerce-development',
    icon: <EcommerceIcon sx={{ fontSize: 60 }} />,
    title: 'E-commerce Development',
    shortDescription: 'Custom e-commerce platforms and online stores. Secure payment processing and inventory management.',
    fullDescription: 'We build robust e-commerce platforms that drive sales and provide exceptional shopping experiences. From custom online stores to marketplace integrations, we deliver solutions that scale with your business.',
    features: [
      'Custom E-commerce Platform Development',
      'Shopping Cart & Checkout Systems',
      'Payment Gateway Integration',
      'Inventory Management Systems',
      'Order Management & Fulfillment',
      'Product Catalog Management',
      'Multi-vendor Marketplace Development',
      'Subscription & Recurring Billing',
      'Customer Account Management',
      'Analytics & Reporting',
    ],
    technologies: ['Shopify', 'WooCommerce', 'Magento', 'Custom Solutions', 'Stripe', 'PayPal', 'Payment APIs'],
    useCases: [
      'Online Retail Stores',
      'B2B E-commerce Platforms',
      'Marketplace Applications',
      'Subscription-Based Businesses',
      'Digital Product Sales',
      'Multi-channel Commerce',
    ],
  },
  {
    id: 'enterprise-solutions',
    icon: <EnterpriseIcon sx={{ fontSize: 60 }} />,
    title: 'Enterprise Software Solutions',
    shortDescription: 'Custom enterprise software for large organizations. Scalable, secure, and integrated solutions.',
    fullDescription: 'We develop enterprise-grade software solutions that streamline operations, improve efficiency, and drive business growth. Our enterprise solutions are built to scale and integrate seamlessly with existing systems.',
    features: [
      'Enterprise Resource Planning (ERP)',
      'Customer Relationship Management (CRM)',
      'Human Resources Management Systems (HRMS)',
      'Supply Chain Management',
      'Document Management Systems',
      'Workflow Automation',
      'Enterprise Integration Services',
      'Legacy System Modernization',
      'Custom Business Applications',
      'Enterprise Security Solutions',
    ],
    technologies: ['Enterprise Frameworks', 'Microservices', 'API Integration', 'Database Systems', 'Enterprise Tools'],
    useCases: [
      'Large Organization Software',
      'Multi-location Business Systems',
      'Enterprise Process Automation',
      'Legacy System Replacement',
      'Integrated Business Solutions',
      'Corporate Portals',
    ],
  },
]

// Structured Data for SEO
const servicesStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Web Development Services',
  description: 'Comprehensive web development and software solutions',
  itemListElement: services.map((service, index) => ({
    '@type': 'Service',
    position: index + 1,
    name: service.title,
    description: service.fullDescription,
    provider: {
      '@type': 'Organization',
      name: 'Arfa Developers',
      url: 'https://arfadevelopers.com',
    },
    areaServed: ['United States', 'United Kingdom', 'Qatar', 'Saudi Arabia'],
    serviceType: service.title,
  })),
}

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
      name: 'Services',
      item: 'https://arfadevelopers.com/services',
    },
  ],
}

export default function ServicesPage() {
  return (
    <>
      <Script
        id="services-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
        <PageHero
          title={
            <>
              Tired of{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>Failed Projects</Box>
              {' '}and{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>Broken Websites</Box>?
            </>
          }
          subtitle="We've rescued 200+ failed projects from freelancers and inexperienced developers. Get enterprise-grade solutions that actually work."
          ctaText="Get Free Consultation"
          ctaHref="/contact"
          actions={
            <>
              <Button component={Link} href="/ai-automation" variant="contained" size="large">
                AI / ML & Automation
              </Button>
              <Button component={Link} href="/project-rescue" variant="outlined" size="large">
                Project Rescue
              </Button>
            </>
          }
        />

        <Box sx={{ bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider', py: { xs: 4, md: 5 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  New: AI automation, LLM apps &amp; n8n workflows
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Production OpenAI/RAG chatbots, AI voice agents, WhatsApp automation, and n8n
                  pipelines built for US teams that need results — not demos.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button component={Link} href="/ai-automation" variant="contained" size="large">
                  Explore AI Automation
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Hero Section with Pain Points — kept content below */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pb: { xs: 6, md: 8 },
            pt: 2,
            textAlign: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            {/* Pain Points Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 0 } }}>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
                  >
                    Incomplete Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Freelancers disappear mid-build — we finish what they started.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Poor Code Quality
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Security holes and unmaintainable code — we rebuild it right.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    No Ongoing Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivery without support — we stay for maintenance and growth.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ display: 'none' }}>
        {/* OLD HERO PLACEHOLDER REMOVED CONTENT START */}
        <Box
          sx={{
            background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
            color: '#0C1222',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 12 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: 'radial-gradient(circle at 100% 0%, rgba(29,78,216,0.06) 0%, transparent 50%)',
              opacity: 0.5,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                color: '#0C1222',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
              }}
            >
              Tired of{' '}
              <Box component="span" sx={{ color: '#1D4ED8' }}>
                Failed Projects
              </Box>
              {' '}and{' '}
              <Box component="span" sx={{ color: '#1D4ED8' }}>
                Broken Websites
              </Box>
              ?
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#0C1222',
                maxWidth: 900,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: { xs: '1.25rem', md: '1.75rem' },
              }}
            >
              We&apos;ve rescued <strong>200+ failed projects</strong> from freelancers and inexperienced developers. 
              Get enterprise-grade solutions that actually work.
            </Typography>
            
            {/* Pain Points Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 3, sm: 4 }, maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 0 } }}>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#0C1222',
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                    }}
                  >
                    ⚠️ Project Delays
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                    }}
                  >
                    Missing deadlines? We deliver on time, every time.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#0C1222',
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                    }}
                  >
                    💸 Wasted Budget
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                    }}
                  >
                    Throwing money at broken code? We fix it right the first time.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#0C1222',
                      fontWeight: 700, 
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                    }}
                  >
                    🐛 Buggy Code
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                    }}
                  >
                    Constant crashes? We build stable, scalable solutions.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="#contact"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#0C1222',
                  color: '#FFFFFF',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#1E293B',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Your Free Consultation
              </Button>
            </Box>
          </Container>
        </Box>
        </Box>

        {/* Services Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {services.map((service, index) => (
              <Grid item xs={12} key={service.id}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 1,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        color: '#0C1222',
                        mr: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        bgcolor: '#EFF6FF',
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: '#0C1222',
                        }}
                      >
                        <Link
                          href={`/services/${service.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {service.title}
                        </Link>
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                        {service.shortDescription}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                    {service.fullDescription}
                  </Typography>

                  <Grid container spacing={{ xs: 3, sm: 4 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0C1222' }}>
                        Key Features
                      </Typography>
                      <List>
                        {service.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckIcon sx={{ color: '#10B981', fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{
                                variant: 'body1',
                                sx: { lineHeight: 1.6 },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0C1222' }}>
                        Technologies & Tools
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {service.technologies.map((tech, idx) => (
                          <Chip
                            key={idx}
                            label={tech}
                            sx={{
                              backgroundColor: '#EFF6FF',
                              color: '#0C1222',
                              fontWeight: 500,
                              '&:hover': {
                                backgroundColor: '#DBEAFE',
                              },
                            }}
                          />
                        ))}
                      </Box>

                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, mt: 3, color: '#0C1222' }}>
                        Common Use Cases
                      </Typography>
                      <List dense>
                        {service.useCases.map((useCase, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CodeIcon sx={{ color: '#2563EB', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={useCase}
                              primaryTypographyProps={{
                                variant: 'body2',
                                sx: { lineHeight: 1.6 },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Why Choose Us Section */}
        <Box sx={{ bgcolor: '#F7F8FA', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                color: '#0C1222',
              }}
            >
              Why Choose Arfa Developers?
            </Typography>
            <Grid container spacing={{ xs: 3, sm: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#0C1222', mb: 2 }}>
                    200+
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Projects Rescued
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We&apos;ve successfully rescued and completed over 200 failed projects from freelancers and inexperienced developers.
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#0C1222', mb: 2 }}>
                    50+
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Happy Clients
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our clients trust us with their critical projects. We maintain long-term relationships built on quality and reliability.
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#0C1222', mb: 2 }}>
                    24/7
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Support Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Round-the-clock support ensures your projects run smoothly. We&apos;re always here when you need us.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box id="contact">
          <CTA />
        </Box>
      </Box>
      <Footer />
    </>
  )
}
