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

        {/* Cookie Consent */}
        <Script
          src="//www.freeprivacypolicy.com/public/cookie-consent/4.1.0/cookie-consent.js"
          strategy="beforeInteractive"
        />
        {/* Google Analytics – only fires after tracking consent */}
        <Script
          id="ga-script"
          data-cookie-consent="tracking"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3C9SFFDX5K"
        />
      </head>
      <body>
        {/* Cookie consent initialisation */}
        <Script id="cookie-consent-init" strategy="afterInteractive">{`
          if (typeof cookieconsent !== 'undefined') {
            cookieconsent.run({
              notice_banner_type: 'simple',
              consent_type: 'express',
              palette: 'dark',
              language: 'hu',
              page_load_consent_levels: ['strictly-necessary'],
              notice_banner_reject_button_hide: false,
              preferences_center_close_button_hide: false,
              page_refresh_confirmation_buttons: false,
              website_name: 'ViláGombaFeszt',
            });
          }
        `}</Script>
        {/* Google Analytics init */}
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3C9SFFDX5K');
        `}</Script>
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

        {/* Cookie preferences link (hidden on mobile via CSS) */}
        <a href="#" id="open_preferences_center" style={{ display: 'none' }}>
          Update cookies preferences
        </a>

        {children}
      </body>
    </html>
  );
}
