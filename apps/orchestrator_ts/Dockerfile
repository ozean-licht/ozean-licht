# Multi-stage build for TypeScript Orchestrator
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy package files from orchestrator_ts directory
COPY apps/orchestrator_ts/package*.json ./
COPY apps/orchestrator_ts/tsconfig.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code from orchestrator_ts directory
COPY apps/orchestrator_ts/prisma ./prisma
COPY apps/orchestrator_ts/src ./src

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

# Install runtime dependencies (including OpenSSL 3.x for Prisma)
RUN apk add --no-cache curl git openssh-client openssl

# adw-user already exists on the host system (UID:GID 1000:1000)
# No need to create user - Alpine uses the host's user mapping

WORKDIR /app

# Copy package files and install production dependencies only
COPY apps/orchestrator_ts/package*.json ./
RUN npm ci --only=production

# Copy Prisma files and generate client
COPY apps/orchestrator_ts/prisma ./prisma
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy any static assets if needed
# COPY public ./public

# Change ownership to adw-user (UID 1000)
RUN chown -R 1000:1000 /app

# Switch to adw-user
USER 1000:1000

# Expose port
EXPOSE 8003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=60s \
  CMD node -e "require('http').get('http://localhost:8003/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start the application
CMD ["node", "dist/index.js"]
