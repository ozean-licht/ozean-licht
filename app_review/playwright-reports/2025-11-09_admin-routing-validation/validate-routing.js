/**
 * Admin Dashboard Routing Validation Script
 *
 * Usage: node validate-routing.js
 * Requires: npm install playwright
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:9200';
const REPORT_DIR = __dirname;
const SCREENSHOT_DIR = path.join(REPORT_DIR, 'screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function validateRoute(page, route, stepNumber) {
  console.log(`\n=== Step ${stepNumber}: Testing ${route} ===`);

  const url = `${BASE_URL}${route}`;
  const results = {
    url: url,
    timestamp: new Date().toISOString(),
    initialUrl: url,
    finalUrl: null,
    statusCode: null,
    redirectChain: [],
    consoleErrors: [],
    networkErrors: [],
    pageTitle: null,
    screenshot: null
  };

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
      console.log(`  [Console Error] ${msg.text()}`);
    }
  });

  // Capture network responses
  page.on('response', response => {
    if (response.url() === url) {
      results.statusCode = response.status();
      console.log(`  [Status Code] ${response.status()}`);
    }
  });

  try {
    // Navigate and capture redirect chain
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // Capture final URL after redirects
    results.finalUrl = page.url();
    results.statusCode = response.status();

    // Build redirect chain
    let currentResponse = response;
    while (currentResponse) {
      const status = currentResponse.status();
      const currentUrl = currentResponse.url();

      if (status >= 300 && status < 400) {
        const location = currentResponse.headers()['location'];
        results.redirectChain.push({
          from: currentUrl,
          to: location,
          status: status
        });
        console.log(`  [Redirect] ${status}: ${currentUrl} -> ${location}`);
      }

      currentResponse = currentResponse.request().redirectedFrom()?.response();
    }

    // Capture page title
    results.pageTitle = await page.title();
    console.log(`  [Page Title] ${results.pageTitle}`);

    // Wait a bit for any async rendering
    await page.waitForTimeout(1000);

    // Take screenshot
    const screenshotName = `${stepNumber.toString().padStart(2, '0')}-${route.replace(/\//g, '-') || 'root'}.png`;
    const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    results.screenshot = screenshotName;
    console.log(`  [Screenshot] ${screenshotName}`);

    // Check for specific elements
    const bodyText = await page.evaluate(() => document.body.innerText);
    results.bodyPreview = bodyText.substring(0, 200);

    // Check for 404 indicators
    const has404 = bodyText.toLowerCase().includes('404') ||
                   bodyText.toLowerCase().includes('not found');
    if (has404) {
      console.log(`  [WARNING] Page may contain 404 error`);
      results.appears404 = true;
    }

    console.log(`  [Final URL] ${results.finalUrl}`);

    if (results.finalUrl !== url) {
      console.log(`  [Redirect Detected] ${url} -> ${results.finalUrl}`);
    }

  } catch (error) {
    results.error = error.message;
    console.log(`  [Error] ${error.message}`);
  }

  return results;
}

async function main() {
  console.log('='.repeat(60));
  console.log('Admin Dashboard Routing Validation');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Report Directory: ${REPORT_DIR}`);
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const allResults = [];

  // Test routes
  const routes = ['/', '/dashboard', '/login'];

  for (let i = 0; i < routes.length; i++) {
    const results = await validateRoute(page, routes[i], i + 1);
    allResults.push(results);

    // Small delay between tests
    await page.waitForTimeout(500);
  }

  await browser.close();

  // Generate report
  const report = generateReport(allResults);
  const reportPath = path.join(REPORT_DIR, 'validation-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Report saved to: ${reportPath}`);
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
  console.log('='.repeat(60));
}

function generateReport(results) {
  const timestamp = new Date().toISOString();

  let report = `# Admin Dashboard Routing Validation Report

**Date:** ${timestamp}
**Base URL:** ${BASE_URL}
**Status:** ${results.every(r => !r.error) ? '✅ All routes accessible' : '❌ Some routes failed'}

## Executive Summary

`;

  // Summary table
  report += `| Route | Status Code | Final URL | Result |\n`;
  report += `|-------|-------------|-----------|--------|\n`;

  results.forEach(r => {
    const redirected = r.finalUrl !== r.initialUrl ? '🔄' : '✅';
    const status = r.error ? '❌ ERROR' :
                   r.appears404 ? '⚠️ 404' :
                   r.statusCode === 200 ? '✅ OK' :
                   `${r.statusCode}`;
    report += `| ${r.initialUrl} | ${r.statusCode || 'N/A'} | ${r.finalUrl || 'N/A'} | ${status} ${redirected} |\n`;
  });

  report += `\n## Detailed Results\n\n`;

  results.forEach((r, index) => {
    report += `### ${index + 1}. ${r.initialUrl}\n\n`;
    report += `**Timestamp:** ${r.timestamp}\n\n`;
    report += `**Status Code:** ${r.statusCode || 'N/A'}\n\n`;
    report += `**Final URL:** ${r.finalUrl || 'N/A'}\n\n`;

    if (r.redirectChain.length > 0) {
      report += `**Redirect Chain:**\n\n`;
      r.redirectChain.forEach(redirect => {
        report += `- ${redirect.status}: ${redirect.from} → ${redirect.to}\n`;
      });
      report += `\n`;
    }

    if (r.pageTitle) {
      report += `**Page Title:** ${r.pageTitle}\n\n`;
    }

    if (r.appears404) {
      report += `**⚠️ WARNING:** Page appears to show 404 error\n\n`;
    }

    if (r.consoleErrors.length > 0) {
      report += `**Console Errors:**\n\n`;
      r.consoleErrors.forEach(err => {
        report += `- ${err}\n`;
      });
      report += `\n`;
    }

    if (r.error) {
      report += `**Error:** ${r.error}\n\n`;
    }

    if (r.screenshot) {
      report += `**Screenshot:** \`screenshots/${r.screenshot}\`\n\n`;
      report += `![Screenshot](screenshots/${r.screenshot})\n\n`;
    }

    if (r.bodyPreview) {
      report += `**Page Content Preview:**\n\n\`\`\`\n${r.bodyPreview}\n\`\`\`\n\n`;
    }

    report += `---\n\n`;
  });

  report += `## Recommendations\n\n`;

  const hasErrors = results.some(r => r.error);
  const has404s = results.some(r => r.appears404);
  const hasRedirects = results.some(r => r.redirectChain.length > 0);

  if (!hasErrors && !has404s) {
    report += `✅ All routes are working correctly.\n\n`;
  }

  if (has404s) {
    report += `⚠️ **404 Errors Detected:**\n`;
    results.filter(r => r.appears404).forEach(r => {
      report += `- ${r.initialUrl} appears to show 404 error\n`;
    });
    report += `\nCheck Next.js routing configuration and page files.\n\n`;
  }

  if (hasRedirects) {
    report += `🔄 **Redirects Detected:**\n`;
    results.filter(r => r.redirectChain.length > 0).forEach(r => {
      report += `- ${r.initialUrl} → ${r.finalUrl}\n`;
    });
    report += `\nReview middleware.ts and authentication flow.\n\n`;
  }

  if (hasErrors) {
    report += `❌ **Errors Encountered:**\n`;
    results.filter(r => r.error).forEach(r => {
      report += `- ${r.initialUrl}: ${r.error}\n`;
    });
    report += `\nCheck server logs and ensure dev server is running.\n\n`;
  }

  return report;
}

// Run validation
main().catch(console.error);
