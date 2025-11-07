# Multi-stage build for Orchestrator 3 Stream

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy package files
COPY apps/orchestrator_3_stream/frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY apps/orchestrator_3_stream/frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Backend with Python
FROM python:3.12-slim

# Create adw-user with UID/GID 1000 to match host user
RUN groupadd -g 1000 adw-user && \
    useradd -u 1000 -g 1000 -m -s /bin/bash adw-user && \
    usermod -aG sudo adw-user && \
    echo "adw-user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

WORKDIR /app

# Install system dependencies including Node.js for Claude Code CLI
RUN apt-get update && apt-get install -y \
    git \
    curl \
    postgresql-client \
    nodejs \
    npm \
    sudo \
    lsof \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Install UV (Python package manager) for adw-user
USER adw-user
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/home/adw-user/.local/bin:$PATH"

# Switch back to root for remaining setup
USER root

# Copy backend files
COPY apps/orchestrator_3_stream/backend/pyproject.toml apps/orchestrator_3_stream/backend/uv.lock ./backend/
WORKDIR /app/backend

# Install Python dependencies
RUN uv sync --frozen

# Copy rest of backend
COPY apps/orchestrator_3_stream/backend/ ./

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy database migrations
COPY apps/orchestrator_db /app/orchestrator_db

# Create necessary directories
RUN mkdir -p /app/backend/logs /app/data

# Create directories for mounted repo with proper permissions
RUN mkdir -p /opt/ozean-licht-ecosystem && \
    chown -R adw-user:adw-user /opt/ozean-licht-ecosystem

# Set ownership of app directory
RUN chown -R adw-user:adw-user /app

# Expose ports
EXPOSE 9403 5175

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:9403/health || exit 1

# Copy and set start script
COPY apps/orchestrator_3_stream/start.sh /app/start.sh
RUN chmod +x /app/start.sh && chown adw-user:adw-user /app/start.sh

# Configure git for adw-user (required for ADW operations)
USER adw-user
RUN git config --global user.email "orchestrator@ozean-licht.dev" && \
    git config --global user.name "Orchestrator Agent" && \
    git config --global --add safe.directory /opt/ozean-licht-ecosystem

# Set working directory
WORKDIR /app

# Run as adw-user
USER adw-user

CMD ["/app/start.sh"]
