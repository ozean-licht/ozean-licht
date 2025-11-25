# src

> src - add description

## Quick Nav

**Entry:** `server.ts` | **Config:** `config/` | **Types:** `types/`

## If You Need To...

| Task | Start Here | Flow |
|------|------------|------|
| Add feature | `src/` | Create module → Register in index → Add tests |
| Fix bug | logs/errors | Find error → Trace to source → Apply fix |
| Update config | `config/` | Modify values → Restart if needed |

## Structure

```
.
├── auth/            # Authentication
├── mcp/             # MCP service handlers [→](./mcp/)
├── monitoring/      # ...
├── router/          # ...
├── utils/           # Utility functions
└── server.ts        # Server entry point
```

## Key Files

| File | Purpose | Gravity |
|------|---------|---------|
| `server.ts` | Server entry point | ● |

## Needs Deeper Mapping

- [ ] `mcp/` — 12 files

---

*Mapped: 2025-11-25 | Files: 22*