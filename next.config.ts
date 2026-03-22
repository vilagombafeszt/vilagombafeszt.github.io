import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Disable in development to avoid stale service workers
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  output: 'export',   // enables `next build` → static HTML export for GitHub Pages
  images: {
    unoptimized: true, // required for static export
  },
  trailingSlash: true,
};

export default withSerwist(withNextIntl(nextConfig));
