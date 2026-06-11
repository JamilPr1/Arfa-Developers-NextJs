import { siteConfig } from '@/lib/siteConfig'

export default function StructuredData() {
  const siteUrl = siteConfig.siteUrl
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    email: siteConfig.contactEmail,
    telephone: siteConfig.phoneE164,
    description:
      'US-focused web development agency building custom web applications and rescuing failed projects. We take over broken builds, fix performance and security issues, and ship production-ready software.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: ['US', 'PK'],
    },
    areaServed: ['Worldwide'],
    location: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    serviceType: [
      'Web Development',
      'Mobile App Development',
      'Custom Software Development',
      'Enterprise Solutions',
      'E-commerce Development',
      'SaaS Development',
      'Project Rescue',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.contactEmail,
        telephone: siteConfig.phoneE164,
        areaServed: ['US', 'PK', 'Global'],
        availableLanguage: ['en'],
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development & Project Rescue Services',
    provider: {
      '@type': 'Organization',
      name: siteConfig.brandName,
    },
    areaServed: ['United States'],
    description:
      'Custom web development, SaaS and eCommerce builds, and project rescue (takeover + recovery). We specialize in fixing broken websites, completing abandoned builds, and improving performance and security.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free consultation available',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Arfa Developers',
    url: siteUrl,
    description:
      'Web development agency USA — custom apps, project rescue, and website recovery.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
