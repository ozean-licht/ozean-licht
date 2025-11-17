# Multi-stage build for Storybook
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace files from root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all necessary packages
COPY shared/ui/package.json ./shared/ui/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy all necessary source files
COPY shared/ui ./shared/ui

# Build Storybook
WORKDIR /app/shared/ui
RUN pnpm build-storybook

# Production stage
FROM nginx:alpine

# Copy built storybook to nginx
COPY --from=builder /app/shared/ui/storybook-static /usr/share/nginx/html

# Custom nginx config with health endpoint
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Lightweight health check endpoint \
    location /health { \
        access_log off; \
        return 200 "OK\\n"; \
        add_header Content-Type text/plain; \
    } \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check using lightweight /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]