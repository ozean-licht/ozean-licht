FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all workspace package.json files for proper dependency resolution
COPY apps/storybook/package.json ./apps/storybook/
COPY shared/ui/package.json ./shared/ui/
COPY apps/admin/package.json ./apps/admin/

# Install pnpm
RUN npm install -g pnpm@9.15.0

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/storybook ./apps/storybook
COPY shared ./shared

# Build Storybook
WORKDIR /app/apps/storybook
RUN pnpm build

# Production stage - Serve with http-server
FROM node:20-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server@14.1.1

# Copy built Storybook from builder
COPY --from=builder /app/apps/storybook/storybook-static ./storybook-static

# Expose port
EXPOSE 6006

# Health check using Node.js built-in http module
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:6006/', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start http-server
# -p 6006: port
# --gzip: enable gzip compression
# -c-1: disable caching (always serve fresh content)
CMD ["http-server", "storybook-static", "-p", "6006", "--gzip", "-c-1"]
