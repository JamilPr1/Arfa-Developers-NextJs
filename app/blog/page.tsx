import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import BlogIndex from '@/components/BlogIndex'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Blog - Web Development Insights & Best Practices | Arfa Developers',
  description: 'Read our latest articles on web development, best practices, project management, and technology trends. Learn from our experience rescuing and building successful projects.',
  keywords: [
    'web development blog',
    'web development best practices',
    'project management',
    'technology trends',
    'software development tips',
    'coding tutorials',
    'web development insights',
  ],
  openGraph: {
    title: 'Blog - Web Development Insights & Best Practices | Arfa Developers',
    description: 'Read our latest articles on web development, best practices, and technology trends.',
    type: 'website',
    url: 'https://arfadevelopers.com/blog',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com/blog',
  },
}

const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Arfa Developers Blog',
  description: 'Web development insights, best practices, and technology trends',
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
      name: 'Blog',
      item: 'https://arfadevelopers.com/blog',
    },
  ],
}

export default function BlogPage() {
  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Header />
      <Box component="main">
        {/* Blogs (dynamic from Admin) */}
        <BlogIndex variant="page" />

        {/* CTA Section */}
        <Box id="contact">
          <CTA />
        </Box>
      </Box>
      <Footer />
    </>
  )
}
