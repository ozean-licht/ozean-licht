# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and TypeScript config
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Verify build output
RUN ls -la dist/

# ============================================
# Stage 2: Production Stage
# ============================================
FROM node:20-alpine

# Install FFmpeg with full codec support and FFprobe
RUN apk add --no-cache \
    ffmpeg \
    ffmpeg-libs \
    && ffmpeg -version \
    && ffprobe -version

# Create non-root user for security
RUN addgroup -g 1001 -S encoderuser && \
    adduser -u 1001 -S encoderuser -G encoderuser

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create temporary encoding directory with proper permissions
RUN mkdir -p /tmp/encoding && \
    chown -R encoderuser:encoderuser /tmp/encoding && \
    chmod 755 /tmp/encoding

# Ensure app directory is owned by non-root user
RUN chown -R encoderuser:encoderuser /app

# Switch to non-root user
USER encoderuser

# Set environment variables
ENV NODE_ENV=production \
    TMP_DIR=/tmp/encoding \
    LOG_LEVEL=info

# Health check (optional - checks if process is running)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "process.exit(0)" || exit 1

# Expose any metrics port if needed (optional)
# EXPOSE 9090

# Entry point - run the compiled application
CMD ["node", "dist/index.js"]
