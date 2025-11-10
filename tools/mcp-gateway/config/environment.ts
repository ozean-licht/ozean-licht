import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file if available (dev/local mode)
// In production/Docker, environment variables are passed directly
// Note: __dirname will be 'dist/config' when compiled, so we need to go up to mcp-gateway root
const isCompiled = __dirname.includes('/dist/');
const mcpGatewayRoot = isCompiled
  ? path.resolve(__dirname, '../../')  // dist/config -> mcp-gateway/
  : path.resolve(__dirname, '../');     // config/ -> mcp-gateway/

const localEnvPath = path.join(mcpGatewayRoot, '.env');
const rootEnvPath = path.resolve(mcpGatewayRoot, '../../.env');

// Try local .env first, fallback to root .env, or use environment variables
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
  console.log(`✅ Loading environment from local: ${localEnvPath}`);
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
  console.log(`⚠️  Local .env not found, using root: ${rootEnvPath}`);
} else {
  // No .env file found - use environment variables directly (Docker/production mode)
  console.log(`ℹ️  No .env file found, using environment variables`);
}

// Environment schema definition
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8100').transform(Number),
  HOST: z.string().default('0.0.0.0'),

  // Database Configuration
  POSTGRES_KA_URL: z.string().optional(),
  POSTGRES_KA_HOST: z.string().default('localhost'),
  POSTGRES_KA_PORT: z.string().default('5432').transform(Number),
  POSTGRES_KA_DATABASE: z.string().default('kids-ascension'),
  POSTGRES_KA_USER: z.string().default('postgres'),
  POSTGRES_KA_PASSWORD: z.string().optional().default(''),

  POSTGRES_OL_URL: z.string().optional(),
  POSTGRES_OL_HOST: z.string().default('localhost'),
  POSTGRES_OL_PORT: z.string().default('5432').transform(Number),
  POSTGRES_OL_DATABASE: z.string().default('ozean-licht'),
  POSTGRES_OL_USER: z.string().default('postgres'),
  POSTGRES_OL_PASSWORD: z.string().optional().default(''),

  POSTGRES_SHARED_URL: z.string().optional(),
  POSTGRES_SHARED_HOST: z.string().default('localhost'),
  POSTGRES_SHARED_PORT: z.string().default('32771').transform(Number),
  POSTGRES_SHARED_DATABASE: z.string().default('shared-users-db'),
  POSTGRES_SHARED_USER: z.string().default('postgres'),
  POSTGRES_SHARED_PASSWORD: z.string().optional().default(''),

  // Service URLs
  MEM0_API_URL: z.string().url().default('http://mem0:8090'),
  N8N_API_URL: z.string().url().default('http://n8n:5678'),
  N8N_API_KEY: z.string().optional(),

  // Coolify API
  COOLIFY_API_URL: z.string().url().default('http://localhost:8000'),
  COOLIFY_API_TOKEN: z.string().optional(),

  // Orchestrator API (for permission checks)
  ORCHESTRATOR_URL: z.string().url().default('http://localhost:9403'),

  // External APIs
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_ZONE_ID: z.string().optional(),

  // GitHub - supports both PAT and App authentication
  GITHUB_PAT: z.string().optional(),
  GITHUB_APP_ID: z.string().optional(),
  GITHUB_PRIVATE_KEY: z.string().optional(),
  GITHUB_INSTALLATION_ID: z.string().optional(),

  // Firecrawl - Web scraping service
  FIRECRAWL_API_KEY: z.string().optional(),

  // Security
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),

  // Redis (for rate limiting and caching)
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379').transform(Number),
  REDIS_PASSWORD: z.string().optional(),

  // Monitoring
  ENABLE_METRICS: z.string().default('true').transform(v => v === 'true'),
  METRICS_PORT: z.string().default('9090').transform(Number),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),

  // Connection Pools
  DB_POOL_MIN: z.string().default('2').transform(Number),
  DB_POOL_MAX: z.string().default('10').transform(Number),
  DB_IDLE_TIMEOUT_MS: z.string().default('10000').transform(Number),

  // Timeouts
  DEFAULT_TIMEOUT_MS: z.string().default('30000').transform(Number),
  DB_QUERY_TIMEOUT_MS: z.string().default('10000').transform(Number),
  HTTP_TIMEOUT_MS: z.string().default('30000').transform(Number),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.issues
        .filter(issue => issue.code === 'invalid_type' && issue.received === 'undefined')
        .map(issue => issue.path.join('.'));

      const invalid = error.issues
        .filter(issue => issue.code !== 'invalid_type' || issue.received !== 'undefined')
        .map(issue => `${issue.path.join('.')}: ${issue.message}`);

      console.error('❌ Environment configuration error:');
      if (missing.length > 0) {
        console.error('Missing required variables:', missing.join(', '));
      }
      if (invalid.length > 0) {
        console.error('Invalid variables:', invalid.join(', '));
      }
      process.exit(1);
    }
    throw error;
  }
};

// Export validated configuration
export const config = parseEnv();

// Database connection configurations
export const dbConfig = {
  kidsAscension: {
    connectionString: config.POSTGRES_KA_URL,
    host: config.POSTGRES_KA_HOST,
    port: config.POSTGRES_KA_PORT,
    database: config.POSTGRES_KA_DATABASE,
    user: config.POSTGRES_KA_USER,
    password: config.POSTGRES_KA_PASSWORD,
    min: config.DB_POOL_MIN,
    max: config.DB_POOL_MAX,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: config.DEFAULT_TIMEOUT_MS,
    statement_timeout: config.DB_QUERY_TIMEOUT_MS,
  },
  ozeanLicht: {
    connectionString: config.POSTGRES_OL_URL,
    host: config.POSTGRES_OL_HOST,
    port: config.POSTGRES_OL_PORT,
    database: config.POSTGRES_OL_DATABASE,
    user: config.POSTGRES_OL_USER,
    password: config.POSTGRES_OL_PASSWORD,
    min: config.DB_POOL_MIN,
    max: config.DB_POOL_MAX,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: config.DEFAULT_TIMEOUT_MS,
    statement_timeout: config.DB_QUERY_TIMEOUT_MS,
  },
  sharedUsers: {
    connectionString: config.POSTGRES_SHARED_URL,
    host: config.POSTGRES_SHARED_HOST,
    port: config.POSTGRES_SHARED_PORT,
    database: config.POSTGRES_SHARED_DATABASE,
    user: config.POSTGRES_SHARED_USER,
    password: config.POSTGRES_SHARED_PASSWORD,
    min: config.DB_POOL_MIN,
    max: config.DB_POOL_MAX,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: config.DEFAULT_TIMEOUT_MS,
    statement_timeout: config.DB_QUERY_TIMEOUT_MS,
  },
};

// Service URLs
export const serviceUrls = {
  mem0: config.MEM0_API_URL,
  n8n: config.N8N_API_URL,
  coolify: config.COOLIFY_API_URL,
};

// Feature flags
export const features = {
  metrics: config.ENABLE_METRICS,
  rateLimiting: true,
  authentication: config.NODE_ENV === 'production',
  cors: true,
  compression: true,
  helmet: true,
};

// Export type for use in other files
export type Config = z.infer<typeof envSchema>;