# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Storybook from source
# Stage 2: Build Next.js application
# Stage 3: Production runtime

# Stage 1: Build Storybook
FROM node:18 AS storybook-builder

WORKDIR /workspace

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Copy monorepo files needed for Storybook build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY storybook ./storybook
COPY shared ./shared

# Install dependencies (root + storybook + shared)
RUN pnpm install --frozen-lockfile

# Build Storybook
RUN pnpm run build-storybook

# Stage 2: Build Next.js wrapper
FROM node:18 AS nextjs-builder

WORKDIR /app

# Copy package files
COPY storybook/auth-wrapper/package*.json ./
RUN npm ci

# Copy source code
COPY storybook/auth-wrapper .

# Copy Storybook build from previous stage
COPY --from=storybook-builder /workspace/storybook/build ./public/storybook-static

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
