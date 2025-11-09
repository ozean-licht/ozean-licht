# Admin Dashboard Dockerfile
# Using Debian-based slim image for better npm compatibility (vs Alpine musl libc)
FROM node:18-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Explicitly set to development to install ALL deps (including dev needed for build)
ENV NODE_ENV=development

# Copy package files
COPY package.json package-lock.json* ./

# Cache bust: Ensure npm ci runs with new flags (change this comment to invalidate cache)
# Last updated: 2025-11-10 - Force 766 packages with --include=dev

# Install ALL dependencies (including devDependencies needed for Next.js build)
RUN npm ci --include=dev

# Validate critical package installed
RUN test -d node_modules/@radix-ui/react-icons || \
    (echo "ERROR: @radix-ui/react-icons not installed!" && exit 1)

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy all node_modules including devDependencies
COPY --from=deps /app/node_modules ./node_modules

# Verify critical package copied correctly
RUN ls node_modules/@radix-ui/ | grep react-icons || \
    (echo "ERROR: react-icons missing in builder stage!" && exit 1)

COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Set production mode ONLY for Next.js build (not for deps install)
ENV NODE_ENV=production

# Set placeholder for build (will be overridden at runtime)
# Next.js needs this for next.config.js evaluation
ENV NEXTAUTH_URL=https://dashboard.ozean-licht.dev

# Build the Next.js app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
