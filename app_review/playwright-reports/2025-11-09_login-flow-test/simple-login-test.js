/**
 * Simple Playwright Script - Admin Login Flow Test
 * No test framework - just pure automation
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function testLoginFlow() {
  console.log('🚀 Starting login flow test...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    success: false,
    screenshots: [],
    logs: [],
    networkRequests: [],
    errors: []
  };

  // Capture console logs
  page.on('console', msg => {
    results.logs.push({ type: msg.type(), text: msg.text() });
    console.log(`[Console ${msg.type()}]`, msg.text());
  });

  // Capture errors
  page.on('pageerror', error => {
    results.errors.push(error.message);
    console.error('[Page Error]', error.message);
  });

  try {
    // Step 1: Navigate to login
    console.log('📍 Step 1: Navigating to login page...');
    await page.goto('http://localhost:9200/login');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshot-01-login-page.png' });
    results.screenshots.push('screenshot-01-login-page.png');
    console.log('✅ Login page loaded\n');

    // Step 2: Fill in credentials
    console.log('📝 Step 2: Filling in credentials...');
    await page.fill('input[name="email"], input[type="email"]', 'super@ozean-licht.dev');
    await page.fill('input[name="password"], input[type="password"]', 'SuperAdmin123!');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-02-form-filled.png' });
    results.screenshots.push('screenshot-02-form-filled.png');
    console.log('✅ Credentials entered\n');

    // Step 3: Submit form
    console.log('🔐 Step 3: Submitting login form...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshot-03-after-submit.png' });
    results.screenshots.push('screenshot-03-after-submit.png');

    // Check current URL
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Step 4: Check if redirected to dashboard
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard\n');
      results.success = true;
      await page.screenshot({ path: 'screenshot-04-dashboard.png' });
      results.screenshots.push('screenshot-04-dashboard.png');

      // Check for 404 or success
      const pageContent = await page.content();
      if (pageContent.includes('404')) {
        console.log('⚠️  Dashboard shows 404 (page not implemented yet)');
        results.dashboardStatus = '404 - Page not found';
      } else {
        console.log('✅ Dashboard page loaded successfully');
        results.dashboardStatus = 'success';
      }
    } else if (currentUrl.includes('/login')) {
      console.log('❌ Still on login page - authentication failed\n');
      results.success = false;

      // Check for error message
      const errorMsg = await page.locator('[role="alert"], .error, .text-red-500').textContent().catch(() => null);
      if (errorMsg) {
        console.log(`Error message: ${errorMsg}`);
        results.errorMessage = errorMsg;
      }
    }

    // Step 5: Check cookies/session
    console.log('\n🍪 Step 5: Checking session cookies...');
    const cookies = await context.cookies();
    const authCookies = cookies.filter(c => c.name.includes('auth') || c.name.includes('session'));
    console.log(`Found ${authCookies.length} auth-related cookies:`);
    authCookies.forEach(cookie => {
      console.log(`  - ${cookie.name}`);
    });
    results.cookies = authCookies.map(c => c.name);

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    results.errors.push(error.message);
    await page.screenshot({ path: 'screenshot-error.png' });
    results.screenshots.push('screenshot-error.png');
  } finally {
    // Save results
    fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
    console.log('\n📄 Results saved to test-results.json');
    console.log(`📸 Screenshots saved: ${results.screenshots.join(', ')}`);

    await browser.close();
    console.log('\n✅ Test complete!');
  }

  return results;
}

// Run the test
testLoginFlow()
  .then(results => {
    console.log('\n=== FINAL RESULTS ===');
    console.log(`Success: ${results.success}`);
    console.log(`Screenshots: ${results.screenshots.length}`);
    console.log(`Logs: ${results.logs.length}`);
    console.log(`Errors: ${results.errors.length}`);
    process.exit(results.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
