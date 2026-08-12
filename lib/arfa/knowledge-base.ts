import { siteConfig } from '@/lib/siteConfig'
import { getProductsKnowledge } from './products-knowledge'

/**
 * Grounded knowledge for Arfa voice assistant — sourced from arfadevelopers.com content.
 * Update this file when website copy, pricing, or services change.
 */
export const WEBSITE_KNOWLEDGE = {
  company: {
    name: 'Arfa Developers',
    tagline: 'Web Development Agency USA & Project Rescue',
    about:
      'Arfa Developers is a US-focused web development agency specializing in custom Next.js/React applications, project rescue, and failed project takeover. We fix broken builds and ship production-ready software for US businesses.',
    locations: siteConfig.locationsDisplay,
    serving: siteConfig.servingDisplay,
    contact: {
      email: siteConfig.contactEmail,
      phone: siteConfig.phoneDisplay,
      phoneE164: siteConfig.phoneE164,
      whatsapp: siteConfig.whatsappLink,
      website: siteConfig.siteUrl,
    },
    specialties: [
      'Custom web applications (React, Next.js, Vue.js)',
      'Mobile app development (React Native, Flutter)',
      'Project rescue — taking over abandoned or failed freelancer projects',
      'Cloud solutions (AWS, Azure, GCP)',
      'E-commerce development',
      'SEO and digital marketing',
      'Performance optimization and security compliance',
    ],
    differentiators: [
      'Rescued 200+ abandoned or poorly executed projects',
      'Fast recovery — working solutions in days instead of months',
      'Long-term support and maintenance (unlike freelancers who disappear)',
      'Clean, production-ready code with documentation',
      'Free consultation available',
    ],
    commonIssuesWeFix: [
      'Incomplete or abandoned projects',
      'Poor code quality and security vulnerabilities',
      'No documentation or handover process',
      'Missing deadlines and communication breakdowns',
      'Scalability and performance issues',
      'Lack of ongoing support and maintenance',
    ],
  },
  services: [
    {
      name: 'Web Development',
      description:
        'Custom web applications built with React, Next.js, and Vue.js. Scalable, fast, and user-friendly.',
    },
    {
      name: 'Mobile App Development',
      description: 'Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.',
    },
    {
      name: 'Cloud Solutions',
      description: 'AWS, Azure, and GCP cloud infrastructure setup, management, and scalable architectures.',
    },
    {
      name: 'Data Analytics',
      description: 'Business intelligence and data analytics — transform data into actionable insights.',
    },
    {
      name: 'Security & Compliance',
      description: 'Enterprise-grade security. GDPR, HIPAA, and SOC 2 compliance implementation.',
    },
    {
      name: 'Performance Optimization',
      description: 'Speed up applications with advanced optimization. Improve SEO and user experience.',
    },
    {
      name: 'Project Rescue',
      description:
        'We take over failed, abandoned, or poorly built projects from freelancers and inexperienced developers.',
      url: '/project-rescue',
    },
    {
      name: 'Website Redesign',
      description: 'Fix broken UX, slow performance, and poor conversions.',
    },
    {
      name: 'E-commerce Development',
      description: 'Simple, scalable online stores focused on sales and conversion.',
    },
    {
      name: 'SEO Services',
      description: 'Transparent, realistic SEO focused on long-term organic growth.',
    },
    {
      name: 'Digital Marketing',
      description: 'Cost-controlled marketing campaigns focused on ROI.',
    },
  ],
  pricing: [
    {
      name: 'Web Development',
      range: '$2,500 - $15,000+',
      description: 'Custom web applications built to your specifications',
      includes: ['Custom design', 'Responsive mobile-first', 'CMS', 'SEO', 'Performance optimization', '3 months support'],
    },
    {
      name: 'Website Redesign',
      range: '$1,500 - $8,000',
      description: 'Fix broken UX, slow performance, and poor conversions',
      includes: ['UX/UI redesign', 'CRO', 'Mobile responsiveness', 'SEO improvements', '2 months support'],
    },
    {
      name: 'Landing Pages',
      range: '$500 - $2,500',
      description: 'High-converting pages for ads, launches, and offers',
      includes: ['Custom design', 'A/B testing setup', 'Fast loading', 'Conversion tracking', '1 month support'],
    },
    {
      name: 'E-commerce Development',
      range: '$3,000 - $20,000+',
      description: 'Scalable online stores focused on sales',
      includes: ['Custom platform', 'Payment integration', 'Inventory & order management', '6 months support'],
    },
    {
      name: 'SEO Services',
      range: '$500 - $3,000/month',
      description: 'Long-term organic growth strategy',
      includes: ['Keyword research', 'Content creation', 'Link building', 'Monthly reporting'],
    },
    {
      name: 'Digital Marketing',
      range: '$1,000 - $5,000/month',
      description: 'ROI-focused multi-channel campaigns',
      includes: ['Campaign management', 'Conversion tracking', 'A/B testing', 'Monthly strategy review'],
    },
  ],
  pages: [
    { path: '/', title: 'Home', description: 'Main landing page with services overview' },
    { path: '/about', title: 'About Us', description: 'Company story and team' },
    { path: '/products', title: 'Products', description: 'Software products — Voice Agent, POS, CRM, HRM, E-commerce, School ERP, Healthcare, Real Estate, and more' },
    { path: '/case-studies', title: 'Case Studies', description: 'Detailed project success stories' },
    { path: '/pricing', title: 'Pricing', description: 'Transparent pricing packages and ranges' },
    { path: '/contact', title: 'Contact', description: 'Get in touch for a free consultation' },
    { path: '/project-rescue', title: 'Project Rescue', description: 'Failed project takeover and recovery' },
    { path: '/free-audit', title: 'Free Audit', description: 'Free website or project audit' },
    { path: '/hire-talent', title: 'Hire Talent', description: 'Hire dedicated developers' },
    { path: '/hire-nextjs-developers-usa', title: 'Hire Next.js Developers', description: 'US-based Next.js experts' },
    { path: '/custom-software-development-usa', title: 'Custom Software', description: 'Custom software for US businesses' },
    { path: '/our-process', title: 'Our Process', description: 'How we work with clients' },
    { path: '/faqs', title: 'FAQs', description: 'Frequently asked questions' },
    { path: '/blog', title: 'Blog', description: 'Articles on web development and SEO' },
    { path: '/automation', title: 'Automation', description: 'Business automation solutions' },
  ],
  faq: [
    {
      q: 'Do you offer free consultations?',
      a: 'Yes. We offer a free consultation to discuss your project, timeline, and budget.',
    },
    {
      q: 'Can you rescue a failed project?',
      a: 'Yes. Project rescue is one of our core specialties. We assess, fix, and rebuild abandoned or poorly executed projects.',
    },
    {
      q: 'What technologies do you use?',
      a: 'We primarily use React, Next.js, Node.js, React Native, Flutter, and cloud platforms like AWS, Azure, and GCP.',
    },
    {
      q: 'Where are you located?',
      a: `We are based in ${siteConfig.locationsDisplay} and serve clients globally, with a focus on US businesses.`,
    },
    {
      q: 'How do I get started?',
      a: 'Contact us via the contact page, WhatsApp, or schedule a free consultation. We respond within 24 hours.',
    },
  ],
  aiProducts: {
    note: 'Arfa Developers builds production-ready software products. When users ask about products, list relevant ones with name, price, and key features from the products array below. Direct them to /products for the full catalog or /products/[slug] for a specific product page.',
    storefrontUrl: 'https://www.arfadevelopers.com/products',
  },
}

export function buildKnowledgePrompt(): string {
  const products = getProductsKnowledge()
  return JSON.stringify({ ...WEBSITE_KNOWLEDGE, products }, null, 2)
}
