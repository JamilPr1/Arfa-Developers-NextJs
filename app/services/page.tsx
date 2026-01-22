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
} from '@mui/icons-material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Our Services - Web Development, Mobile Apps, Cloud Solutions | Arfa Developers',
  description: 'Comprehensive web development services including custom web applications, mobile app development, cloud solutions, data analytics, security, and performance optimization. Serving USA, UK, Qatar, and Saudi Arabia.',
  keywords: [
    'web development services',
    'custom web applications',
    'mobile app development',
    'cloud solutions',
    'data analytics services',
    'security compliance',
    'performance optimization',
    'enterprise software development',
    'ecommerce development',
    'SaaS development',
    'full stack development',
    'react development',
    'next.js development',
    'node.js development',
    'web development company USA',
    'web development company UK',
    'web development Qatar',
    'web development Saudi Arabia',
  ],
  openGraph: {
    title: 'Our Services - Web Development, Mobile Apps, Cloud Solutions | Arfa Developers',
    description: 'Expert web development services including custom web applications, mobile apps, cloud solutions, and enterprise software. Serving USA, UK, Qatar, and Saudi Arabia.',
    type: 'website',
    url: 'https://arfadevelopers.com/services',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/services',
  },
}

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
      <Box component="main" sx={{ pt: 8 }}>
        {/* Hero Section with Pain Points */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
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
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
              }}
            >
              Tired of{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Failed Projects
              </Box>
              {' '}and{' '}
              <Box component="span" sx={{ color: '#ffd700' }}>
                Broken Websites
              </Box>
              ?
            </Typography>
            <Typography
              variant="h4"
              sx={{
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
            <Grid container spacing={3} sx={{ mt: 6, mb: 4, maxWidth: 1000, mx: 'auto' }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    ⚠️ Project Delays
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    💸 Wasted Budget
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    🐛 Buggy Code
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                Get Your Free Consultation
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Services Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} key={service.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        color: '#1E3A8A',
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
                          color: '#1E3A8A',
                        }}
                      >
                        {service.title}
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

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1E3A8A' }}>
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
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Why Choose Us Section */}
        <Box sx={{ bgcolor: '#F9FAFB', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                color: '#1E3A8A',
              }}
            >
              Why Choose Arfa Developers?
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 2 }}>
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 2 }}>
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E3A8A', mb: 2 }}>
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
