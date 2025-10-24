# Conditional Documentation Guide

This prompt helps you determine what documentation you should read based on the specific changes you need to make in the codebase. Review the conditions below and read the relevant documentation before proceeding with your task.

## Instructions
- Review the task you've been asked to perform
- Check each documentation path in the Conditional Documentation section
- For each path, evaluate if any of the listed conditions apply to your task
  - IMPORTANT: Only read the documentation if any one of the conditions match your task
- IMPORTANT: You don't want to excessively read documentation. Only read the documentation if it's relevant to your task.

## Conditional Documentation

- README.md
  - Conditions:
    - When operating on anything under app/server
    - When operating on anything under app/client
    - When first understanding the project structure
    - When you want to learn the commands to start or stop the server or client

- app/client/src/style.css
  - Conditions:
    - When you need to make changes to the client's style

- .claude/commands/classify_adw.md
  - Conditions:
    - When adding or removing new `adws/adw_*.py` files

- adws/README.md
  - Conditions:
    - When you're operating in the `adws/` directory

- app_docs/feature-490eb6b5-one-click-table-exports.md
  - Conditions:
    - When working with CSV export functionality
    - When implementing table or query result export features
    - When troubleshooting download button functionality
    - When working with pandas-based data export utilities

- app_docs/feature-4c768184-model-upgrades.md
  - Conditions:
    - When working with LLM model configurations
    - When updating OpenAI or Anthropic model versions
    - When troubleshooting SQL query generation accuracy
    - When working with the llm_processor module

- app_docs/feature-f055c4f8-off-white-background.md
  - Conditions:
    - When working with application background styling
    - When modifying CSS color variables or themes
    - When implementing visual design changes to the client application

- app_docs/feature-6445fc8f-light-sky-blue-background.md
  - Conditions:
    - When working with light sky blue background styling
    - When implementing background color changes to light blue variants
    - When troubleshooting visual hierarchy with light blue backgrounds

- app_docs/feature-cc73faf1-upload-button-text.md
  - Conditions:
    - When working with upload button text or labeling
    - When implementing UI text changes for data upload functionality
    - When troubleshooting upload button display or terminology

- projects/admin/app_docs/features/admin-db-schema-mcp-client.md
  - Conditions:
    - When working with admin dashboard database operations
    - When implementing MCP Gateway client functionality
    - When creating or modifying admin users, roles, or permissions
    - When implementing audit logging for admin actions
    - When working with admin session management
    - When troubleshooting MCP Gateway connectivity issues
    - When adding new database operations to the admin system

- projects/admin/app_docs/features/nextauth-admin-authentication.md
  - Conditions:
    - When working with admin dashboard authentication
    - When implementing NextAuth.js authentication flows
    - When modifying login, logout, or session management
    - When troubleshooting authentication or authorization issues
    - When adding route protection or middleware
    - When implementing password hashing or verification
    - When working with admin user sessions or JWT tokens
    - When setting up 2FA or additional authentication factors
    - When debugging authentication-related audit logs

- projects/admin/app_docs/features/nextauth-core-libraries.md
  - Conditions:
    - When implementing authentication utility functions
    - When working with password hashing (bcrypt) or token generation
    - When creating custom NextAuth adapters for database integration
    - When writing unit tests for authentication utilities
    - When configuring authentication constants (session TTL, bcrypt rounds)
    - When implementing audit logging for authentication events
    - When troubleshooting NextAuth configuration or adapter issues
    - When integrating authentication with MCP Gateway client

- projects/admin/app_docs/features/shadcn-component-migration.md
  - Conditions:
    - When working with ShadCN UI components in the admin dashboard
    - When implementing new forms, buttons, cards, or other UI elements
    - When adding new ShadCN components to the project
    - When styling components using CSS variables
    - When troubleshooting ShadCN component styling or behavior
    - When implementing form validation with react-hook-form and zod
    - When working with alerts, badges, avatars, or other ShadCN primitives
    - When refactoring custom HTML/CSS to use design system components