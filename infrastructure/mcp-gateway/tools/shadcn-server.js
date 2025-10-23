#!/usr/bin/env node

/**
 * ShadCN UI MCP Server
 *
 * Provides ShadCN UI component management via MCP protocol
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');
const { execSync } = require('child_process');
const path = require('path');

// Create MCP server
const server = new Server({
  name: 'shadcn-mcp',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Available ShadCN components
const COMPONENTS = [
  'accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'avatar',
  'badge', 'button', 'calendar', 'card', 'checkbox',
  'collapsible', 'command', 'context-menu', 'dialog', 'dropdown-menu',
  'form', 'hover-card', 'input', 'label', 'menubar',
  'navigation-menu', 'popover', 'progress', 'radio-group', 'scroll-area',
  'select', 'separator', 'sheet', 'skeleton', 'slider',
  'switch', 'table', 'tabs', 'textarea', 'toast',
  'toggle', 'tooltip'
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_components',
      description: 'List all available ShadCN UI components',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'add_component',
      description: 'Add a ShadCN UI component to the project',
      inputSchema: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            description: 'Component name to add',
            enum: COMPONENTS
          },
          projectPath: {
            type: 'string',
            description: 'Path to the project (defaults to current directory)'
          }
        },
        required: ['component']
      }
    },
    {
      name: 'init',
      description: 'Initialize ShadCN UI in a project',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the project'
          }
        }
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components':
        return {
          content: [
            {
              type: 'text',
              text: `Available ShadCN UI components:\n\n${COMPONENTS.join(', ')}\n\nTotal: ${COMPONENTS.length} components`
            }
          ]
        };

      case 'add_component':
        const projectPath = args.projectPath || process.cwd();
        const component = args.component;

        if (!COMPONENTS.includes(component)) {
          throw new Error(`Unknown component: ${component}. Use list_components to see available components.`);
        }

        // Note: This is a mock implementation
        // Real implementation would use: npx shadcn-ui@latest add <component>
        return {
          content: [
            {
              type: 'text',
              text: `📦 Adding ShadCN component: ${component}\n\nTo actually add this component, run:\nnpx shadcn-ui@latest add ${component}\n\nThis will:\n- Add component files to components/ui/${component}.tsx\n- Update your dependencies if needed\n- Add necessary utilities`
            }
          ]
        };

      case 'init':
        const initPath = args.projectPath || process.cwd();
        return {
          content: [
            {
              type: 'text',
              text: `🎨 Initializing ShadCN UI\n\nTo initialize ShadCN UI in your project, run:\nnpx shadcn-ui@latest init\n\nThis will:\n- Set up your components.json\n- Install dependencies\n- Configure your project for ShadCN UI\n\nProject path: ${initPath}`
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

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ShadCN MCP Server running on stdio');
}

main().catch(console.error);
