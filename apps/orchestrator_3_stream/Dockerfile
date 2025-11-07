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

WORKDIR /app

# Install system dependencies including Node.js for Claude Code CLI
RUN apt-get update && apt-get install -y \
    git \
    curl \
    postgresql-client \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Install UV (Python package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

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

# Expose ports
EXPOSE 9403 5175

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:9403/health || exit 1

# Copy and set start script
COPY apps/orchestrator_3_stream/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set working directory
WORKDIR /app

CMD ["/app/start.sh"]
