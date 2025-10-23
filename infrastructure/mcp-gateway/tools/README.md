# Local MCP Servers

This directory contains local Model Context Protocol (MCP) servers for browser automation and UI component management.

## =æ Installed Servers

### 1. Playwright MCP (`playwright-server.js`)
Browser automation and testing capabilities.

**Capabilities:**
- `navigate` - Navigate to a URL
- `screenshot` - Take screenshots (full page or viewport)
- `click` - Click elements by selector
- `fill` - Fill input fields
- `get_content` - Extract text content from elements

**Usage Example:**
```json
{
  "tool": "navigate",
  "arguments": {
    "url": "https://example.com"
  }
}
```

### 2. ShadCN UI MCP (`shadcn-server.js`)
UI component library management.

**Capabilities:**
- `list_components` - List all 37 available ShadCN components
- `add_component` - Add a component to your project
- `init` - Initialize ShadCN UI in a project

**Available Components:**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, button, calendar, card, checkbox, collapsible, command, context-menu, dialog, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toast, toggle, tooltip

**Usage Example:**
```json
{
  "tool": "list_components",
  "arguments": {}
}
```

### 3. MagicUI MCP (`magicui-server.js`)
Animated and interactive UI components.

**Capabilities:**
- `list_components` - List all 40 MagicUI components (filterable by category)
- `add_component` - Add an animated component
- `get_component_docs` - Get documentation for a specific component

**Categories:**
- **Animation:** animated-card, blur-fade, fade-text, typing-animation, etc.
- **Background:** aurora-background, particles, meteors, retro-grid, etc.
- **Interactive:** confetti, cool-mode, magic-card, shimmer-button, etc.
- **Text:** number-ticker, scroll-progress, marquee

**Usage Example:**
```json
{
  "tool": "list_components",
  "arguments": {
    "category": "animation"
  }
}
```

## =€ Testing the Servers

You can test each server directly using stdio:

```bash
# Test Playwright MCP
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node playwright-server.js

# Test ShadCN MCP
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node shadcn-server.js

# Test MagicUI MCP
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node magicui-server.js
```

## ™ Configuration for Claude Code

To use these MCPs with Claude Code, configure them in your Claude settings:

**Location:** `.claude/mcp.json` or Claude Code settings

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["/opt/ozean-licht-ecosystem/infrastructure/mcp-gateway/tools/playwright-server.js"]
    },
    "shadcn": {
      "command": "node",
      "args": ["/opt/ozean-licht-ecosystem/infrastructure/mcp-gateway/tools/shadcn-server.js"]
    },
    "magicui": {
      "command": "node",
      "args": ["/opt/ozean-licht-ecosystem/infrastructure/mcp-gateway/tools/magicui-server.js"]
    }
  }
}
```

## =Ë Slash Commands

Management slash commands are available:

- `/mcp-playwright start` - Start Playwright MCP server
- `/mcp-shadcn start` - Start ShadCN MCP server
- `/mcp-magicui start` - Start MagicUI MCP server

These commands help manage the server processes, but for direct integration with Claude Code, configure the servers in Claude's settings as shown above.

## >ê Test Results

 **All 3 servers tested and operational** (2025-10-23)

- Playwright: 5 tools (navigate, screenshot, click, fill, get_content)
- ShadCN: 3 tools, 37 components
- MagicUI: 3 tools, 40 components

## =æ Dependencies

- `@modelcontextprotocol/sdk@^1.20.1` - MCP protocol implementation
- `playwright@^1.48.2` - Browser automation
- `@shadcn/ui@latest` - ShadCN UI components

Install all dependencies:
```bash
npm install
```

## =' Development

All servers use the MCP SDK and communicate via stdio. They implement the standard MCP protocol with:

- `tools/list` - List available tools
- `tools/call` - Execute a tool

Each server runs independently and can be tested, debugged, or extended individually.

## =Ý Notes

- Servers output to stderr for logging, stdout for MCP protocol
- Playwright server initializes browser on first use (lazy loading)
- ShadCN and MagicUI servers provide informational tools (don't execute npm commands directly)
- All servers support graceful shutdown on SIGINT

---

**Last Updated:** 2025-10-23
**Version:** 1.0.0
**Location:** `/opt/ozean-licht-ecosystem/infrastructure/mcp-gateway/tools`
