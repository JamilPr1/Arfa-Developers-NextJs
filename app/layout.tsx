import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import AOSInit from '@/components/AOSInit'
import LiveChat from '@/components/LiveChat'
import StructuredData from '@/components/StructuredData'
import WhatsAppButton from '@/components/WhatsAppButton'
import SlackChatWidget from '@/components/SlackChatWidget'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const roboto = Roboto({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Arfa Developers - Top Web Development Agency USA, UK, Qatar, KSA | Custom Web Apps & Software Solutions',
  description: 'Expert web development agency serving USA, UK, Qatar, and Saudi Arabia. We rescue failed projects from freelancers and build custom web applications, mobile apps, and enterprise software. Free consultation available. 200+ projects rescued.',
  keywords: [
    'web development agency USA',
    'custom web apps US',
    'enterprise software developers UK',
    'web solutions Qatar',
    'custom web apps Saudi Arabia',
    'web development company',
    'mobile app development',
    'enterprise software solutions',
    'rescue failed projects',
    'fix broken websites',
    'web app development',
    'custom software development',
    'full stack development',
    'react development',
    'next.js development',
    'node.js development',
    'web development services',
    'software development company',
    'app development agency',
    'ecommerce development',
    'SaaS development',
  ],
  authors: [{ name: 'Arfa Developers' }],
  creator: 'Arfa Developers',
  publisher: 'Arfa Developers',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Arfa Developers - Web Solutions That Scale Globally | Rescue Failed Projects',
    description: 'Expert web development agency rescuing 200+ failed projects from freelancers. Custom web apps, mobile apps, and enterprise solutions for USA, UK, Qatar, and Saudi Arabia. Free consultation.',
    type: 'website',
    locale: 'en_US',
    url: 'https://arfadevelopers.com',
    siteName: 'Arfa Developers',
    images: [
      {
        url: 'https://arfadevelopers.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Arfa Developers - Web Development Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arfa Developers - Web Solutions That Scale Globally',
    description: 'Expert web development agency rescuing failed projects. Custom web apps, mobile apps, and enterprise solutions. Free consultation.',
    images: ['https://arfadevelopers.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://arfadevelopers.com',
  },
  category: 'Technology',
  classification: 'Web Development Services',
  other: {
    'geo.region': 'US-UK-QA-SA',
    'geo.placename': 'United States, United Kingdom, Qatar, Saudi Arabia',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1E3A8A" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${poppins.variable} ${roboto.variable}`}>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WGSQ38FK');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGSQ38FK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T643HESSSN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T643HESSSN');
          `}
        </Script>
        {/* Hotjar - Now installed via Google Tag Manager (Tag ID: 9e555ac46ce75) */}
        {/* See HOTJAR_GTM_SETUP.md for configuration instructions */}
        <AOSInit />
        <ThemeProvider>
          {children}
          {/* WhatsApp Floating Button */}
          <WhatsAppButton />
          {/* Real-time Chat Widget - sends messages to Slack */}
          <SlackChatWidget />
          {/* Live Chat - Configure via environment variables (optional) */}
          {process.env.NEXT_PUBLIC_TIDIO_ID && (
            <LiveChat provider="tidio" id={process.env.NEXT_PUBLIC_TIDIO_ID} />
          )}
          {process.env.NEXT_PUBLIC_DRIFT_ID && (
            <LiveChat provider="drift" id={process.env.NEXT_PUBLIC_DRIFT_ID} />
          )}
          {process.env.NEXT_PUBLIC_INTERCOM_ID && (
            <LiveChat provider="intercom" id={process.env.NEXT_PUBLIC_INTERCOM_ID} />
          )}
          {/* Vercel Speed Insights */}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
