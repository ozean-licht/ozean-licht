# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Next.js application
# Stage 2: Production runtime
#
# Note: This wrapper proxies to a separate Storybook container
# No need to copy Storybook static files anymore

# Stage 1: Build Next.js wrapper
FROM node:18 AS nextjs-builder

WORKDIR /app

# Copy package files
COPY storybook/auth-wrapper/package*.json ./
RUN npm ci

# Copy source code
COPY storybook/auth-wrapper .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=nextjs-builder /app/public ./public

USER nextjs

EXPOSE 3002

ENV PORT 3002
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
