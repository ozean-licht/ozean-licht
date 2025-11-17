/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for faster development builds (Next.js 15+)
  // Turbopack is automatically enabled in dev mode for Next.js 15
  experimental: {
    // Turbopack is stable in Next.js 15, no experimental flag needed
    // Keep this empty for future experimental features
  },

  // TypeScript configuration
  typescript: {
    // Type checking is done in Storybook's TypeScript config
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // ESLint checking handled by workspace root
    ignoreDuringBuilds: false,
  },

  // Disable Next.js telemetry (same as Storybook)
  telemetry: false,

  // Image optimization
  images: {
    // Configure domains for admin/shared components that use next/image
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ozean-licht.dev',
      },
      {
        protocol: 'https',
        hostname: '**.kids-ascension.dev',
      },
    ],
  },

  // Path aliases for monorepo
  // These work together with tsconfig.json paths
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/lib': `${__dirname}/lib`,
      '@/components': `${__dirname}/components`,
      '@/types': `${__dirname}/types`,
      '@admin': `${__dirname}/../admin`,
      '@shared': `${__dirname}/../../shared/ui/src`,
    };

    return config;
  },

  // Output configuration
  // Note: Storybook handles its own build output
  // This config is for when Next.js is used for API routes
  output: 'standalone',

  // API routes configuration
  // These are used for AI iteration features
  async headers() {
    // Only allow same-origin requests (Storybook iframe to API routes)
    // AI iteration works within the same domain
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          // Restrictive: Only allow localhost in development
          // In production, same-origin policy is sufficient (no CORS needed)
          { key: 'Access-Control-Allow-Origin', value: process.env.NODE_ENV === 'production' ? 'https://storybook.ozean-licht.dev' : 'http://localhost:6006' },
          { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  // Environment variables - Server-side only
  // SECURITY: Do not expose sensitive env vars to client
  // API routes access these via process.env automatically
  // Client-side code cannot access ANTHROPIC_API_KEY, AUTH_SECRET, or DB credentials
};

export default nextConfig;
