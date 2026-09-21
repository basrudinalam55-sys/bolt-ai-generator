import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Bolt AI Image Generator — Free Unlimited AI Images',
    template: '%s | Bolt AI',
  },
  description: 'Generate unlimited AI images for free using Pollinations AI. No signup, no limits, no cost. Powered by Flux, SDXL, GPT-Image models. Mobile-first PWA.',
  keywords: ['AI image generator', 'free AI art', 'Pollinations', 'Flux', 'SDXL', 'text to image', 'unlimited AI images', 'mobile AI'],
  authors: [{ name: 'Bolt AI' }],
  creator: 'Bolt AI',
  publisher: 'Bolt AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bolt-ai.vercel.app',
    siteName: 'Bolt AI Image Generator',
    title: 'Bolt AI — Free Unlimited AI Image Generator',
    description: 'Generate unlimited AI images for free. No signup, no limits. Powered by Flux, SDXL, GPT-Image.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bolt AI Image Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bolt AI — Free Unlimited AI Image Generator',
    description: 'Generate unlimited AI images for free. No signup, no limits.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#0f172a',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bolt AI" />
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
        {/* JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Bolt AI Image Generator',
              description: 'Free unlimited AI image generator powered by Pollinations AI. No signup, no limits, no cost.',
              url: 'https://bolt-ai.vercel.app',
              applicationCategory: 'GraphicsApplication',
              operatingSystem: 'Any (Web-based)',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Free unlimited AI image generation',
                'Multiple models: Flux, SDXL, GPT-Image, Midjourney, DALL-E 3',
                'Aspect ratios: Square, Portrait, Landscape, Story, Video, Ultrawide',
                'No signup required',
                'No API key required',
                'Mobile-first PWA',
                'Download and share images',
                'Generation history',
                'Prompt templates',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-dark-950 text-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}