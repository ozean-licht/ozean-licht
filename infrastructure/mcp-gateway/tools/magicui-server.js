#!/usr/bin/env node

/**
 * MagicUI MCP Server
 *
 * Provides MagicUI component management via MCP protocol
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

// Create MCP server
const server = new Server({
  name: 'magicui-mcp',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Available MagicUI components
const COMPONENTS = [
  'animated-card', 'animated-gradient', 'aurora-background', 'bento-grid',
  'blur-fade', 'blur-in', 'border-beam', 'box-reveal',
  'confetti', 'cool-mode', 'dock', 'dot-pattern',
  'fade-text', 'file-tree', 'flickering-grid', 'globe',
  'grid-pattern', 'hero-video', 'hyper-text', 'icon-cloud',
  'interactive-hover', 'lamp', 'letter-pullup', 'magic-card',
  'marquee', 'meteors', 'neon-gradient', 'number-ticker',
  'orbit', 'particles', 'retro-grid', 'ripple',
  'safari', 'scroll-progress', 'shimmer-button', 'shine-border',
  'sparkles', 'text-reveal', 'typing-animation', 'word-fade'
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_components',
      description: 'List all available MagicUI components',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by category (animation, background, interactive, text)',
            enum: ['all', 'animation', 'background', 'interactive', 'text']
          }
        }
      }
    },
    {
      name: 'add_component',
      description: 'Add a MagicUI component to the project',
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
      name: 'get_component_docs',
      description: 'Get documentation for a specific component',
      inputSchema: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            description: 'Component name',
            enum: COMPONENTS
          }
        },
        required: ['component']
      }
    }
  ]
}));

// Helper to categorize components
function getComponentCategory(component) {
  const categories = {
    animation: ['animated-card', 'animated-gradient', 'blur-fade', 'blur-in', 'fade-text', 'hyper-text', 'letter-pullup', 'text-reveal', 'typing-animation', 'word-fade'],
    background: ['aurora-background', 'dot-pattern', 'flickering-grid', 'grid-pattern', 'meteors', 'particles', 'retro-grid', 'ripple'],
    interactive: ['bento-grid', 'box-reveal', 'confetti', 'cool-mode', 'dock', 'interactive-hover', 'magic-card', 'shimmer-button', 'shine-border', 'sparkles'],
    text: ['number-ticker', 'scroll-progress', 'marquee']
  };

  for (const [cat, comps] of Object.entries(categories)) {
    if (comps.includes(component)) return cat;
  }
  return 'other';
}

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components':
        const category = args?.category || 'all';
        let filteredComponents = COMPONENTS;

        if (category !== 'all') {
          filteredComponents = COMPONENTS.filter(c => getComponentCategory(c) === category);
        }

        const grouped = filteredComponents.reduce((acc, comp) => {
          const cat = getComponentCategory(comp);
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(comp);
          return acc;
        }, {});

        let output = `Available MagicUI components${category !== 'all' ? ` (${category})` : ''}:\n\n`;
        for (const [cat, comps] of Object.entries(grouped)) {
          output += `${cat.toUpperCase()}:\n`;
          output += comps.map(c => `  - ${c}`).join('\n');
          output += '\n\n';
        }
        output += `Total: ${filteredComponents.length} components`;

        return {
          content: [
            {
              type: 'text',
              text: output
            }
          ]
        };

      case 'add_component':
        const projectPath = args.projectPath || process.cwd();
        const component = args.component;

        if (!COMPONENTS.includes(component)) {
          throw new Error(`Unknown component: ${component}. Use list_components to see available components.`);
        }

        const category_name = getComponentCategory(component);

        return {
          content: [
            {
              type: 'text',
              text: `✨ Adding MagicUI component: ${component}\nCategory: ${category_name}\n\nTo actually add this component, run:\nnpx magicui-cli add ${component}\n\nOr visit: https://magicui.design/docs/components/${component}\n\nThis will:\n- Add component files to components/magicui/${component}.tsx\n- Update your dependencies if needed\n- Add necessary animations and effects`
            }
          ]
        };

      case 'get_component_docs':
        const comp = args.component;
        if (!COMPONENTS.includes(comp)) {
          throw new Error(`Unknown component: ${comp}`);
        }

        const cat = getComponentCategory(comp);
        return {
          content: [
            {
              type: 'text',
              text: `📚 ${comp}\n\nCategory: ${cat}\nDocumentation: https://magicui.design/docs/components/${comp}\n\nUsage:\nimport { ${comp.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')} } from '@/components/magicui/${comp}';\n\nFor full examples and props, visit the documentation link above.`
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
  console.error('MagicUI MCP Server running on stdio');
}

main().catch(console.error);
