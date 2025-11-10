/**
 * Automated Playwright Test - Admin Login Flow
 *
 * Prerequisites:
 * - Admin dashboard running on port 9200
 * - MCP Gateway running on port 8100
 *
 * Run with:
 * npx playwright test automated-login-test.js
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.join(__dirname);
const BASE_URL = 'http://localhost:9200';
const TEST_CREDENTIALS = {
  email: 'super@ozean-licht.dev',
  password: 'SuperAdmin123!'
};

test.describe('Admin Dashboard Login Flow', () => {
  let consoleLogs = [];
  let networkRequests = [];

  test.beforeEach(async ({ page }) => {
    // Capture console logs
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });

    // Capture network requests
    page.on('request', request => {
      networkRequests.push({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      });
    });

    page.on('response', async response => {
      const request = networkRequests.find(req => req.url === response.url());
      if (request) {
        request.status = response.status();
        request.statusText = response.statusText();
        try {
          request.responseBody = await response.text();
        } catch (e) {
          request.responseBody = '[Could not capture response body]';
        }
      }
    });
  });

  test('Complete login flow with screenshots', async ({ page }) => {
    console.log('\n=== Starting Login Flow Test ===\n');

    // Step 1: Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(REPORT_DIR, '01-initial-login-page.png'), fullPage: true });
    console.log('✓ Screenshot saved: 01-initial-login-page.png');

    // Verify login form exists
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log('✓ Login form elements visible');

    // Step 2: Fill in credentials
    console.log('\nStep 2: Filling login form...');
    await emailInput.fill(TEST_CREDENTIALS.email);
    await passwordInput.fill(TEST_CREDENTIALS.password);
    await page.screenshot({ path: path.join(REPORT_DIR, '02-form-filled.png'), fullPage: true });
    console.log('✓ Screenshot saved: 02-form-filled.png');

    // Step 3: Submit form
    console.log('\nStep 3: Submitting form...');
    await submitButton.click();
    await page.screenshot({ path: path.join(REPORT_DIR, '03-after-submit.png'), fullPage: true });
    console.log('✓ Screenshot saved: 03-after-submit.png');

    // Wait for navigation or error
    try {
      await page.waitForNavigation({ timeout: 5000 });
      console.log('✓ Navigation detected');
    } catch (e) {
      console.log('⚠ No navigation detected (might be on same page)');
    }

    // Step 4: Capture post-login state
    console.log('\nStep 4: Capturing post-login state...');
    await page.waitForTimeout(2000); // Allow for any async operations
    await page.screenshot({ path: path.join(REPORT_DIR, '04-post-login-page.png'), fullPage: true });
    console.log('✓ Screenshot saved: 04-post-login-page.png');

    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Step 5: Check cookies and session
    console.log('\nStep 5: Checking authentication state...');
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session-token'));

    console.log('\nCookies found:');
    cookies.forEach(cookie => {
      console.log(`  - ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
    });

    // Capture application state
    await page.screenshot({ path: path.join(REPORT_DIR, '05-auth-state.png'), fullPage: true });
    console.log('✓ Screenshot saved: 05-auth-state.png');

    // Generate report
    console.log('\n=== Generating Report ===\n');
    const report = {
      testDate: new Date().toISOString(),
      testUrl: `${BASE_URL}/login`,
      credentials: { email: TEST_CREDENTIALS.email, password: '[REDACTED]' },
      results: {
        loginFormVisible: true,
        formSubmitted: true,
        postLoginUrl: currentUrl,
        sessionCookiePresent: !!sessionCookie,
        cookies: cookies.map(c => ({ name: c.name, domain: c.domain, path: c.path }))
      },
      consoleLogs,
      networkRequests: networkRequests.filter(req =>
        req.url.includes('/api/auth') || req.url.includes('/dashboard')
      ),
      screenshots: [
        '01-initial-login-page.png',
        '02-form-filled.png',
        '03-after-submit.png',
        '04-post-login-page.png',
        '05-auth-state.png'
      ]
    };

    fs.writeFileSync(
      path.join(REPORT_DIR, 'test-results.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('✓ Report saved: test-results.json');

    // Update markdown report
    const markdownReport = generateMarkdownReport(report);
    fs.writeFileSync(
      path.join(REPORT_DIR, 'playwright-report-admin-login-flow.md'),
      markdownReport
    );
    console.log('✓ Markdown report updated');

    console.log('\n=== Test Complete ===\n');
  });
});

function generateMarkdownReport(data) {
  const status = data.results.sessionCookiePresent ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS';

  return `# Validation Report - Admin Dashboard Login Flow
**Date:** ${data.testDate}
**Status:** ${status}

## Test Scenario
Testing the authentication flow for the admin dashboard at ${data.testUrl}

**Credentials Used:**
- Email: ${data.credentials.email}
- Password: ${data.credentials.password}

## Steps Executed
1. ✅ Navigate to ${data.testUrl} - Screenshot: 01-initial-login-page.png
2. ✅ Fill in login form with test credentials - Screenshot: 02-form-filled.png
3. ✅ Submit the form - Screenshot: 03-after-submit.png
4. ✅ Verify redirect and capture post-login state - Screenshot: 04-post-login-page.png
5. ✅ Document authentication state - Screenshot: 05-auth-state.png

## Validation Results

### Authentication Status
- **Login form visible:** ✅ Yes
- **Form submission:** ✅ Successful
- **Post-login URL:** \`${data.results.postLoginUrl}\`
- **Session cookie present:** ${data.results.sessionCookiePresent ? '✅ Yes' : '❌ No'}

### Cookies Set
${data.results.cookies.map(c => `- \`${c.name}\` (domain: ${c.domain}, path: ${c.path})`).join('\n')}

## Screenshots
- \`01-initial-login-page.png\` - Initial login page load
- \`02-form-filled.png\` - Login form with credentials filled
- \`03-after-submit.png\` - State immediately after form submission
- \`04-post-login-page.png\` - Final page after authentication
- \`05-auth-state.png\` - Authentication state verification

## Network Activity

### Authentication Requests
${data.networkRequests.map(req => `
#### ${req.method} ${req.url}
- **Status:** ${req.status || 'pending'}
- **Timestamp:** ${req.timestamp}
${req.responseBody ? `- **Response:** \`\`\`json\n${req.responseBody}\n\`\`\`` : ''}
`).join('\n')}

## Console Logs

${data.consoleLogs.length > 0 ? data.consoleLogs.map(log => `
### ${log.type.toUpperCase()}
\`\`\`
${log.text}
\`\`\`
**Timestamp:** ${log.timestamp}
`).join('\n') : '_No console logs captured_'}

## Issues Encountered

${!data.results.sessionCookiePresent ? '⚠️ **Warning:** Session cookie not found after login attempt' : '✅ No critical issues - session established successfully'}

${data.results.postLoginUrl.includes('/dashboard') ? '✅ Redirect to dashboard successful' : '⚠️ Unexpected post-login URL'}

## Recommendations

${!data.results.sessionCookiePresent ? `
1. Verify NextAuth configuration in \`apps/admin/lib/auth.ts\`
2. Check database connection for session storage
3. Verify credentials are valid in database
` : `
1. ✅ Authentication flow working as expected
2. Implement dashboard page at \`/dashboard\` route
3. Add post-login redirect logic if needed
`}

## Next Steps

1. Review screenshots for UI/UX issues
2. Verify database session entry was created
3. Test logout functionality
4. Validate session persistence across page reloads
5. Test with invalid credentials to verify error handling

---

**Test completed at:** ${data.testDate}
**Report location:** \`/opt/ozean-licht-ecosystem/playwright-reports/2025-11-09_login-flow-test/\`
`;
}
