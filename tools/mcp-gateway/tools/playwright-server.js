#!/usr/bin/env node

/**
 * Playwright MCP Server
 *
 * Provides browser automation capabilities via MCP protocol
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');
const { chromium } = require('playwright');

let browser = null;
let page = null;

// Create MCP server
const server = new Server({
  name: 'playwright-mcp',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'navigate',
      description: 'Navigate to a URL',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to navigate to' }
        },
        required: ['url']
      }
    },
    {
      name: 'screenshot',
      description: 'Take a screenshot of the current page',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to save screenshot' },
          fullPage: { type: 'boolean', description: 'Capture full page', default: false }
        },
        required: ['path']
      }
    },
    {
      name: 'click',
      description: 'Click an element on the page',
      inputSchema: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector for element to click' }
        },
        required: ['selector']
      }
    },
    {
      name: 'fill',
      description: 'Fill an input field',
      inputSchema: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector for input element' },
          text: { type: 'string', description: 'Text to fill' }
        },
        required: ['selector', 'text']
      }
    },
    {
      name: 'get_content',
      description: 'Get text content from an element',
      inputSchema: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector for element' }
        },
        required: ['selector']
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Initialize browser if not already running
    if (!browser) {
      browser = await chromium.launch({ headless: true });
      page = await browser.newPage();
    }

    switch (name) {
      case 'navigate':
        await page.goto(args.url);
        return {
          content: [
            {
              type: 'text',
              text: `Navigated to ${args.url}`
            }
          ]
        };

      case 'screenshot':
        await page.screenshot({
          path: args.path,
          fullPage: args.fullPage || false
        });
        return {
          content: [
            {
              type: 'text',
              text: `Screenshot saved to ${args.path}`
            }
          ]
        };

      case 'click':
        await page.click(args.selector);
        return {
          content: [
            {
              type: 'text',
              text: `Clicked element: ${args.selector}`
            }
          ]
        };

      case 'fill':
        await page.fill(args.selector, args.text);
        return {
          content: [
            {
              type: 'text',
              text: `Filled ${args.selector} with text`
            }
          ]
        };

      case 'get_content':
        const content = await page.textContent(args.selector);
        return {
          content: [
            {
              type: 'text',
              text: content || ''
            }
          ]
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Cleanup on exit
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Playwright MCP Server running on stdio');
}

main().catch(console.error);
