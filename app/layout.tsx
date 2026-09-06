import type { Metadata, Viewport } from 'next';
import { Alumni_Sans, Rubik_Beastly } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const alumniSans = Alumni_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-alumni-sans',
  display: 'swap',
});

const rubikBeastly = Rubik_Beastly({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-rubik-beastly',
  display: 'swap',
});

const siteUrl = 'https://vilagombafeszt.github.io';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ViláGomba Fesztivál',
    template: '%s | ViláGomba Fesztivál',
  },
  description:
    'ViláGomba Fesztivál – Zebegény. Programok, jegyek, helyszín és képgaléria a fesztiválról.',
  keywords: ['ViláGomba', 'Fesztivál', 'Zebegény', 'zene', 'programok', 'jegyek'],
  authors: [{ name: 'ViláGomba Fesztivál' }],
  creator: 'ViláGomba Fesztivál',
  publisher: 'ViláGomba Fesztivál',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: siteUrl,
    siteName: 'ViláGomba Fesztivál',
    title: 'ViláGomba Fesztivál',
    description:
      'ViláGomba Fesztivál – Zebegény. Programok, jegyek, helyszín és képgaléria a fesztiválról.',
    images: [
      {
        url: '/page_images/IMG_1367.webp',
        width: 1200,
        height: 630,
        alt: 'ViláGomba Fesztivál',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViláGomba Fesztivál',
    description: 'ViláGomba Fesztivál – Zebegény',
    images: ['/page_images/IMG_1367.webp'],
  },
  icons: {
    icon: '/page_images/cimlogo_kek.png',
    apple: '/page_images/cimlogo_kek.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'ViláGomba Fesztivál',
    statusBarStyle: 'default',
    capable: true,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'hu-HU': `${siteUrl}/hu`,
      'en-US': `${siteUrl}/en`,
    },
  },
};

import GoogleAnalyticsTracker from '@/components/GoogleAnalyticsTracker';
import CookieConsent from '@/components/CookieConsent';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = [alumniSans.variable, rubikBeastly.variable].join(' ');

  return (
    <html lang="hu" className={`${fontClasses} scroll-smooth md:scroll-pt-[72px]`}>
      <head>
        {/* Critical CSS inlined to eliminate render-blocking stylesheet */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
:root{--color-menu-bg:#7c8bb1;--color-menu-text:#102135;--color-menu-hover:#8b0000;--color-accent:#ac9d9d;--color-hero-text:#7c8bb1;--color-musor-bg:#354b3d;--color-jegyek-bg:#355168;--color-helyszin-bg:#a44041;--color-story-bg:#474738;--color-keptar-bg:#253529;--color-kapcsolat-bg:#594a66;--menu-height:72px;--font-brand:var(--font-rubik-beastly),'Rubik Beastly',cursive;--font-body:var(--font-alumni-sans),'Alumni Sans',sans-serif}
*,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{background-color:#000;-webkit-text-size-adjust:100%}
body{margin:0;padding:0;background-color:#000;overflow-x:hidden;width:100%;touch-action:manipulation}
a{color:var(--color-accent);text-decoration:none}
`,
          }}
        />
        {/* Preconnect to Google Maps to speed up LazyMap loading */}
        <link rel="preconnect" href="https://www.google.com" />

        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MusicEvent',
              name: 'ViláGomba Fesztivál 2026',
              description: 'ViláGomba Fesztivál – Zebegény. Zene, programok, helyszín.',
              startDate: '2026-08-21T16:00:00+02:00',
              endDate: '2026-08-23T23:59:59+02:00',
              location: {
                '@type': 'Place',
                name: 'Zebegény',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Zebegény',
                  addressCountry: 'HU',
                },
              },
              image: ['https://vilagombafeszt.github.io/page_images/IMG_1367.webp'],
              offers: {
                '@type': 'Offer',
                url: 'https://www.tixa.hu/vilagomba-2026',
                priceCurrency: 'HUF',
                availability: 'https://schema.org/InStock',
                validFrom: '2025-09-01T00:00:00+02:00',
              },
            }),
          }}
        />
      </head>
      <body>
        {/* Service Worker registration */}
        {process.env.NODE_ENV === 'production' && (
          <Script id="sw-registration" strategy="afterInteractive">{`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}</Script>
        )}

        <GoogleAnalyticsTracker />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
