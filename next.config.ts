import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',   // enables `next build` → static HTML export for GitHub Pages
  images: {
    unoptimized: true, // required for static export
  },
  trailingSlash: true,
};

export default nextConfig;
