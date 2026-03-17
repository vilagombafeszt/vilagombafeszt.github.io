import type { Metadata, Viewport } from 'next';
import { Alumni_Sans } from 'next/font/google';
import { AuthProvider } from '@/components/gombapp/AuthProvider';
import { SnackbarProvider } from '@/components/gombapp/Snackbar';
import './gombapp.css';

const alumniSans = Alumni_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-alumni-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GombApp',
  description: 'Vilagomba Fesztivál alkalmazás – rendelések, programok és jegykezelés',
  manifest: '/GombApp/manifest.json',
  icons: {
    icon: '/GombApp/appImages/android/android-launchericon-192-192.png',
    apple: '/GombApp/appImages/ios/192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GombApp',
  },
};

export const viewport: Viewport = {
  themeColor: '#102135',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return [{ gombapp: 'GombApp' }, { gombapp: 'gombapp' }];
}

export default function GombAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`gombapp ${alumniSans.variable}`} style={{ fontFamily: 'var(--font-alumni-sans), Alumni Sans, sans-serif' }}>
      {/* Force html/body background to match GombApp — eliminates black bleed on all browsers */}
      <style dangerouslySetInnerHTML={{ __html: 'html, body { background-color: #7c8bb1 !important; overflow: hidden; }' }} />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0"
        rel="stylesheet"
      />
      <AuthProvider>
        <SnackbarProvider>
          {children}
        </SnackbarProvider>
      </AuthProvider>
    </div>
  );
}
