import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import AOSInit from '@/components/AOSInit'
import LiveChat from '@/components/LiveChat'
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
  title: 'Arfa Developers - Web Development Agency USA, UK, Qatar, KSA | Custom Web Apps',
  description: 'Leading web development agency serving US, UK, Qatar, and Saudi Arabia. Custom web applications, mobile apps, and enterprise solutions. Free consultation available.',
  keywords: [
    'web development agency USA',
    'custom web apps US',
    'enterprise software developers UK',
    'web solutions Qatar',
    'custom web apps Saudi Arabia',
    'web development company',
    'mobile app development',
    'enterprise software solutions',
  ],
  authors: [{ name: 'Arfa Developers' }],
  openGraph: {
    title: 'Arfa Developers - Web Solutions That Scale Globally',
    description: 'From Startups to Enterprises – We Build Web Solutions That Scale Globally',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arfa Developers - Web Solutions That Scale Globally',
    description: 'From Startups to Enterprises – We Build Web Solutions That Scale Globally',
  },
  alternates: {
    canonical: 'https://arfadevelopers.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
        {/* Google Analytics 4 - Replace G-XXXXXXXXXX with your GA4 ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        {/* Hotjar - Now installed via Google Tag Manager (Tag ID: 9e555ac46ce75) */}
        {/* See HOTJAR_GTM_SETUP.md for configuration instructions */}
        <AOSInit />
        <ThemeProvider>
          {children}
          {/* Live Chat - Configure via environment variables */}
          {process.env.NEXT_PUBLIC_TIDIO_ID && (
            <LiveChat provider="tidio" id={process.env.NEXT_PUBLIC_TIDIO_ID} />
          )}
          {process.env.NEXT_PUBLIC_DRIFT_ID && (
            <LiveChat provider="drift" id={process.env.NEXT_PUBLIC_DRIFT_ID} />
          )}
          {process.env.NEXT_PUBLIC_INTERCOM_ID && (
            <LiveChat provider="intercom" id={process.env.NEXT_PUBLIC_INTERCOM_ID} />
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
