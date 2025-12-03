#!/usr/bin/env node
/**
 * Simple migration runner using pg directly
 * Usage: node scripts/run-migration.js <migration-file.sql>
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Simple env file loader (no external dependencies)
function loadEnvFile(envPath) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
  } catch (e) {
    // File not found is OK
  }
}

// Load .env.local
loadEnvFile(path.join(__dirname, '..', '.env.local'));

async function runMigration(migrationFile) {
  const databaseUrl = process.env.OZEAN_LICHT_DB_URL
    || process.env.OZEAN_LICHT_DATABASE_URL
    || process.env.DATABASE_URL_OL;

  if (!databaseUrl) {
    console.error('Error: OZEAN_LICHT_DB_URL environment variable not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const migrationPath = path.resolve(process.cwd(), 'migrations', migrationFile);
    if (!fs.existsSync(migrationPath)) {
      console.error(`Error: Migration file not found: ${migrationPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log(`Running migration: ${migrationFile}...`);

    await pool.query(sql);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: node scripts/run-migration.js <migration-file.sql>');
  console.error('Example: node scripts/run-migration.js 010_sprints.sql');
  process.exit(1);
}

runMigration(migrationFile);
