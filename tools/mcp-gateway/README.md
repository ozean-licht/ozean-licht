# mcp-gateway

> MCP Gateway for autonomous agent tooling

## Quick Nav

**Entry:** `ecosystem.config.js` | **Config:** `config/` | **Types:** `types/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add route | `src/routes/` | Create handler → Register in `index.ts` |
| Add middleware | `src/middleware/` | Create function → Add to chain in `server.ts` |
| Update config | `config/` | Modify schema → Update `.env.example` |

## Structure

```
.
├── src/             # Source code [→](./src/)
├── config/          # Configuration
├── docs/            # Documentation
├── logs/            # ...
├── monitoring/      # ... [→](./monitoring/)
├── scripts/         # Build/utility scripts
├── tests/           # Test files [→](./tests/)
├── tools/           # ...
├── ecosystem.config.js # Configuration and settings
├── jest.config.js   # Configuration and settings
├── query-storybook-docs.js # Database queries
└── test-context7.js # React context
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `ecosystem.config.js` | Configuration and settings | ● |
| `jest.config.js` | Configuration and settings | ● |
| `query-storybook-docs.js` | Database queries | ● |
| `test-context7.js` | React context | ● |

## Needs Deeper Mapping

- [ ] `src/` — 22 files
- [ ] `monitoring/` — 3 levels deep
- [ ] `tests/` — 13 files

---

*Mapped: 2025-11-25 | Files: 45*