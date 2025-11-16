/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate standalone server that includes public folder
  generateBuildId: async () => {
    return 'storybook-auth'
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Output standalone for Docker deployment
  output: 'standalone',

  // Disable image optimization for Storybook assets
  images: {
    unoptimized: true,
  },

  // Suppress warnings for external packages
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'bcrypt']
    return config
  },
}

module.exports = nextConfig
