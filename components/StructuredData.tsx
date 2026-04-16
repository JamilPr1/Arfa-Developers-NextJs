export default function StructuredData() {
  const siteUrl = 'https://www.arfadevelopers.com'
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Arfa Developers',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'US-focused web development agency building custom web applications and rescuing failed projects. We take over broken builds, fix performance and security issues, and ship production-ready software.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: ['US'],
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 5,
      reviewCount: 50,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'sales@arfadevelopers.com',
        areaServed: 'US',
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development & Project Rescue Services',
    provider: {
      '@type': 'Organization',
      name: 'Arfa Developers',
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
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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
