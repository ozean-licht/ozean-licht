/**
 * Test to capture the actual dashboard page content and any errors
 */

const { chromium } = require('playwright');

async function testDashboard() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture all errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push({ type: 'page_error', message: error.message, stack: error.stack });
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console_error', text: msg.text() });
    }
  });

  try {
    // 1. Login
    await page.goto('http://localhost:9200/login');
    await page.fill('input[name="email"], input[type="email"]', 'super@ozean-licht.dev');
    await page.fill('input[name="password"], input[type="password"]', 'SuperAdmin123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // 2. Check dashboard
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    // 3. Get page content
    const content = await page.content();
    console.log('\n=== PAGE CONTENT ===');
    console.log(content.substring(0, 1000)); // First 1000 chars

    // 4. Check for specific elements
    const title = await page.title();
    console.log('\n=== PAGE TITLE ===');
    console.log(title);

    // 5. Check for h1
    const h1Text = await page.locator('h1').textContent().catch(() => null);
    console.log('\n=== H1 TEXT ===');
    console.log(h1Text || 'No H1 found');

    // 6. Look for error messages
    const bodyText = await page.locator('body').textContent();
    console.log('\n=== BODY TEXT (first 500 chars) ===');
    console.log(bodyText.substring(0, 500));

    // 7. Screenshot
    await page.screenshot({ path: 'dashboard-debug.png' });
    console.log('\n📸 Screenshot saved: dashboard-debug.png');

    // 8. Report errors
    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach((err, i) => {
        console.log(`Error ${i + 1}:`, JSON.stringify(err, null, 2));
      });
    } else {
      console.log('\n✅ No JavaScript errors detected');
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDashboard();
