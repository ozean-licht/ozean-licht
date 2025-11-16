# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Storybook static files
# Stage 2: Build Next.js application
# Stage 3: Production runtime

# Stage 1: Build Storybook
FROM node:18-alpine AS storybook-builder

WORKDIR /build

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Copy source files needed for Storybook build
COPY storybook/config ./storybook/config
COPY storybook/ai-mvp ./storybook/ai-mvp
COPY storybook/mocks ./storybook/mocks
COPY storybook/templates ./storybook/templates
COPY storybook/postcss.config.js ./storybook/
COPY storybook/tailwind.config.js ./storybook/
COPY shared/ui ./shared/ui
COPY apps/admin/app/globals.css ./apps/admin/app/globals.css
COPY apps/admin/tailwind.config.js ./apps/admin/

# Install dependencies (allow lockfile updates for Docker build)
RUN pnpm install --no-frozen-lockfile

# Build Storybook static files
RUN pnpm build-storybook

# Stage 2: Build Next.js wrapper
FROM node:18-alpine AS nextjs-builder

WORKDIR /app

# Copy package files
COPY storybook/auth-wrapper/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY storybook/auth-wrapper .

# Copy Storybook build from previous stage
COPY --from=storybook-builder /build/storybook-static ./public/storybook-static

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

CMD ["node", "server.js"]
