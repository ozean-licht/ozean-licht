# Storybook AI Iteration MVP (Vite Plugin)

## Quick Start

1. Add your Anthropic API key to `.env`:
   ```bash
   cp storybook/ai-mvp/.env.example .env
   # Edit .env and add: ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Start Storybook:
   ```bash
   pnpm storybook
   ```

3. Open Storybook (http://localhost:6006)

4. View any component story

5. Press the floating ✨ button or `Cmd+K` (Mac) / `Ctrl+K` (Windows)

6. Type what you want to change (e.g., "Make this button 30% larger with glass morphism")

7. Click "✨ Iterate"

8. Watch your component update live via HMR!

## How It Works

**Single Process Architecture:**
- Vite plugin adds `/__ai-iterate` endpoint to Storybook dev server
- No separate API server needed
- No CORS issues (same origin)
- Direct filesystem access
- Automatic HMR integration

**Flow:**
1. User presses Cmd+K → Modal opens
2. User types prompt → Sent to `/__ai-iterate`
3. Vite plugin calls Claude with design system context
4. Claude returns updated component code
5. Plugin writes to component file
6. Vite HMR detects change and reloads
7. Component updates in Storybook preview

## Advantages Over Separate API Server

✅ **Single Coolify Service** - One deployment instead of two
✅ **No CORS Configuration** - Same origin, no cross-origin issues
✅ **No Port Management** - Uses existing Storybook port (6006)
✅ **Better Performance** - No HTTP network overhead
✅ **Simpler Development** - Just run `pnpm storybook`
✅ **Native File Access** - Plugin has direct filesystem access
✅ **Automatic HMR** - Vite handles reload automatically

## Limitations (MVP)

- No validation or safety checks (trusts Claude)
- No git integration (user handles version control)
- Basic component path detection
- No undo/redo
- No conversation history
- No TypeScript validation

## Next Steps

After MVP validation, see `/specs/storybook-ai-iteration-system.md` for full production features:
- Git safety (automatic stash/restore)
- TypeScript validation
- Design system compliance checking
- Multi-turn conversations
- Undo/redo stack
- Comprehensive error handling
