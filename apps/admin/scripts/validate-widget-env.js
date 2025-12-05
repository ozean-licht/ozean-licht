#!/usr/bin/env node

/**
 * Widget Environment Validation Script
 *
 * Validates that all required widget environment variables are correctly configured.
 * Run this script before deploying or starting the widget system.
 *
 * Usage:
 *   node scripts/validate-widget-env.js
 *   npm run validate:widget-env
 */

const fs = require('fs');
const path = require('path');

// Load .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Don't override existing env vars
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.blue}${msg}${COLORS.reset}`),
};

let hasErrors = false;
let hasWarnings = false;

/**
 * Validate environment variable exists
 */
function validateRequired(varName, description) {
  const value = process.env[varName];

  if (!value) {
    log.error(`Missing required variable: ${varName}`);
    log.info(`  Description: ${description}`);
    hasErrors = true;
    return false;
  }

  return value;
}

/**
 * Validate hex key format (should be 64 characters for 32-byte keys)
 */
function validateHexKey(varName, value) {
  if (!/^[a-f0-9]{64}$/i.test(value)) {
    log.error(`Invalid format for ${varName}: should be 64 hex characters (32 bytes)`);
    log.info(`  Current length: ${value.length} characters`);
    log.info(`  Generate with: openssl rand -hex 32`);
    hasErrors = true;
    return false;
  }

  log.success(`${varName} format is valid`);
  return true;
}

/**
 * Validate CORS origins format
 */
function validateOrigins(origins) {
  if (!origins) {
    return false;
  }

  const originList = origins.split(',').map(o => o.trim());

  if (originList.length === 0) {
    log.error('WIDGET_ALLOWED_ORIGINS is empty');
    hasErrors = true;
    return false;
  }

  let isValid = true;

  originList.forEach(origin => {
    // Check for trailing slashes
    if (origin.endsWith('/')) {
      log.error(`Origin has trailing slash: ${origin}`);
      log.info('  Remove trailing slashes from all origins');
      hasErrors = true;
      isValid = false;
    }

    // Check for valid URL format
    if (!origin.startsWith('http://') && !origin.startsWith('https://')) {
      log.error(`Origin missing protocol: ${origin}`);
      log.info('  Add http:// or https:// prefix');
      hasErrors = true;
      isValid = false;
    }

    // Warn about http in production
    if (origin.startsWith('http://') && process.env.NODE_ENV === 'production' && !origin.includes('localhost')) {
      log.warning(`HTTP origin in production: ${origin}`);
      log.info('  Consider using HTTPS for production');
      hasWarnings = true;
    }
  });

  if (isValid) {
    log.success(`WIDGET_ALLOWED_ORIGINS format is valid (${originList.length} origins)`);
    originList.forEach(origin => {
      log.info(`  - ${origin}`);
    });
  }

  return isValid;
}

/**
 * Check for localhost in production
 */
function checkProductionConfig() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  log.header('Production Environment Checks');

  const origins = process.env.WIDGET_ALLOWED_ORIGINS;
  if (origins && origins.includes('localhost')) {
    log.warning('WIDGET_ALLOWED_ORIGINS contains localhost in production');
    log.info('  Remove localhost/127.0.0.1 origins for production');
    hasWarnings = true;
  }

  // Check if using default/example values
  const platformKey1 = process.env.WIDGET_PLATFORM_KEY_OZEAN_LICHT;
  const platformKey2 = process.env.WIDGET_PLATFORM_KEY_KIDS_ASCENSION;
  const hmacSecret = process.env.WIDGET_HMAC_SECRET;

  if (platformKey1 && platformKey1.includes('your_') || platformKey1 === 'your_32_char_hex_key_here') {
    log.error('WIDGET_PLATFORM_KEY_OZEAN_LICHT still has placeholder value');
    log.info('  Generate a real key with: openssl rand -hex 32');
    hasErrors = true;
  }

  if (platformKey2 && platformKey2.includes('your_') || platformKey2 === 'your_32_char_hex_key_here') {
    log.error('WIDGET_PLATFORM_KEY_KIDS_ASCENSION still has placeholder value');
    log.info('  Generate a real key with: openssl rand -hex 32');
    hasErrors = true;
  }

  if (hmacSecret && hmacSecret.includes('your_') || hmacSecret === 'your_32_char_hex_hmac_secret') {
    log.error('WIDGET_HMAC_SECRET still has placeholder value');
    log.info('  Generate a real secret with: openssl rand -hex 32');
    hasErrors = true;
  }
}

/**
 * Main validation function
 */
function validateWidgetEnvironment() {
  console.log('\n' + '='.repeat(60));
  console.log('Widget Environment Validation');
  console.log('='.repeat(60));

  log.header('Required Variables');

  // Validate platform keys
  const ozeanKey = validateRequired(
    'WIDGET_PLATFORM_KEY_OZEAN_LICHT',
    'Platform API key for Ozean Licht'
  );
  if (ozeanKey) {
    validateHexKey('WIDGET_PLATFORM_KEY_OZEAN_LICHT', ozeanKey);
  }

  const kidsKey = validateRequired(
    'WIDGET_PLATFORM_KEY_KIDS_ASCENSION',
    'Platform API key for Kids Ascension'
  );
  if (kidsKey) {
    validateHexKey('WIDGET_PLATFORM_KEY_KIDS_ASCENSION', kidsKey);
  }

  // Check if keys are the same (security issue)
  if (ozeanKey && kidsKey && ozeanKey === kidsKey) {
    log.error('Platform keys are identical!');
    log.info('  Each platform should have a unique key for security isolation');
    hasErrors = true;
  }

  // Validate HMAC secret
  const hmacSecret = validateRequired(
    'WIDGET_HMAC_SECRET',
    'HMAC secret for user identity verification'
  );
  if (hmacSecret) {
    validateHexKey('WIDGET_HMAC_SECRET', hmacSecret);
  }

  log.header('CORS Configuration');

  // Validate allowed origins
  const origins = validateRequired(
    'WIDGET_ALLOWED_ORIGINS',
    'Comma-separated list of allowed origins for CORS'
  );
  if (origins) {
    validateOrigins(origins);
  }

  // Production-specific checks
  checkProductionConfig();

  // Summary
  console.log('\n' + '='.repeat(60));
  if (hasErrors) {
    log.error('Validation FAILED - Fix the errors above');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  } else if (hasWarnings) {
    log.warning('Validation PASSED with warnings');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    log.success('Validation PASSED - All checks successful!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  }
}

// Run validation
validateWidgetEnvironment();
