# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Storybook from source
# Stage 2: Build Next.js application
# Stage 3: Production runtime

# Stage 1: Copy pre-built Storybook (built locally with `npm run build-storybook`)
FROM node:18-alpine AS storybook-provider

WORKDIR /build

# Copy pre-built Storybook static files
# IMPORTANT: Run `npm run build-storybook` locally before Docker build
COPY storybook/build ./storybook-static

# Stage 2: Build Next.js wrapper
FROM node:18 AS nextjs-builder

WORKDIR /app

# Copy package files
COPY storybook/auth-wrapper/package*.json ./
RUN npm ci

# Copy source code
COPY storybook/auth-wrapper .

# Copy Storybook build from previous stage
COPY --from=storybook-provider /build/storybook-static ./public/storybook-static

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=nextjs-builder /app/public ./public
COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3002

ENV PORT 3002
ENV HOSTNAME "0.0.0.0"

# Copy custom server for static file serving
COPY storybook/auth-wrapper/server.js ./

CMD ["node", "server.js"]
