#!/usr/bin/env node

/**
 * Script to create test users for the admin dashboard
 * Creates users with different roles and entity scopes
 */

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ@localhost:32771/kids-ascension-db',
});

// Test users configuration
const testUsers = [
  {
    email: 'super@ozean-licht.dev',
    password: 'SuperAdmin123!',
    adminRole: 'super_admin',
    entityScope: null, // Can access all entities
    description: 'Super Admin - Full system access'
  },
  {
    email: 'admin.ka@ozean-licht.dev',
    password: 'KidsAdmin123!',
    adminRole: 'entity_admin',
    entityScope: 'kids_ascension',
    description: 'Kids Ascension Admin - Full access to Kids Ascension'
  },
  {
    email: 'admin.ol@ozean-licht.dev',
    password: 'OzeanAdmin123!',
    adminRole: 'entity_admin',
    entityScope: 'ozean_licht',
    description: 'Ozean Licht Admin - Full access to Ozean Licht'
  },
  {
    email: 'viewer@ozean-licht.dev',
    password: 'Viewer123!',
    adminRole: 'viewer',
    entityScope: null,
    description: 'Viewer - Read-only access to all entities'
  },
  {
    email: 'viewer.ka@ozean-licht.dev',
    password: 'ViewerKA123!',
    adminRole: 'viewer',
    entityScope: 'kids_ascension',
    description: 'Kids Ascension Viewer - Read-only access to Kids Ascension'
  }
];

async function createTestUsers() {
  try {
    console.log('🔧 Creating test users for admin dashboard...\n');

    // First, create the users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        admin_role VARCHAR(50) NOT NULL CHECK (admin_role IN ('super_admin', 'entity_admin', 'viewer')),
        entity_scope VARCHAR(50) CHECK (entity_scope IN ('kids_ascension', 'ozean_licht')),
        permissions JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Create each test user
    for (const testUser of testUsers) {
      try {
        // Hash the password
        const passwordHash = await bcrypt.hash(testUser.password, 10);

        // Insert into users table
        const userResult = await pool.query(
          'INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = $2 RETURNING id',
          [testUser.email, passwordHash]
        );

        const userId = userResult.rows[0].id;

        // Default permissions based on role
        let permissions = [];
        if (testUser.adminRole === 'super_admin') {
          permissions = ['all'];
        } else if (testUser.adminRole === 'entity_admin') {
          permissions = ['users:read', 'users:write', 'content:read', 'content:write', 'settings:read', 'settings:write'];
        } else if (testUser.adminRole === 'viewer') {
          permissions = ['users:read', 'content:read', 'settings:read'];
        }

        // Insert into admin_users table
        await pool.query(
          `INSERT INTO admin_users (user_id, admin_role, entity_scope, permissions, is_active)
           VALUES ($1, $2, $3, $4, true)
           ON CONFLICT (user_id)
           DO UPDATE SET admin_role = $2, entity_scope = $3, permissions = $4, is_active = true`,
          [userId, testUser.adminRole, testUser.entityScope, JSON.stringify(permissions)]
        );

        console.log(`✅ Created: ${testUser.description}`);
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Password: ${testUser.password}`);
        console.log(`   Role: ${testUser.adminRole}`);
        console.log(`   Entity: ${testUser.entityScope || 'All'}\n`);
      } catch (err) {
        console.error(`❌ Error creating user ${testUser.email}:`, err.message);
      }
    }

    console.log('\n📋 Summary of Test Users Created:');
    console.log('=====================================\n');

    console.log('🔐 SUPER ADMIN:');
    console.log('   Email: super@ozean-licht.dev');
    console.log('   Password: SuperAdmin123!');
    console.log('   Access: Full system access\n');

    console.log('👤 ENTITY ADMINS:');
    console.log('   Kids Ascension:');
    console.log('      Email: admin.ka@ozean-licht.dev');
    console.log('      Password: KidsAdmin123!\n');
    console.log('   Ozean Licht:');
    console.log('      Email: admin.ol@ozean-licht.dev');
    console.log('      Password: OzeanAdmin123!\n');

    console.log('👁️ VIEWERS:');
    console.log('   All Entities:');
    console.log('      Email: viewer@ozean-licht.dev');
    console.log('      Password: Viewer123!\n');
    console.log('   Kids Ascension Only:');
    console.log('      Email: viewer.ka@ozean-licht.dev');
    console.log('      Password: ViewerKA123!\n');

    console.log('=====================================');
    console.log('✨ Test users created successfully!');

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
createTestUsers();