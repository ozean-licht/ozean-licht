/**
 * Integration Test Setup
 *
 * Global setup and teardown for integration tests.
 * Manages test database lifecycle and cleanup.
 */

import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, afterEach } from 'vitest';

// Test database instance
export const testDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST || 'postgresql://test:test@localhost:5432/orchestrator_test',
    },
  },
  log: process.env.DEBUG_TESTS ? ['query', 'error', 'warn'] : ['error'],
});

// Setup: Run before all tests
beforeAll(async () => {
  console.log('[Test Setup] Initializing test database...');

  try {
    // Connect to database
    await testDb.$connect();

    // Clean slate: Drop and recreate schema
    // Note: In production tests, you'd run migrations instead
    await testDb.$executeRawUnsafe('DROP SCHEMA IF EXISTS public CASCADE');
    await testDb.$executeRawUnsafe('CREATE SCHEMA public');

    // TODO: Run Prisma migrations here
    // For now, assume schema is already set up
    // await execSync('npx prisma migrate deploy', {
    //   cwd: process.cwd(),
    //   env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST }
    // });

    console.log('[Test Setup] Test database initialized successfully');
  } catch (error) {
    console.error('[Test Setup] Failed to initialize test database:', error);
    throw error;
  }
});

// Cleanup: Run after each test
afterEach(async () => {
  console.log('[Test Cleanup] Cleaning up test data...');

  try {
    // Clean up test data in reverse dependency order
    await testDb.adw_workflow_events.deleteMany({});
    await testDb.adw_cron_jobs.deleteMany({});
    await testDb.adw_workflows.deleteMany({});
    await testDb.orchestrator_chat_messages.deleteMany({});

    console.log('[Test Cleanup] Test data cleaned successfully');
  } catch (error) {
    console.error('[Test Cleanup] Failed to clean test data:', error);
    // Don't throw - allow tests to continue
  }
});

// Teardown: Run after all tests
afterAll(async () => {
  console.log('[Test Teardown] Disconnecting from test database...');

  try {
    await testDb.$disconnect();
    console.log('[Test Teardown] Test database disconnected successfully');
  } catch (error) {
    console.error('[Test Teardown] Failed to disconnect from test database:', error);
  }
});

/**
 * Helper: Wait for a condition to be true
 *
 * @param condition - Function that returns true when condition is met
 * @param timeout - Maximum time to wait in milliseconds
 * @param interval - Check interval in milliseconds
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 10000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Helper: Create a test delay
 *
 * @param ms - Milliseconds to delay
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
