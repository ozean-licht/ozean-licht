#!/usr/bin/env ts-node

/**
 * Test Connection Script - Shared Users Database
 *
 * Validates that shared_users_db is properly set up and accessible.
 * Tests database connection, table existence, and basic operations.
 *
 * Usage:
 *   ts-node shared/database/scripts/test-connection.ts
 *
 * Prerequisites:
 *   - PostgreSQL running with shared_users_db created
 *   - Migration 000_create_shared_users_db.sql executed
 *   - SHARED_USERS_DB_URL environment variable set
 *
 * Related Files:
 *   - migrations/000_create_shared_users_db.sql
 *   - prisma/schema.prisma
 */

import { Client } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

interface TestResult {
  name: string
  passed: boolean
  message: string
  details?: any
}

const results: TestResult[] = []

/**
 * Test database connection
 */
async function testConnection(): Promise<Client | null> {
  console.log('\n🔌 Testing Database Connection...\n')

  const connectionUrl = process.env.SHARED_USERS_DB_URL

  if (!connectionUrl) {
    results.push({
      name: 'Environment Variable',
      passed: false,
      message: 'SHARED_USERS_DB_URL not set in environment'
    })
    return null
  }

  results.push({
    name: 'Environment Variable',
    passed: true,
    message: 'SHARED_USERS_DB_URL found'
  })

  try {
    const client = new Client({ connectionString: connectionUrl })
    await client.connect()

    // Test basic query
    const res = await client.query('SELECT NOW() as current_time')

    results.push({
      name: 'Database Connection',
      passed: true,
      message: 'Successfully connected to shared_users_db',
      details: { currentTime: res.rows[0].current_time }
    })

    return client
  } catch (error: any) {
    results.push({
      name: 'Database Connection',
      passed: false,
      message: `Failed to connect: ${error.message}`,
      details: { error: error.stack }
    })
    return null
  }
}

/**
 * Test table existence
 */
async function testTables(client: Client): Promise<void> {
  console.log('📋 Testing Table Existence...\n')

  const expectedTables = [
    'users',
    'user_entities',
    'sessions',
    'oauth_accounts',
    'password_reset_tokens',
    'email_verification_tokens'
  ]

  try {
    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    const foundTables = res.rows.map((row) => row.table_name)
    const missingTables = expectedTables.filter(t => !foundTables.includes(t))
    const extraTables = foundTables.filter((t: string) => !expectedTables.includes(t))

    if (missingTables.length === 0) {
      results.push({
        name: 'Table Existence',
        passed: true,
        message: `All ${expectedTables.length} expected tables found`,
        details: { foundTables }
      })
    } else {
      results.push({
        name: 'Table Existence',
        passed: false,
        message: `Missing tables: ${missingTables.join(', ')}`,
        details: { foundTables, missingTables, extraTables }
      })
    }
  } catch (error: any) {
    results.push({
      name: 'Table Existence',
      passed: false,
      message: `Failed to query tables: ${error.message}`
    })
  }
}

/**
 * Test indexes
 */
async function testIndexes(client: Client): Promise<void> {
  console.log('🔍 Testing Indexes...\n')

  try {
    const res = await client.query(`
      SELECT
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `)

    const indexCount = res.rows.length
    const indexesByTable = res.rows.reduce((acc: any, row: any) => {
      if (!acc[row.tablename]) acc[row.tablename] = []
      acc[row.tablename].push(row.indexname)
      return acc
    }, {})

    results.push({
      name: 'Indexes',
      passed: indexCount > 0,
      message: `Found ${indexCount} indexes`,
      details: { indexCount, indexesByTable }
    })
  } catch (error: any) {
    results.push({
      name: 'Indexes',
      passed: false,
      message: `Failed to query indexes: ${error.message}`
    })
  }
}

/**
 * Test foreign keys
 */
async function testForeignKeys(client: Client): Promise<void> {
  console.log('🔗 Testing Foreign Keys...\n')

  try {
    const res = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `)

    const foreignKeyCount = res.rows.length

    results.push({
      name: 'Foreign Keys',
      passed: foreignKeyCount > 0,
      message: `Found ${foreignKeyCount} foreign key constraints`,
      details: { foreignKeyCount, foreignKeys: res.rows }
    })
  } catch (error: any) {
    results.push({
      name: 'Foreign Keys',
      passed: false,
      message: `Failed to query foreign keys: ${error.message}`
    })
  }
}

/**
 * Test triggers
 */
async function testTriggers(client: Client): Promise<void> {
  console.log('⚡ Testing Triggers...\n')

  try {
    const res = await client.query(`
      SELECT
        event_object_table AS table_name,
        trigger_name,
        event_manipulation,
        action_statement
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `)

    const triggerCount = res.rows.length

    // We expect 3 triggers (updated_at for users, user_entities, oauth_accounts)
    const expectedTriggerCount = 3

    results.push({
      name: 'Triggers',
      passed: triggerCount === expectedTriggerCount,
      message: `Found ${triggerCount} trigger(s) (expected ${expectedTriggerCount})`,
      details: { triggerCount, triggers: res.rows }
    })
  } catch (error: any) {
    results.push({
      name: 'Triggers',
      passed: false,
      message: `Failed to query triggers: ${error.message}`
    })
  }
}

/**
 * Test system user seed data
 */
async function testSeedData(client: Client): Promise<void> {
  console.log('🌱 Testing Seed Data...\n')

  try {
    const res = await client.query(`
      SELECT id, email, name, is_active
      FROM users
      WHERE id = '00000000-0000-0000-0000-000000000000'
    `)

    if (res.rows.length > 0) {
      results.push({
        name: 'Seed Data',
        passed: true,
        message: 'System user found',
        details: { systemUser: res.rows[0] }
      })
    } else {
      results.push({
        name: 'Seed Data',
        passed: false,
        message: 'System user not found (may be optional)'
      })
    }
  } catch (error: any) {
    results.push({
      name: 'Seed Data',
      passed: false,
      message: `Failed to query seed data: ${error.message}`
    })
  }
}

/**
 * Test basic CRUD operations
 */
async function testCRUDOperations(client: Client): Promise<void> {
  console.log('✍️  Testing CRUD Operations...\n')

  const testUserId = '99999999-9999-9999-9999-999999999999'
  const testEmail = `test-${Date.now()}@test.com`

  try {
    // Create
    await client.query('BEGIN')
    await client.query(`
      INSERT INTO users (id, email, name, is_verified)
      VALUES ($1, $2, $3, true)
    `, [testUserId, testEmail, 'Test User'])

    // Read
    const readRes = await client.query('SELECT * FROM users WHERE id = $1', [testUserId])

    if (readRes.rows.length === 0) {
      throw new Error('Failed to read created user')
    }

    // Update
    await client.query(`
      UPDATE users SET name = $1 WHERE id = $2
    `, ['Updated Test User', testUserId])

    // Verify update
    const updateRes = await client.query('SELECT name FROM users WHERE id = $1', [testUserId])
    if (updateRes.rows[0].name !== 'Updated Test User') {
      throw new Error('Update operation failed')
    }

    // Delete
    await client.query('DELETE FROM users WHERE id = $1', [testUserId])

    // Verify deletion
    const deleteRes = await client.query('SELECT * FROM users WHERE id = $1', [testUserId])
    if (deleteRes.rows.length > 0) {
      throw new Error('Delete operation failed')
    }

    await client.query('COMMIT')

    results.push({
      name: 'CRUD Operations',
      passed: true,
      message: 'Create, Read, Update, Delete operations successful'
    })
  } catch (error: any) {
    await client.query('ROLLBACK')
    results.push({
      name: 'CRUD Operations',
      passed: false,
      message: `CRUD operations failed: ${error.message}`,
      details: { error: error.stack }
    })
  }
}

/**
 * Print results summary
 */
function printResults(): void {
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(60) + '\n')

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.name}`)
    console.log(`   ${result.message}`)
    if (result.details && !result.passed) {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
    }
    if (index < results.length - 1) console.log('')
  })

  console.log('\n' + '='.repeat(60))
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`)
  console.log('='.repeat(60) + '\n')

  if (failed === 0) {
    console.log('🎉 All tests passed! shared_users_db is ready for use.\n')
  } else {
    console.log('⚠️  Some tests failed. Review the errors above.\n')
  }
}

/**
 * Main test execution
 */
async function main() {
  console.log('╔' + '═'.repeat(58) + '╗')
  console.log('║  Shared Users Database - Connection Test                ║')
  console.log('║  Phase 0: Kids Ascension Integration                    ║')
  console.log('╚' + '═'.repeat(58) + '╝')

  let client: Client | null = null

  try {
    // Test connection
    client = await testConnection()

    if (!client) {
      console.error('❌ Cannot proceed with tests - database connection failed\n')
      process.exit(1)
    }

    // Run all tests
    await testTables(client)
    await testIndexes(client)
    await testForeignKeys(client)
    await testTriggers(client)
    await testSeedData(client)
    await testCRUDOperations(client)

    // Print results
    printResults()

    // Exit with appropriate code
    const failed = results.filter(r => !r.passed).length
    process.exit(failed > 0 ? 1 : 0)

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.end()
    }
  }
}

// Run tests
main()
