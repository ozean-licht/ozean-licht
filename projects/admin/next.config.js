/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `http://localhost:${process.env.FRONTEND_PORT || 9200}`,
  },
}

module.exports = nextConfig
