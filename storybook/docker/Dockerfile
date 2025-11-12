# Storybook Production Dockerfile
# Multi-stage build for optimal image size
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies needed for build
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build design tokens first (required by Storybook)
RUN npm run build:tokens

# Build Storybook static site
RUN npm run build-storybook

# Verify build output exists
RUN test -d storybook/build || (echo "ERROR: storybook/build not created!" && exit 1)

# Production stage - serve static files
FROM node:20-slim AS runner

# Install http-server for serving static files
RUN npm install -g http-server@14.1.1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 storybook

WORKDIR /app

# Copy built static files from builder
COPY --from=builder --chown=storybook:nodejs /app/storybook/build ./storybook

# Switch to non-root user
USER storybook

# Expose Storybook port
EXPOSE 6006

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:6006/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start http-server with optimizations
CMD ["http-server", "storybook", \
     "-p", "6006", \
     "--gzip", \
     "--brotli", \
     "-c-1", \
     "--proxy", "http://localhost:6006?", \
     "--cors"]
