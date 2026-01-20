export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Arfa Developers',
    url: 'https://arfadevelopers.com',
    logo: 'https://arfadevelopers.com/logo.png',
    description: 'Expert web development agency serving USA, UK, Qatar, and Saudi Arabia. We rescue failed projects from freelancers and build custom web applications, mobile apps, and enterprise software solutions.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: ['US', 'GB', 'QA', 'SA'],
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
    serviceType: [
      'Web Development',
      'Mobile App Development',
      'Custom Software Development',
      'Enterprise Solutions',
      'E-commerce Development',
      'SaaS Development',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '50+',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development Services',
    provider: {
      '@type': 'Organization',
      name: 'Arfa Developers',
    },
    areaServed: ['United States', 'United Kingdom', 'Qatar', 'Saudi Arabia'],
    description: 'Custom web development, mobile app development, and enterprise software solutions. We specialize in rescuing failed projects from freelancers and inexperienced developers.',
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
    url: 'https://arfadevelopers.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://arfadevelopers.com/search?q={search_term_string}',
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
