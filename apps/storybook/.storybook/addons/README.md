# Storybook Addons

## Authentication Toolbar Addon

### Issue with Original Implementation

The original `auth-toolbar.tsx` had an architectural issue: it tried to use React hooks (`useSession`) directly in the manager context, but the `SessionProvider` only exists in the preview context (different iframe).

**Error:** `useSession` would fail because there's no SessionProvider in the manager iframe.

### Corrected Implementation

**Files:**
- `auth-toolbar-fixed.tsx` - Manager addon that uses channel API (no React hooks)
- `../decorators/auth-channel-bridge.tsx` - Preview decorator that bridges auth state via channels

**How It Works:**
1. `SessionProvider` wraps all stories in preview context (has actual auth state)
2. `AuthChannelBridge` decorator listens to auth state changes and emits to channel
3. `auth-toolbar-fixed` addon in manager listens to channel and displays UI
4. User clicks login/logout → channel event → bridge handles it in preview context

**To Use:**
```typescript
// In .storybook/manager.ts
import './addons/auth-toolbar-fixed';  // Use -fixed version

// In .storybook/preview.ts
import { withAuthChannelBridge } from './decorators/auth-channel-bridge';

decorators: [
  withAuthChannelBridge,  // Add this decorator
  // ... other decorators
]
```

### Migration Steps

1. Update `manager.ts` to import `auth-toolbar-fixed` instead of `auth-toolbar`
2. Update `preview.ts` to add `withAuthChannelBridge` decorator after `SessionProvider`
3. Test login/logout flow to verify channel communication works

### Key Learnings

- **Manager vs Preview Context**: Manager and preview run in separate iframes
- **Channel API**: Use `addons.getChannel()` to communicate between contexts
- **React Hooks**: Only work in preview context where components are rendered
- **Storybook Architecture**: Manager = UI chrome, Preview = story rendering
