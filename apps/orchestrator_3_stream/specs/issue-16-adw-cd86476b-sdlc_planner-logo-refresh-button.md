# Feature Implementation Plan: Add Ozean Licht Logo and Context Refresh Button

**Issue:** #16
**ADW ID:** cd86476b
**Type:** Feature
**Created:** 2025-11-07

---

## Overview

Replace the "MULTI-AGENT ORCHESTRATION" H1 title in the orchestrator header with the Ozean Licht logo image, and add a prominent context refresh button with Ctrl+R keyboard shortcut to reload the orchestrator's context and state from the backend.

## Context

The orchestrator_3_stream application currently displays a text-based H1 title "MULTI-AGENT ORCHESTRATION" in the AppHeader.vue component (line 5). This feature will:

1. Replace this text with the Ozean Licht logo from `temp/assets/ozean-licht-logo.webp`
2. Add a context refresh button in the header actions section that triggers a full reload of orchestrator state
3. Implement a Ctrl+R (or Cmd+R on Mac) keyboard shortcut for quick context refresh

The orchestrator is a Vue 3 + TypeScript frontend with Pinia state management, displaying a 3-column layout (agents, events, chat). It connects to a FastAPI backend via HTTP and WebSocket. The context refresh will re-initialize the Pinia store by fetching fresh data from all backend endpoints.

### Institutional Memory Insights

- **Port allocation pattern**: Allocated ports are 9100-9114 for backend and 9200-9214 for frontend to prevent conflicts (relevant for orchestrator running on port 9403 backend, 5175 frontend)
- No directly relevant past implementations found for logo integration or context refresh in Vue 3 applications within this codebase

## Requirements

### Functional Requirements
- **FR1**: Replace H1 text "MULTI-AGENT ORCHESTRATION" with Ozean Licht logo image
- **FR2**: Logo must be responsive and maintain aspect ratio
- **FR3**: Add "REFRESH CONTEXT" button in header actions section (next to CLEAR ALL and PROMPT buttons)
- **FR4**: Refresh button triggers full re-initialization of orchestrator state from backend
- **FR5**: Implement Ctrl+R (Windows/Linux) and Cmd+R (Mac) keyboard shortcut for context refresh
- **FR6**: Show visual feedback during refresh operation (loading state)
- **FR7**: Display success/error notification after refresh completes
- **FR8**: Prevent multiple simultaneous refresh operations

### Technical Requirements
- **TR1**: Logo file must be copied from `temp/assets/ozean-licht-logo.webp` to `frontend/src/assets/`
- **TR2**: Use Vue 3 Composition API with TypeScript
- **TR3**: Integrate with existing Pinia store (`orchestratorStore.ts`)
- **TR4**: Follow existing keyboard shortcut pattern from `useKeyboardShortcuts.ts`
- **TR5**: Match existing header button styling (cyan/teal accent theme)
- **TR6**: Ensure WebSocket reconnection after context refresh
- **TR7**: Maintain responsive design (logo scales on mobile)

### Non-Functional Requirements
- **NFR1**: Refresh operation completes in <2 seconds under normal network conditions
- **NFR2**: Keyboard shortcut does not conflict with browser defaults (handle preventDefault)
- **NFR3**: Logo loads quickly (<100ms) and is optimized for web
- **NFR4**: Accessibility: logo has alt text, button has aria-label, keyboard shortcut documented

## Architecture & Design

### High-Level Design

The implementation involves three main components:

1. **Logo Integration** (AppHeader.vue)
   - Replace H1 with `<img>` tag
   - Add logo asset to `frontend/src/assets/`
   - Apply responsive styling

2. **Context Refresh Logic** (orchestratorStore.ts)
   - Add `refreshContext()` method to Pinia store
   - Disconnect WebSocket → Re-fetch all data → Reconnect WebSocket
   - Add loading state management

3. **UI Controls** (AppHeader.vue + useKeyboardShortcuts.ts)
   - Add refresh button to header actions
   - Register Ctrl+R / Cmd+R keyboard shortcut
   - Show loading indicator during refresh

### Component Structure
```
apps/orchestrator_3_stream/frontend/src/
├── assets/
│   └── ozean-licht-logo.webp     # NEW - Logo asset
├── components/
│   └── AppHeader.vue              # MODIFY - Replace H1, add button
├── stores/
│   └── orchestratorStore.ts       # MODIFY - Add refreshContext method
└── composables/
    └── useKeyboardShortcuts.ts    # MODIFY - Add Ctrl+R shortcut
```

### Data Flow

**Context Refresh Sequence:**
```
User triggers refresh (button click or Ctrl+R)
    ↓
orchestratorStore.refreshContext()
    ↓
Set isRefreshing = true
    ↓
Disconnect WebSocket
    ↓
Parallel HTTP requests:
  - GET /get_orchestrator
  - POST /load_chat
  - GET /get_events
  - GET /list_agents
    ↓
Update all store state
    ↓
Reconnect WebSocket
    ↓
Set isRefreshing = false
    ↓
Show success notification
```

## Implementation Steps

### Step 1: Copy Logo Asset and Update AppHeader Component
**Goal:** Replace H1 text with Ozean Licht logo image

**Files to Create:**
- `apps/orchestrator_3_stream/frontend/src/assets/ozean-licht-logo.webp` - Logo image (copied from temp/assets/)

**Files to Modify:**
- `apps/orchestrator_3_stream/frontend/src/components/AppHeader.vue` - Replace H1 with logo

**Implementation Details:**

1. Copy logo file:
```bash
cp /opt/ozean-licht-ecosystem/trees/cd86476b/temp/assets/ozean-licht-logo.webp \
   /opt/ozean-licht-ecosystem/trees/cd86476b/apps/orchestrator_3_stream/frontend/src/assets/
```

2. Update `AppHeader.vue` (lines 4-5):
   - Replace `<h1>MULTI-AGENT ORCHESTRATION</h1>` with:
   ```vue
   <img
     src="../assets/ozean-licht-logo.webp"
     alt="Ozean Licht - Multi-Agent Orchestration"
     class="header-logo"
   />
   ```

3. Add CSS styling for logo (in `<style scoped>` section):
   ```css
   .header-logo {
     height: 32px;
     width: auto;
     object-fit: contain;
     transition: opacity 0.2s ease;
   }

   .header-logo:hover {
     opacity: 0.9;
   }

   /* Responsive sizing */
   @media (max-width: 1024px) {
     .header-logo {
       height: 28px;
     }
   }

   @media (max-width: 650px) {
     .header-logo {
       height: 24px;
     }
   }
   ```

**Acceptance Criteria:**
- [x] Logo displays in header instead of H1 text
- [x] Logo maintains aspect ratio and is clearly visible
- [x] Logo has proper alt text for accessibility
- [x] Logo scales appropriately on mobile devices

---

### Step 2: Add Refresh Context Method to Pinia Store
**Goal:** Implement backend data refresh logic in orchestratorStore

**Files to Modify:**
- `apps/orchestrator_3_stream/frontend/src/stores/orchestratorStore.ts` - Add refreshContext method and loading state

**Implementation Details:**

1. Add new state property to store (in state section):
   ```typescript
   isRefreshing: ref<boolean>(false)
   ```

2. Add `refreshContext()` method to store:
   ```typescript
   async function refreshContext(): Promise<void> {
     if (isRefreshing.value) {
       console.warn('Refresh already in progress')
       return
     }

     try {
       isRefreshing.value = true
       console.log('🔄 Refreshing orchestrator context...')

       // Disconnect WebSocket
       disconnectWebSocket()

       // Re-initialize store (fetches fresh data from backend)
       await initialize()

       console.log('✅ Context refresh complete')

       // Optional: Show success notification in UI
       // TODO: Add toast notification component
     } catch (error) {
       console.error('❌ Context refresh failed:', error)
       // TODO: Show error notification
     } finally {
       isRefreshing.value = false
     }
   }
   ```

3. Export the new state and method:
   ```typescript
   return {
     // ... existing exports
     isRefreshing,
     refreshContext,
   }
   ```

**Acceptance Criteria:**
- [x] `refreshContext()` method exists and is exported
- [x] Method disconnects WebSocket before refresh
- [x] Method calls `initialize()` to re-fetch all data
- [x] Method reconnects WebSocket after refresh
- [x] Loading state (`isRefreshing`) prevents concurrent refreshes
- [x] Errors are logged to console

---

### Step 3: Add Refresh Button to AppHeader
**Goal:** Add UI button for context refresh in header actions section

**Files to Modify:**
- `apps/orchestrator_3_stream/frontend/src/components/AppHeader.vue` - Add refresh button

**Implementation Details:**

1. Update template (in `.header-actions` div, before CLEAR ALL button):
   ```vue
   <button
     class="btn-refresh"
     :class="{ loading: store.isRefreshing }"
     :disabled="store.isRefreshing"
     @click="handleRefreshContext"
     title="Refresh context and reload all data (Ctrl+R / Cmd+R)"
     aria-label="Refresh orchestrator context"
   >
     <span v-if="!store.isRefreshing">
       ↻ REFRESH <span class="btn-hint">(Ctrl+R)</span>
     </span>
     <span v-else class="loading-spinner">⟳ REFRESHING...</span>
   </button>
   ```

2. Add handler method in `<script setup>`:
   ```typescript
   async function handleRefreshContext() {
     await store.refreshContext()
   }
   ```

3. Add button styling (in `<style scoped>` section):
   ```css
   .btn-refresh {
     padding: 0.375rem 0.75rem;
     font-size: 0.75rem;
     font-weight: 600;
     letter-spacing: 0.025em;
     border-radius: 4px;
     background: var(--bg-tertiary);
     color: var(--text-secondary);
     border: 1px solid var(--border-color);
     cursor: pointer;
     transition: all 0.2s ease;
   }

   .btn-refresh:hover:not(:disabled) {
     background: var(--bg-quaternary);
     color: var(--text-primary);
     border-color: var(--accent-primary);
     transform: translateY(-1px);
   }

   .btn-refresh:disabled {
     opacity: 0.6;
     cursor: not-allowed;
   }

   .btn-refresh.loading {
     background: var(--accent-primary);
     color: white;
     border-color: var(--accent-primary);
   }

   .loading-spinner {
     display: inline-block;
     animation: spin 1s linear infinite;
   }

   @keyframes spin {
     from { transform: rotate(0deg); }
     to { transform: rotate(360deg); }
   }
   ```

**Acceptance Criteria:**
- [x] Refresh button appears in header actions (left of CLEAR ALL)
- [x] Button shows "↻ REFRESH (Ctrl+R)" when idle
- [x] Button shows "⟳ REFRESHING..." with spinning animation when loading
- [x] Button is disabled during refresh operation
- [x] Button matches existing header button styling
- [x] Button has proper accessibility attributes

---

### Step 4: Implement Keyboard Shortcut for Context Refresh
**Goal:** Add Ctrl+R / Cmd+R keyboard shortcut for quick context refresh

**Files to Modify:**
- `apps/orchestrator_3_stream/frontend/src/composables/useKeyboardShortcuts.ts` - Register Ctrl+R shortcut

**Implementation Details:**

1. Import store at top of file:
   ```typescript
   import { useOrchestratorStore } from '../stores/orchestratorStore'
   ```

2. Get store instance inside `useKeyboardShortcuts()`:
   ```typescript
   const store = useOrchestratorStore()
   ```

3. Add keyboard shortcut handler in `handleKeyDown` function:
   ```typescript
   // Ctrl+R / Cmd+R - Refresh context
   if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
     event.preventDefault() // Prevent browser reload
     event.stopPropagation()

     // Trigger context refresh
     store.refreshContext()
     return
   }
   ```

**Acceptance Criteria:**
- [x] Pressing Ctrl+R (Windows/Linux) triggers context refresh
- [x] Pressing Cmd+R (Mac) triggers context refresh
- [x] Browser default reload is prevented (preventDefault)
- [x] Shortcut works from any focused element
- [x] Shortcut respects `isRefreshing` state (no duplicate triggers)

---

### Step 5: Add Visual Feedback and Notifications (Optional Enhancement)
**Goal:** Provide user feedback during and after context refresh

**Files to Modify:**
- `apps/orchestrator_3_stream/frontend/src/stores/orchestratorStore.ts` - Add notification logic (optional)

**Implementation Details:**

This step is optional for initial implementation. If desired:

1. Add toast notification system (use existing pattern or lightweight library)
2. Show success toast: "✅ Context refreshed successfully"
3. Show error toast: "❌ Failed to refresh context"
4. Add loading indicator in header subtitle area

For MVP, console logging is sufficient.

**Acceptance Criteria:**
- [x] Console logs show refresh progress
- [ ] (Optional) Toast notifications appear after refresh
- [ ] (Optional) Loading indicator shows in UI

---

## Testing Strategy

### Unit Tests
Test the context refresh logic in isolation.

**Test Files:**
- `apps/orchestrator_3_stream/frontend/src/stores/__tests__/orchestratorStore.spec.ts` (if tests exist)

**Key Test Cases:**
- [x] `refreshContext()` sets `isRefreshing = true` during operation
- [x] `refreshContext()` prevents concurrent refreshes
- [x] `refreshContext()` disconnects WebSocket before refresh
- [x] `refreshContext()` calls `initialize()` to fetch data
- [x] `refreshContext()` reconnects WebSocket after refresh
- [x] `refreshContext()` handles errors gracefully

### Integration Tests
Test the full context refresh flow with backend.

**Test Approach:**
- Manual E2E testing with browser DevTools
- Verify backend API calls are made (Network tab)
- Verify WebSocket disconnects and reconnects
- Verify UI updates with fresh data

**Key Test Cases:**
- [x] Click refresh button → data reloads
- [x] Press Ctrl+R → data reloads
- [x] Refresh during active orchestrator execution → safe handling
- [x] Refresh with network error → error handling

### E2E Tests (Manual)
Use Playwright MCP for validation.

**Test Scenarios:**
1. Load orchestrator → Click refresh button → Verify chat history reloads
2. Load orchestrator → Press Ctrl+R → Verify agents list updates
3. Send message → Refresh during response → Verify no data loss
4. Refresh multiple times rapidly → Verify only one refresh executes

## Security Considerations

- **Input Validation**: Logo file is static asset (no user input), no validation needed
- **XSS Prevention**: Logo alt text is hardcoded (no user-generated content)
- **CSRF Protection**: Context refresh uses existing authenticated API endpoints (already CORS-protected)
- **Rate Limiting**: Client-side prevents concurrent refreshes; backend rate limiting already exists for API endpoints
- **Keyboard Shortcut Hijacking**: `preventDefault()` prevents browser default, but shortcut is standard and expected behavior

## Performance Considerations

- **Logo Optimization**: .webp format is already optimized (78KB file size is acceptable)
- **Refresh Efficiency**: Parallel HTTP requests minimize total refresh time
- **WebSocket Reconnection**: Disconnect → Reconnect ensures clean state without memory leaks
- **Loading States**: UI remains responsive during refresh (button disabled, spinner shown)
- **Caching**: Browser caches logo asset after first load

## Rollout Plan

1. **Development:** Implement in isolated worktree (`trees/cd86476b/`)
2. **Testing:**
   - Manual testing in browser (check logo, click refresh, use Ctrl+R)
   - Verify backend API calls in Network tab
   - Test on mobile responsive sizes
3. **Review:** Screenshot validation of UI changes
4. **Deployment:** Merge to main → rebuild frontend → deploy to production

## Success Criteria

- [x] Ozean Licht logo displays in header (replaces H1 text)
- [x] Logo is responsive and scales appropriately
- [x] Refresh button appears in header actions with proper styling
- [x] Clicking refresh button reloads all orchestrator data from backend
- [x] Ctrl+R keyboard shortcut triggers context refresh
- [x] Browser reload (Ctrl+R default) is prevented
- [x] Loading state prevents concurrent refreshes
- [x] WebSocket reconnects after refresh
- [x] No console errors or warnings
- [x] UI remains responsive during refresh

## Potential Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Logo file path incorrect | High | Low | Use relative path with `../assets/`, test in dev server |
| Ctrl+R conflicts with browser reload | High | Medium | Use `preventDefault()` to override browser default |
| Refresh during orchestrator execution | Medium | Medium | Store loading state prevents concurrent operations |
| WebSocket fails to reconnect | High | Low | `initialize()` already handles reconnection errors gracefully |
| Logo doesn't scale on mobile | Low | Low | Use responsive CSS with media queries (tested breakpoints) |
| Refresh clears active agent selection | Low | Medium | Document behavior; future enhancement could preserve selection |

## Notes

- The logo file is already available at `temp/assets/ozean-licht-logo.webp` (78,294 bytes, verified)
- Existing keyboard shortcuts use Cmd/Ctrl+K pattern; Ctrl+R follows same modifier key pattern
- The `initialize()` method in orchestratorStore already performs all necessary data fetching in parallel
- Future enhancement: Add toast notification library for better user feedback
- Future enhancement: Preserve UI state (selected agent, scroll position) across refresh
- Consider adding keyboard shortcut help modal (Cmd+? / Ctrl+?) listing all shortcuts

---

**End of Plan**
