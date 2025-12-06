# Admin Dashboard Dockerfile
# Built from monorepo root: docker build -f apps/admin/Dockerfile .
# Uses pnpm to properly handle workspace dependencies

FROM node:18-slim AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# ============================================================================
# Dependencies stage - install all workspace dependencies
# ============================================================================
FROM base AS deps
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy all workspace package.json files that pnpm needs to resolve
COPY apps/admin/package.json ./apps/admin/
COPY shared/ui/package.json ./shared/ui/

# Install dependencies using pnpm with frozen lockfile
# --filter targets admin and its dependencies (including @shared/ui)
RUN pnpm install --frozen-lockfile --filter @admin/dashboard...

# ============================================================================
# Builder stage - build the Next.js application
# ============================================================================
FROM base AS builder
WORKDIR /app

# Copy installed node_modules from deps stage
# pnpm creates a hoisted node_modules at root with symlinks
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules

# Copy workspace config (needed for pnpm workspace resolution)
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy shared/ui source and dist (workspace dependency)
COPY shared/ui ./shared/ui

# Copy shared/assets (referenced by shared/ui components)
COPY shared/assets ./shared/assets

# Copy admin application source
COPY apps/admin ./apps/admin

# Set working directory to admin app
WORKDIR /app/apps/admin

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build placeholder URLs (overridden at runtime)
ENV NEXTAUTH_URL=https://dashboard.ozean-licht.dev

# Build the Next.js application
RUN pnpm run build

# Dereference symlinks in standalone output (pnpm uses symlinks that won't work in runner)
# cp -rL follows symlinks and copies actual files
RUN mkdir -p /app/standalone && \
    cp -rL .next/standalone/. /app/standalone/ && \
    cp -r .next/static /app/standalone/.next/static && \
    cp -r public /app/standalone/public

# ============================================================================
# Runner stage - production image
# ============================================================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy dereferenced standalone output (no symlinks)
COPY --from=builder --chown=nextjs:nodejs /app/standalone ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
