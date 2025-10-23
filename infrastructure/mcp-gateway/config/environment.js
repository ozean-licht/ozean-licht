"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.features = exports.serviceUrls = exports.dbConfig = exports.config = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
// Environment schema definition
const envSchema = zod_1.z.object({
    // Server Configuration
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('8100').transform(Number),
    HOST: zod_1.z.string().default('0.0.0.0'),
    // Database Configuration
    POSTGRES_KA_URL: zod_1.z.string().url().optional(),
    POSTGRES_KA_HOST: zod_1.z.string().default('localhost'),
    POSTGRES_KA_PORT: zod_1.z.string().default('5432').transform(Number),
    POSTGRES_KA_DATABASE: zod_1.z.string().default('kids-ascension'),
    POSTGRES_KA_USER: zod_1.z.string().default('postgres'),
    POSTGRES_KA_PASSWORD: zod_1.z.string(),
    POSTGRES_OL_URL: zod_1.z.string().url().optional(),
    POSTGRES_OL_HOST: zod_1.z.string().default('localhost'),
    POSTGRES_OL_PORT: zod_1.z.string().default('5432').transform(Number),
    POSTGRES_OL_DATABASE: zod_1.z.string().default('ozean-licht'),
    POSTGRES_OL_USER: zod_1.z.string().default('postgres'),
    POSTGRES_OL_PASSWORD: zod_1.z.string(),
    // Service URLs
    MEM0_API_URL: zod_1.z.string().url().default('http://mem0:8090'),
    N8N_API_URL: zod_1.z.string().url().default('http://n8n:5678'),
    N8N_API_KEY: zod_1.z.string().optional(),
    // External APIs
    CLOUDFLARE_API_TOKEN: zod_1.z.string(),
    CLOUDFLARE_ACCOUNT_ID: zod_1.z.string(),
    CLOUDFLARE_ZONE_ID: zod_1.z.string().optional(),
    GITHUB_APP_ID: zod_1.z.string(),
    GITHUB_PRIVATE_KEY: zod_1.z.string(),
    GITHUB_INSTALLATION_ID: zod_1.z.string(),
    // Security
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('24h'),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('60000').transform(Number),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().default('100').transform(Number),
    // Redis (for rate limiting and caching)
    REDIS_URL: zod_1.z.string().url().optional(),
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.string().default('6379').transform(Number),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    // Monitoring
    ENABLE_METRICS: zod_1.z.string().default('true').transform(v => v === 'true'),
    METRICS_PORT: zod_1.z.string().default('9090').transform(Number),
    // Logging
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    LOG_FORMAT: zod_1.z.enum(['json', 'pretty']).default('json'),
    // Connection Pools
    DB_POOL_MIN: zod_1.z.string().default('2').transform(Number),
    DB_POOL_MAX: zod_1.z.string().default('10').transform(Number),
    DB_IDLE_TIMEOUT_MS: zod_1.z.string().default('10000').transform(Number),
    // Timeouts
    DEFAULT_TIMEOUT_MS: zod_1.z.string().default('30000').transform(Number),
    DB_QUERY_TIMEOUT_MS: zod_1.z.string().default('10000').transform(Number),
    HTTP_TIMEOUT_MS: zod_1.z.string().default('30000').transform(Number),
});
// Parse and validate environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.config = parseEnv();
// Database connection configurations
exports.dbConfig = {
    kidsAscension: {
        connectionString: exports.config.POSTGRES_KA_URL,
        host: exports.config.POSTGRES_KA_HOST,
        port: exports.config.POSTGRES_KA_PORT,
        database: exports.config.POSTGRES_KA_DATABASE,
        user: exports.config.POSTGRES_KA_USER,
        password: exports.config.POSTGRES_KA_PASSWORD,
        min: exports.config.DB_POOL_MIN,
        max: exports.config.DB_POOL_MAX,
        idleTimeoutMillis: exports.config.DB_IDLE_TIMEOUT_MS,
        connectionTimeoutMillis: exports.config.DEFAULT_TIMEOUT_MS,
        statement_timeout: exports.config.DB_QUERY_TIMEOUT_MS,
    },
    ozeanLicht: {
        connectionString: exports.config.POSTGRES_OL_URL,
        host: exports.config.POSTGRES_OL_HOST,
        port: exports.config.POSTGRES_OL_PORT,
        database: exports.config.POSTGRES_OL_DATABASE,
        user: exports.config.POSTGRES_OL_USER,
        password: exports.config.POSTGRES_OL_PASSWORD,
        min: exports.config.DB_POOL_MIN,
        max: exports.config.DB_POOL_MAX,
        idleTimeoutMillis: exports.config.DB_IDLE_TIMEOUT_MS,
        connectionTimeoutMillis: exports.config.DEFAULT_TIMEOUT_MS,
        statement_timeout: exports.config.DB_QUERY_TIMEOUT_MS,
    },
};
// Service URLs
exports.serviceUrls = {
    mem0: exports.config.MEM0_API_URL,
    n8n: exports.config.N8N_API_URL,
};
// Feature flags
exports.features = {
    metrics: exports.config.ENABLE_METRICS,
    rateLimiting: true,
    authentication: exports.config.NODE_ENV === 'production',
    cors: true,
    compression: true,
    helmet: true,
};
//# sourceMappingURL=environment.js.map