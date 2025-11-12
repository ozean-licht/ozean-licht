# ADW Modules - DEPRECATED

**Status:** This Python module has been fully migrated to TypeScript and is no longer maintained.

## Migration Complete

All Python functionality from `adw_modules/` has been migrated to TypeScript and is now located in:

```
apps/orchestrator_ts/src/modules/adw/
```

## Python Archive

The original Python code has been archived in:

```
adws/archive/python-adw-modules-20251112/
```

## TypeScript Module Mapping

| Python Module | TypeScript Equivalent | Location |
|--------------|----------------------|----------|
| `agent.py` | `agent-executor.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `state.py` | `state-manager.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `worktree_ops.py` | `worktree-manager.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `git_ops.py` | `git-operations.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `github.py` | `github-integration.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `workflow_ops.py` | `workflow-manager.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `mcp_integration.py` | MCP Gateway Service | `tools/mcp-gateway/` |
| `orchestrator_integration.py` | Orchestrator modules | `apps/orchestrator_ts/src/modules/orchestrator/` |
| `r2_uploader.py` | `r2-uploader.ts` | `apps/orchestrator_ts/src/modules/storage/` |
| `data_types.py` | `types.ts` | `apps/orchestrator_ts/src/modules/adw/` |
| `utils.py` | `utils.ts` | `apps/orchestrator_ts/src/modules/adw/` |

## Error Handling & Resilience

The TypeScript implementation includes enhanced features not present in Python:

- **Error Handler** (`error-handler.ts`) - Advanced error categorization and recovery
- **Retry Strategy** (`retry-strategy.ts`) - Exponential backoff with jitter
- **Circuit Breaker** (`circuit-breaker.ts`) - Failure detection and recovery
- **Error Notifier** (`error-notifier.ts`) - Multi-channel notifications

## Workflow Orchestrators

All workflow orchestrators have been migrated:

- `workflows/plan-phase.ts`
- `workflows/build-phase.ts`
- `workflows/test-phase.ts`
- `workflows/review-phase.ts`
- `workflows/document-phase.ts`
- `workflows/ship-phase.ts`
- `workflows/orchestrators/` (plan-build, sdlc, zte, etc.)

## For Developers

If you need to reference the old Python implementation:

1. Check the archive directory: `adws/archive/python-adw-modules-20251112/`
2. Refer to the TypeScript implementation in `apps/orchestrator_ts/`
3. See migration documentation in `specs/typescript-migration/`

## Migration Date

- **Completed:** November 12, 2025
- **Milestone:** Phase 1 - Convert adw_modules to TypeScript
- **Next Phase:** Migrate Python workflow entry points in `/adws/*.py`

---

**Note:** This directory is kept for backwards compatibility with any remaining Python entry point scripts in `/adws/` that may still import from `adw_modules`. Once all workflow entry points are migrated to TypeScript API endpoints, this directory will be removed entirely.
