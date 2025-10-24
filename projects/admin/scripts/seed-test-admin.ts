#!/usr/bin/env ts-node

/**
 * Seed script to create test admin user
 * Creates a super_admin user for development and testing
 */

import { MCPGatewayClientWithQueries } from '../lib/mcp-client'
import { hashPassword } from '../lib/password'

const TEST_USER_ID = 'a0000000-0000-0000-0000-000000000001'
const TEST_ADMIN_ID = 'b0000000-0000-0000-0000-000000000001'
const TEST_EMAIL = 'admin@ozean-licht.dev'
const TEST_PASSWORD = 'admin123'

async function seedTestAdmin() {
  console.log('🌱 Seeding test admin user...\n')

  try {
    const client = new MCPGatewayClientWithQueries({
      baseUrl: process.env.MCP_GATEWAY_URL || 'http://localhost:8100',
      database: process.env.DATABASE_NAME || 'shared-users-db'
    })

    // Check if user already exists
    console.log('Checking if test user already exists...')
    const existingUsers = await client.query(
      'SELECT id, email FROM users WHERE email = $1',
      [TEST_EMAIL]
    )

    if (existingUsers.length > 0) {
      console.log('✅ Test admin user already exists')
      console.log(`   Email: ${TEST_EMAIL}`)
      console.log(`   User ID: ${existingUsers[0].id}`)
      console.log('\nNo changes made.')
      return
    }

    // Hash password
    console.log('Hashing password...')
    const passwordHash = await hashPassword(TEST_PASSWORD)

    // Create base user
    console.log('Creating base user...')
    await client.execute(
      `INSERT INTO users (id, email, password_hash, is_verified, created_at)
       VALUES ($1, $2, $3, true, NOW())`,
      [TEST_USER_ID, TEST_EMAIL, passwordHash]
    )
    console.log('✅ Base user created')

    // Create admin user
    console.log('Creating admin user record...')
    await client.execute(
      `INSERT INTO admin_users (id, user_id, admin_role, entity_scope, is_active, permissions, created_at, updated_at)
       VALUES ($1, $2, 'super_admin', NULL, true, $3, NOW(), NOW())`,
      [TEST_ADMIN_ID, TEST_USER_ID, JSON.stringify(['*'])]
    )
    console.log('✅ Admin user created')

    console.log('\n🎉 Test admin user created successfully!\n')
    console.log('Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:       ${TEST_EMAIL}`)
    console.log(`   Password:    ${TEST_PASSWORD}`)
    console.log(`   Role:        super_admin`)
    console.log(`   Permissions: ["*"] (all permissions)`)
    console.log(`   User ID:     ${TEST_USER_ID}`)
    console.log(`   Admin ID:    ${TEST_ADMIN_ID}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('You can now log in to the admin dashboard at:')
    console.log(`http://localhost:${process.env.FRONTEND_PORT || 9200}/login\n`)

  } catch (error) {
    console.error('❌ Failed to seed test admin:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Run the seed script
seedTestAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })
