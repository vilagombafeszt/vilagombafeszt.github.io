import type { Metadata } from 'next';
import { Alumni_Sans, Rubik_Beastly, Aboreto, Poiret_One, Monoton } from 'next/font/google';
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

const aboreto = Aboreto({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-aboreto',
  display: 'swap',
});

const poiretOne = Poiret_One({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-poiret-one',
  display: 'swap',
});

const monoton = Monoton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-monoton',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ViláGomba Fesztivál',
  description: 'ViláGomba Fesztivál – Zebegény',
  icons: {
    icon: '/page_images/cimlogo_kek.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = [
    alumniSans.variable,
    rubikBeastly.variable,
    aboreto.variable,
    poiretOne.variable,
    monoton.variable,
  ].join(' ');

  return (
    <html lang="hu" className={fontClasses}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
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

        {/* Cookie preferences link (hidden on mobile via CSS) */}
        <a href="#" id="open_preferences_center" style={{ display: 'none' }}>
          Update cookies preferences
        </a>

        {children}
      </body>
    </html>
  );
}
