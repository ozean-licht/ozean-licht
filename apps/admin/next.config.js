const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@shared/ui'],
  // Allow build to proceed despite TypeScript errors from @shared/ui type inference
  // TODO: Fix @shared/ui type exports and remove this
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `http://localhost:${process.env.FRONTEND_PORT || 9200}`,
  },
  webpack: (config) => {
    // Add alias for shared assets used by @shared/ui package
    config.resolve.alias['@/shared/assets'] = path.resolve(__dirname, '../../shared/assets');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '138.201.139.25',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.ozean-licht.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },
}

module.exports = nextConfig
