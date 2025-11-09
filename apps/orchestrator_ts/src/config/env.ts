/**
 * Environment Configuration
 *
 * Centralized environment variable management with type safety and validation.
 * Uses Zod for runtime validation of required environment variables.
 *
 * @module config/env
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

/**
 * Environment variable schema
 *
 * Defines all required and optional environment variables with validation rules.
 * Missing required variables will cause the application to fail fast on startup.
 */
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8003),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database
  DATABASE_URL: z.string().url('Invalid DATABASE_URL format'),

  // Anthropic API
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),

  // GitHub
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
  GITHUB_OWNER: z.string().default('ozean-licht'),
  GITHUB_REPO: z.string().default('ozean-licht-ecosystem'),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),

  // ADW Configuration
  ADW_WORKING_DIR: z.string().default('/opt/ozean-licht-ecosystem'),
  ADW_TREES_DIR: z.string().optional(),
  ADW_AGENTS_DIR: z.string().optional(),
  ADW_BACKEND_PORT_START: z.coerce.number().default(9100),
  ADW_FRONTEND_PORT_START: z.coerce.number().default(9200),
  ADW_MAX_CONCURRENT_WORKFLOWS: z.coerce.number().default(15),

  // Orchestrator Configuration
  ORCHESTRATOR_WORKING_DIR: z.string().default('/opt/ozean-licht-ecosystem'),
  ORCHESTRATOR_MODEL: z.string().default('sonnet'),

  // MCP Gateway
  MCP_GATEWAY_URL: z.string().url().default('http://localhost:8100'),

  // Cloudflare R2 (S3-compatible)
  R2_ENDPOINT: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_DOMAIN: z.string().optional(),

  // WebSocket
  WS_HEARTBEAT_INTERVAL: z.coerce.number().default(30000), // 30 seconds
});

/**
 * Parsed and validated environment variables
 *
 * Type-safe access to all environment configuration.
 * Throws an error if validation fails.
 */
export const env = envSchema.parse(process.env);

/**
 * Environment variable type
 */
export type Env = z.infer<typeof envSchema>;
