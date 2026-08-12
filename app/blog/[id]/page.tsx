import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Box, Container, Typography, Chip, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import SocialShare from '@/components/SocialShare'
import Script from 'next/script'
import { readDataFile } from '@/lib/dataUtils'
import { getSupabaseClient } from '@/lib/supabase'

type Blog = {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  readTime: string
  published?: boolean
}

function sanitizeHtml(input: string) {
  const html = input || ''
  // Remove potentially dangerous tags.
  let out = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<meta[\s\S]*?>/gi, '')

  // Strip inline event handlers (onClick, onLoad, etc).
  out = out.replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')

  // Block javascript: URLs.
  out = out.replace(/href\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, 'href="#"')
  out = out.replace(/src\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, 'src=""')

  return out
}

async function getBlogById(id: number): Promise<Blog | null> {
  // Try Supabase first (only if env vars are set and not during build)
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PHASE !== 'phase-production-build' &&
    process.env.NEXT_PHASE !== 'phase-development-build'
  ) {
    try {
      const supabase = await getSupabaseClient()
      if (supabase) {
        const { data: blog, error } = await supabase.from('blogs').select('*').eq('id', id).single()
        if (!error && blog) return blog as Blog
      }
    } catch {
      // ignore and fallback
    }
  }

  const blogs = await readDataFile<Blog>('blogs.json')
  const blog = blogs.find((b) => b.id === id)
  return blog || null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const blogId = parseInt(id)
  if (!Number.isFinite(blogId)) return {}

  const blog = await getBlogById(blogId)
  if (!blog || blog.published === false) return {}

  return {
    title: `${blog.title} | Arfa Developers`,
    description: blog.excerpt,
    alternates: { canonical: `https://www.arfadevelopers.com/blog/${blog.id}` },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      url: `https://www.arfadevelopers.com/blog/${blog.id}`,
      images: blog.image ? [{ url: blog.image }] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blogId = parseInt(id)
  if (!Number.isFinite(blogId)) notFound()

  const blog = await getBlogById(blogId)
  if (!blog || blog.published === false) notFound()

  const safeHtml = sanitizeHtml(blog.content || '')

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.date,
    image: blog.image,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.arfadevelopers.com/blog/${blog.id}`,
    },
    author: {
      '@type': 'Organization',
      name: 'Arfa Developers',
      url: 'https://www.arfadevelopers.com',
    },
  }

  return (
    <>
      <Script
        id={`blog-posting-${blog.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header />
      <Box component="main">
        <Box
          sx={{
            background: 'linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)',
            color: '#0C1222',
            pt: { xs: 12, md: 14 },
            pb: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem', lg: '3.4rem' },
                lineHeight: 1.15,
                color: '#0C1222',
              }}
            >
              {blog.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label={blog.date}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#0C1222', fontWeight: 700 }}
              />
              <Chip
                label={blog.readTime}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#0C1222', fontWeight: 700 }}
              />
            </Box>
            <Typography sx={{ mt: 2, color: 'text.secondary', maxWidth: 980, lineHeight: 1.8 }}>
              {blog.excerpt}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {blog.image && (
            <Box
              component="img"
              src={blog.image}
              alt={blog.title}
              sx={{
                width: '100%',
                height: { xs: 220, md: 420 },
                objectFit: 'cover',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.08)',
                mb: 4,
                bgcolor: '#F7F8FA',
              }}
            />
          )}

          <Divider sx={{ mb: 4 }} />

          <Box
            sx={{
              '& article': { maxWidth: '100%' },
              '& h1': { display: 'none' }, // title already shown in hero
              '& h2': { mt: 4, mb: 1.5, fontWeight: 900, color: '#111827' },
              '& h3': { mt: 3, mb: 1.25, fontWeight: 900, color: '#111827' },
              '& p, & li': { color: '#374151', lineHeight: 1.9, fontSize: '1.02rem' },
              '& ul, & ol': { pl: 3, my: 2 },
              '& a': { color: '#2563EB', fontWeight: 700, textDecoration: 'none' },
              '& a:hover': { textDecoration: 'underline' },
              '& strong': { color: '#111827' },
              '& code': {
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace',
                fontSize: '0.95em',
                bgcolor: '#F3F4F6',
                px: 0.6,
                py: 0.2,
                borderRadius: 1,
              },
              '& blockquote': {
                borderLeft: '4px solid #DBEAFE',
                pl: 2,
                ml: 0,
                color: '#374151',
                bgcolor: '#F7F8FA',
                py: 1.5,
                borderRadius: 2,
              },
            }}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          <SocialShare path={`/blog/${blog.id}`} campaign={`blog_${blog.id}`} title="Share this article" />
        </Container>

        <CTA />
      </Box>
      <Footer />
    </>
  )
}

