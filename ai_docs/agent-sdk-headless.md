# Claude Agent SDK - Headless Mode

The Claude Agent SDK is Anthropic's official toolkit for building custom AI agents. The SDK provides all the building blocks you need to build production-ready agents, drawing from the infrastructure powering Claude Code itself.

## Installation

Available for TypeScript via npm and Python, with options for Node.js, web, and data science applications.

### TypeScript Installation

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Python Installation

Available via pip for Python-based applications.

## Core Capabilities

### Context Management

The SDK handles automatic compaction and context optimization to prevent running out of context during agent operations. This ensures your agent can continue operating effectively even with complex tasks.

### Tool Ecosystem

Agents can access a rich set of capabilities:
- File operations (read, write, modify files)
- Code execution (run and test code)
- Web search (gather information from the internet)
- Extensibility through the Model Context Protocol (MCP)

### Fine-Grained Control

Developers have precise control over tool usage:
- Set `allowedTools` to specify which tools agents can use
- Set `disallowedTools` to restrict specific tools
- Configure permission strategies for security
- Customize system prompts for agent behavior

### Authentication Options

Supports multiple authentication methods:
- Standard API keys (default)
- Amazon Bedrock integration via environment variables
- Google Vertex AI through environment variables

## Advanced Features

### Subagents and Agent Skills

Extend agent capabilities through subagents and reusable agent skills for specialized tasks.

### Model Context Protocol (MCP) Integration

Connect agents to external services and data sources through the MCP integration.

### Slash Commands and Custom Plugins

Build customized interfaces and extend functionality with custom plugins.

### Memory Management

Utilize CLAUDE.md files and institutional memory for maintaining context across sessions.

## What You Can Build

The Agent SDK enables development of diverse agent types across multiple domains:

### Coding Agents

- SRE incident response automation
- Security vulnerability audits
- Automated code reviews
- Infrastructure troubleshooting

### Business Agents

- Legal document review and analysis
- Financial analysis and reporting
- Customer support automation
- Content creation and generation

## Documentation and Resources

### GitHub Repositories

- TypeScript SDK: Full source code and examples
- Python SDK: Python implementation and examples

### Guides and References

- Getting Started guide for quick onboarding
- Migration guide from the legacy Claude Code SDK
- Comprehensive changelog tracking all updates
- CLI reference for command-line operations
- MCP documentation for protocol integration
- Troubleshooting guide for common issues

## Important Branding Note

Partners integrating the Claude Agent SDK should use "Claude Agent" or "Claude" in menus and documentation. "Claude Code" refers specifically to Anthropic's official product line and should not be used for partner implementations.

## Key Features Summary

| Feature | Description |
|---------|-------------|
| **Context Management** | Automatic compaction and optimization |
| **Tool Ecosystem** | File ops, code execution, web search, MCP |
| **Permissions** | Fine-grained control over allowed/disallowed tools |
| **Authentication** | API keys, AWS Bedrock, Google Vertex AI |
| **Extensibility** | MCP integration, custom plugins, subagents |
| **Production Ready** | Error handling, session management, logging |

## Getting Started

1. Install the SDK via npm or pip
2. Set up authentication with your API key
3. Initialize an agent instance
4. Configure allowed tools and permissions
5. Build your custom agent application
6. Deploy to production with built-in error handling

For more detailed implementation examples and advanced features, refer to the official GitHub repositories and comprehensive documentation.
