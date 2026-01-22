import type { Metadata } from 'next'
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Divider, Chip } from '@mui/material'
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
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'

const services = [
  {
    id: 'web-development',
    icon: <WebIcon sx={{ fontSize: 60 }} />,
    title: 'Web Development',
    shortDescription: 'Custom web applications built with modern frameworks like React, Next.js, and Vue.js. Scalable, fast, and user-friendly.',
    fullDescription: 'We specialize in building custom web applications that are scalable, performant, and user-friendly. Our team leverages modern frameworks and technologies to deliver solutions that drive business growth.',
    features: [
      'Custom Web Application Development',
      'React, Next.js, Vue.js, and Angular Expertise',
      'Progressive Web Apps (PWA)',
      'Single Page Applications (SPA)',
      'Server-Side Rendering (SSR)',
      'Responsive Design & Mobile-First Approach',
      'API Integration & Third-Party Services',
      'Content Management Systems (CMS)',
      'E-commerce Platform Development',
      'Real-time Applications with WebSockets',
    ],
    technologies: ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
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
    technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CloudFormation', 'Serverless Framework'],
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
    title: 'Data Analytics',
    shortDescription: 'Business intelligence and data analytics solutions. Transform your data into actionable insights.',
    fullDescription: 'We transform raw data into actionable business insights. Our data analytics solutions help you make informed decisions, identify trends, and optimize business processes through comprehensive data analysis and visualization.',
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
    technologies: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'TensorFlow', 'Pandas', 'NumPy'],
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
  {
    id: 'website-redesign',
    icon: <RedesignIcon sx={{ fontSize: 60 }} />,
    title: 'Website Redesign',
    shortDescription: 'Fix broken UX, slow performance, and poor conversions. Transform your outdated website into a conversion machine.',
    fullDescription: 'We rescue and redesign websites that are failing to convert visitors into customers. Our redesign process focuses on fixing broken user experiences, improving site speed, and optimizing for conversions within your real budget constraints.',
    features: [
      'UX/UI Redesign & Improvement',
      'Performance Optimization & Speed Fixes',
      'Conversion Rate Optimization (CRO)',
      'Mobile Responsiveness Fixes',
      'Broken Functionality Repair',
      'SEO Improvements',
      'Modern Design Implementation',
      'User Testing & Analytics Integration',
      'Content Optimization',
      'A/B Testing Setup',
    ],
    technologies: ['Modern Frameworks', 'Performance Tools', 'Analytics', 'CRO Tools', 'Design Systems'],
    useCases: [
      'Outdated Website Redesign',
      'Low Conversion Rate Fixes',
      'Slow Website Performance',
      'Broken User Experience',
      'Mobile Unfriendly Sites',
      'Poor SEO Performance',
    ],
  },
  {
    id: 'landing-pages',
    icon: <LandingPageIcon sx={{ fontSize: 60 }} />,
    title: 'Landing Pages',
    shortDescription: 'High-converting pages for ads, launches, and offers. Built for real results, not vanity metrics.',
    fullDescription: 'We create high-converting landing pages designed to turn visitors into customers. Whether you need pages for paid ads, product launches, or special offers, we build pages focused on conversions and ROI.',
    features: [
      'High-Converting Landing Page Design',
      'A/B Testing & Optimization',
      'Fast Loading Times',
      'Mobile-First Responsive Design',
      'Lead Capture Forms',
      'Integration with Marketing Tools',
      'Conversion Tracking Setup',
      'Clear Call-to-Actions',
      'Trust Elements & Social Proof',
      'SEO Optimization',
    ],
    technologies: ['Next.js', 'React', 'Analytics', 'A/B Testing Tools', 'Marketing Integrations'],
    useCases: [
      'Paid Advertising Campaigns',
      'Product Launches',
      'Special Offers & Promotions',
      'Lead Generation',
      'Event Registrations',
      'Email List Building',
    ],
  },
  {
    id: 'seo-services',
    icon: <SeoIcon sx={{ fontSize: 60 }} />,
    title: 'SEO Services',
    shortDescription: 'Transparent, realistic SEO focused on long-term growth. No false promises, just real results.',
    fullDescription: 'We provide honest, transparent SEO services focused on sustainable, long-term growth. Our approach is data-driven, realistic, and focused on actual business outcomes rather than vanity metrics.',
    features: [
      'Comprehensive SEO Strategy',
      'Keyword Research & Optimization',
      'On-Page SEO Optimization',
      'Content Strategy & Creation',
      'Link Building & Outreach',
      'Technical SEO Audits',
      'Local SEO Optimization',
      'Performance Tracking & Reporting',
      'Competitor Analysis',
      'Long-term Growth Planning',
    ],
    technologies: ['SEO Tools', 'Analytics', 'Search Console', 'Ranking Tools', 'Content Management'],
    useCases: [
      'Organic Traffic Growth',
      'Search Engine Rankings',
      'Local Business Visibility',
      'E-commerce SEO',
      'Content Marketing SEO',
      'Long-term Brand Building',
    ],
  },
  {
    id: 'technical-seo',
    icon: <TechnicalSeoIcon sx={{ fontSize: 60 }} />,
    title: 'Technical SEO',
    shortDescription: 'Fix crawl, speed, and structure issues holding rankings back. Technical foundation for SEO success.',
    fullDescription: 'We fix the technical issues that prevent your website from ranking well in search engines. From crawl errors to site speed problems, we address the foundational technical elements that impact SEO performance.',
    features: [
      'Site Crawl Error Fixes',
      'Site Speed Optimization',
      'Mobile-First Indexing Optimization',
      'Schema Markup Implementation',
      'XML Sitemap Optimization',
      'Robots.txt Configuration',
      'Canonical URL Fixes',
      'HTTPS & Security Fixes',
      'Core Web Vitals Improvement',
      'Site Structure Optimization',
    ],
    technologies: ['SEO Tools', 'Performance Tools', 'Crawling Tools', 'Analytics', 'Technical Audits'],
    useCases: [
      'Crawl Error Resolution',
      'Site Speed Issues',
      'Indexing Problems',
      'Mobile Usability Fixes',
      'Technical SEO Audits',
      'Site Structure Problems',
    ],
  },
  {
    id: 'local-seo',
    icon: <LocalSeoIcon sx={{ fontSize: 60 }} />,
    title: 'Local SEO',
    shortDescription: 'Optimize for local searches, maps, and nearby customers. Get found by customers in your area.',
    fullDescription: 'We help local businesses get found by customers searching nearby. Our local SEO services optimize your online presence for Google Maps, local search results, and location-based queries.',
    features: [
      'Google Business Profile Optimization',
      'Local Keyword Optimization',
      'NAP (Name, Address, Phone) Consistency',
      'Local Citations & Directory Listings',
      'Google Maps Optimization',
      'Local Link Building',
      'Review Management & Strategy',
      'Local Content Creation',
      'Location Pages Optimization',
      'Local Schema Markup',
    ],
    technologies: ['Google Business Profile', 'Local SEO Tools', 'Citation Tools', 'Review Platforms'],
    useCases: [
      'Local Business Visibility',
      'Google Maps Rankings',
      'Near Me Searches',
      'Local Service Businesses',
      'Multi-location Businesses',
      'Local E-commerce',
    ],
  },
  {
    id: 'seo-audit',
    icon: <SeoAuditIcon sx={{ fontSize: 60 }} />,
    title: 'SEO Audit',
    shortDescription: 'One-time deep analysis with clear, actionable fixes. Know exactly what\'s holding your SEO back.',
    fullDescription: 'Get a comprehensive SEO audit that identifies exactly what\'s preventing your website from ranking well. We provide clear, actionable recommendations with prioritized fixes to improve your search engine performance.',
    features: [
      'Comprehensive Site Analysis',
      'Technical SEO Issues Identification',
      'On-Page SEO Evaluation',
      'Content Quality Assessment',
      'Backlink Profile Analysis',
      'Competitor Analysis',
      'Keyword Opportunity Research',
      'Performance Metrics Review',
      'Actionable Fix Recommendations',
      'Priority-Based Action Plan',
    ],
    technologies: ['SEO Audit Tools', 'Analytics', 'Crawling Tools', 'Competitor Analysis Tools'],
    useCases: [
      'SEO Performance Review',
      'Pre-Redesign Analysis',
      'Competitor Benchmarking',
      'Issue Identification',
      'Growth Opportunity Discovery',
      'One-Time Assessment',
    ],
  },
  {
    id: 'digital-marketing',
    icon: <DigitalMarketingIcon sx={{ fontSize: 60 }} />,
    title: 'Digital Marketing',
    shortDescription: 'Cost-controlled marketing focused on ROI, not vanity metrics. Real results within your budget.',
    fullDescription: 'We provide digital marketing services that focus on real ROI and business outcomes. Our approach is transparent, cost-controlled, and focused on metrics that actually matter to your business growth.',
    features: [
      'ROI-Focused Marketing Strategy',
      'Multi-Channel Campaign Management',
      'Conversion Tracking & Analytics',
      'Budget Optimization',
      'A/B Testing & Optimization',
      'Customer Journey Mapping',
      'Marketing Automation',
      'Performance Reporting',
      'Attribution Modeling',
      'Cost-Effective Campaigns',
    ],
    technologies: ['Marketing Platforms', 'Analytics', 'Automation Tools', 'Tracking Tools', 'Ad Platforms'],
    useCases: [
      'Business Growth',
      'Lead Generation',
      'Customer Acquisition',
      'Brand Awareness',
      'Product Launches',
      'Revenue Growth',
    ],
  },
  {
    id: 'google-ads-management',
    icon: <GoogleAdsIcon sx={{ fontSize: 60 }} />,
    title: 'Google Ads Management',
    shortDescription: 'Lean ad campaigns with testing and clear tracking. Maximize ROI with data-driven optimization.',
    fullDescription: 'We manage Google Ads campaigns that focus on real results and ROI. Our approach includes rigorous testing, clear tracking, and continuous optimization to maximize your advertising budget effectiveness.',
    features: [
      'Campaign Strategy & Setup',
      'Keyword Research & Optimization',
      'Ad Copy Creation & Testing',
      'Landing Page Optimization',
      'Bid Management & Optimization',
      'Conversion Tracking Setup',
      'A/B Testing & Experiments',
      'Performance Monitoring',
      'Budget Optimization',
      'ROI Reporting & Analysis',
    ],
    technologies: ['Google Ads', 'Analytics', 'Tracking Tools', 'Testing Platforms', 'Optimization Tools'],
    useCases: [
      'Lead Generation',
      'E-commerce Sales',
      'Local Business Advertising',
      'Product Promotions',
      'Service Advertising',
      'Brand Awareness',
    ],
  },
  {
    id: 'content-marketing',
    icon: <ContentMarketingIcon sx={{ fontSize: 60 }} />,
    title: 'Content Marketing',
    shortDescription: 'SEO-friendly content built to attract and convert. Content that drives real business results.',
    fullDescription: 'We create content that attracts your target audience, ranks in search engines, and converts visitors into customers. Our content marketing focuses on SEO-friendly, conversion-optimized content that drives real business results.',
    features: [
      'SEO-Optimized Content Creation',
      'Content Strategy Development',
      'Blog Writing & Management',
      'Content Calendar Planning',
      'Keyword-Optimized Articles',
      'Conversion-Focused Copywriting',
      'Content Distribution Strategy',
      'Content Performance Tracking',
      'Content Refresh & Updates',
      'Multi-Format Content Creation',
    ],
    technologies: ['Content Management', 'SEO Tools', 'Analytics', 'Content Platforms', 'Writing Tools'],
    useCases: [
      'Organic Traffic Growth',
      'Lead Generation',
      'Brand Authority Building',
      'SEO Content Strategy',
      'Educational Content',
      'Customer Engagement',
    ],
  },
  {
    id: 'email-marketing',
    icon: <EmailMarketingIcon sx={{ fontSize: 60 }} />,
    title: 'Email Marketing',
    shortDescription: 'Simple, effective email campaigns for retention and sales. Email marketing that converts.',
    fullDescription: 'We create and manage email marketing campaigns that drive retention, engagement, and sales. Our approach is simple, effective, and focused on building relationships with your customers through valuable, conversion-focused email content.',
    features: [
      'Email Campaign Strategy',
      'Newsletter Design & Creation',
      'Automated Email Sequences',
      'Segmentation & Personalization',
      'A/B Testing & Optimization',
      'List Growth Strategies',
      'Conversion Tracking',
      'Email Template Design',
      'Performance Analytics',
      'Retention Campaigns',
    ],
    technologies: ['Email Platforms', 'Automation Tools', 'Analytics', 'Design Tools', 'Tracking Tools'],
    useCases: [
      'Customer Retention',
      'Sales & Promotions',
      'Newsletter Campaigns',
      'Product Launches',
      'Customer Onboarding',
      'Re-engagement Campaigns',
    ],
  },
]

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((s) => s.id === slug)
  
  if (!service) {
    return {
      title: 'Service Not Found | Arfa Developers',
    }
  }

  return {
    title: `${service.title} - Professional Services | Arfa Developers`,
    description: service.fullDescription,
    keywords: [
      service.title.toLowerCase(),
      `${service.title} services`,
      'web development',
      'custom software',
      'enterprise solutions',
    ],
    openGraph: {
      title: `${service.title} - Professional Services | Arfa Developers`,
      description: service.fullDescription,
      type: 'website',
      url: `https://arfadevelopers.com/services/${service.id}`,
    },
    alternates: {
      canonical: `https://arfadevelopers.com/services/${service.id}`,
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services.find((s) => s.id === slug)

  if (!service) {
    notFound()
  }

  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.fullDescription,
    provider: {
      '@type': 'Organization',
      name: 'Arfa Developers',
      url: 'https://arfadevelopers.com',
    },
    areaServed: ['United States', 'United Kingdom', 'Qatar', 'Saudi Arabia', 'Pakistan'],
    serviceType: service.title,
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
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://arfadevelopers.com/services/${service.id}`,
      },
    ],
  }

  return (
    <>
      <Script
        id="service-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
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
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              opacity: 0.5,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {service.icon}
              </Box>
            </Box>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
              }}
            >
              {service.title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                maxWidth: 900,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 500,
                fontSize: { xs: '1.25rem', md: '1.75rem' },
              }}
            >
              {service.shortDescription}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                component={Link}
                href="#contact"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#FBBF24',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Free Consultation
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Service Details */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 3,
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 3, 
                color: '#1E3A8A',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              }}
            >
              About This Service
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              {service.fullDescription}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={{ xs: 3, sm: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: '#1E3A8A',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
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
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
                  Technologies & Tools
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {service.technologies.map((tech, idx) => (
                    <Chip
                      key={idx}
                      label={tech}
                      sx={{
                        backgroundColor: '#EFF6FF',
                        color: '#1E3A8A',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#DBEAFE',
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, mt: 3, color: '#1E3A8A' }}>
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
        </Container>

        {/* CTA Section */}
        <Box id="contact">
          <CTA />
        </Box>
      </Box>
      <Footer />
    </>
  )
}
