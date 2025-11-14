# Plan: Storybook AI Iteration MVP (Vite Plugin Architecture)

## Task Description
Build the absolute simplest MVP for AI-powered component iteration in Storybook using a Vite plugin architecture. Users can click a floating button or press Cmd+K while viewing any component, type a prompt describing changes they want (e.g., "make this button bigger with glass effect"), and see the component update live via HMR. This approach eliminates the need for a separate API server, reduces deployment complexity, and perfectly fits the centralized Hetzner + Coolify infrastructure.

## Objective
Create a working proof-of-concept where:
1. User views component in Storybook
2. User presses floating button or Cmd+K
3. User types iteration prompt
4. AI modifies component file via Vite plugin
5. Changes appear instantly via HMR

**Key improvement over traditional API approach:** Single process, zero CORS issues, no port management, simpler Coolify deployment.

## Problem Statement
The original plan proposed a separate Express API server (port 3001) alongside Storybook (port 6006), creating unnecessary complexity:
- Two services to deploy in Coolify
- CORS configuration overhead
- Network latency between browser → API → filesystem
- State synchronization across processes
- Port management and security concerns
- Development friction (running multiple processes)

**For a centralized Hetzner server running Coolify, this is over-engineered.** We can leverage Vite's plugin system to handle AI iteration directly within the Storybook dev server.

## Solution Approach
Instead of building a separate Express server, we'll:
- Create a Vite plugin that adds a custom route handler (`/__ai-iterate`)
- Inject a floating button/modal via Storybook preview decorator
- Use the already-installed @anthropic-ai/sdk within the plugin
- Write directly to component files with native filesystem access
- Let Vite HMR automatically reload changes
- Deploy as a single Coolify service

**Benefits:**
- ✅ Single process architecture (one Coolify service)
- ✅ No CORS issues (same-origin requests)
- ✅ No additional ports to manage
- ✅ Direct filesystem access (no HTTP overhead)
- ✅ Automatic HMR integration
- ✅ Simpler development: just run `pnpm storybook`
- ✅ Better performance (no network stack)

## Relevant Files
Use these files to complete the task:

- `/opt/ozean-licht-ecosystem/storybook/config/main.ts` - Add Vite plugin registration here
- `/opt/ozean-licht-ecosystem/storybook/config/preview.ts` - Add floating button decorator here
- `/opt/ozean-licht-ecosystem/design-system.md` - Design system rules to inject into prompts
- `/opt/ozean-licht-ecosystem/package.json` - @anthropic-ai/sdk already installed

### New Files
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/vite-plugin.ts` - Vite plugin with AI iteration logic
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/client.ts` - Client-side button/modal logic
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/types.ts` - Shared TypeScript types
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/.env.example` - API key configuration
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/README.md` - Quick start guide

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Create MVP Directory Structure
- Create directory `/opt/ozean-licht-ecosystem/storybook/ai-mvp/`
- Keep everything contained in this single directory for easy removal/upgrade

### 2. Define Shared TypeScript Types
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/types.ts`:
```typescript
export interface IterateRequest {
  componentPath: string;
  currentCode: string;
  prompt: string;
  storyId?: string;
}

export interface IterateResponse {
  success: boolean;
  error?: string;
  message?: string;
}
```

### 3. Build Vite Plugin with AI Iteration Logic
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/vite-plugin.ts`:
```typescript
import { Plugin } from 'vite';
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';
import type { IterateRequest, IterateResponse } from './types';

export function aiIterationPlugin(): Plugin {
  let designSystem = '';
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  return {
    name: 'ai-iteration',

    async buildStart() {
      // Load design system once at startup
      const designSystemPath = path.join(__dirname, '../../design-system.md');
      designSystem = await fs.readFile(designSystemPath, 'utf-8');
    },

    configureServer(server) {
      server.middlewares.use('/__ai-iterate', async (req, res) => {
        // Only handle POST requests
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        // Parse request body
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
          try {
            const { componentPath, currentCode, prompt }: IterateRequest = JSON.parse(body);

            // Call Claude with design system context
            const response = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 4000,
              messages: [{
                role: 'user',
                content: buildPrompt(designSystem, currentCode, prompt)
              }]
            });

            const newCode = extractCode(response.content[0].text);

            // Write to file - Vite HMR will automatically detect and reload
            await fs.writeFile(componentPath, newCode, 'utf-8');

            // Small delay to ensure Vite picks up the change
            await new Promise(resolve => setTimeout(resolve, 100));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: 'Component updated successfully'
            } as IterateResponse));

          } catch (error: any) {
            console.error('AI iteration error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: error.message
            } as IterateResponse));
          }
        });
      });
    }
  };
}

function buildPrompt(designSystem: string, currentCode: string, userPrompt: string): string {
  // Extract first 2000 chars of design system for context
  const designRules = designSystem.slice(0, 2000);

  return `You are modifying a React component. Follow these design rules strictly:

${designRules}

Current component code:
\`\`\`tsx
${currentCode}
\`\`\`

User request: ${userPrompt}

CRITICAL INSTRUCTIONS:
1. Return ONLY the complete updated component code
2. No explanations, no markdown formatting, no \`\`\`tsx blocks
3. Start with imports, end with export
4. Preserve existing functionality unless explicitly asked to change
5. Follow the Ozean Licht design system (turquoise #0ec2bc, glass morphism, Montserrat font)

OUTPUT:`;
}

function extractCode(response: string): string {
  // Remove markdown code blocks if Claude included them
  let code = response.trim();

  // Remove ```tsx or ```typescript or ``` wrappers
  code = code.replace(/^```(?:tsx|typescript|ts|jsx|javascript|js)?\n/g, '');
  code = code.replace(/\n```$/g, '');

  return code.trim();
}
```

### 4. Create Client-Side Button and Modal
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/client.ts`:
```typescript
// This script gets injected into Storybook preview iframe
(function() {
  // Prevent double injection
  if ((window as any).__AI_ITERATE_INJECTED__) return;
  (window as any).__AI_ITERATE_INJECTED__ = true;

  // Create floating button
  const button = document.createElement('button');
  button.innerHTML = '✨ AI';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: linear-gradient(135deg, #0ec2bc 0%, #0a9d98 100%);
    color: white;
    border: none;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(14, 194, 188, 0.4);
    transition: all 0.2s ease;
  `;

  button.onmouseenter = () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 20px rgba(14, 194, 188, 0.6)';
  };
  button.onmouseleave = () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(14, 194, 188, 0.4)';
  };

  // Create modal overlay
  const modal = document.createElement('div');
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 15, 26, 0.85);
    backdrop-filter: blur(8px);
    z-index: 100000;
    align-items: center;
    justify-content: center;
  `;

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: #1A1F2E;
    border: 1px solid #0ec2bc;
    border-radius: 12px;
    padding: 32px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 0 40px rgba(14, 194, 188, 0.3);
  `;

  modalContent.innerHTML = `
    <h3 style="color: white; margin: 0 0 16px 0; font-family: Montserrat, sans-serif;">AI Iterate Component</h3>
    <p style="color: #94A3B8; margin: 0 0 16px 0; font-size: 14px;">Describe what changes you want to make to this component.</p>
    <textarea
      id="ai-prompt"
      placeholder="e.g., Make the button 20% larger and add a glass morphism effect"
      style="
        width: 100%;
        height: 120px;
        background: #0A0F1A;
        color: white;
        border: 1px solid #0ec2bc;
        border-radius: 8px;
        padding: 12px;
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        resize: vertical;
        outline: none;
      "
    ></textarea>
    <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end;">
      <button
        id="ai-cancel"
        style="
          padding: 10px 20px;
          background: transparent;
          color: #94A3B8;
          border: 1px solid #94A3B8;
          border-radius: 6px;
          cursor: pointer;
          font-family: Montserrat, sans-serif;
          font-weight: 500;
        "
      >Cancel</button>
      <button
        id="ai-iterate"
        style="
          padding: 10px 20px;
          background: #0ec2bc;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: Montserrat, sans-serif;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(14, 194, 188, 0.3);
        "
      >✨ Iterate</button>
    </div>
    <div
      id="ai-status"
      style="
        margin-top: 16px;
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;
        font-family: Montserrat, sans-serif;
        display: none;
      "
    ></div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(button);
  document.body.appendChild(modal);

  // Modal handlers
  const showModal = () => {
    modal.style.display = 'flex';
    (document.getElementById('ai-prompt') as HTMLTextAreaElement)?.focus();
  };

  const hideModal = () => {
    modal.style.display = 'none';
    (document.getElementById('ai-prompt') as HTMLTextAreaElement).value = '';
    const status = document.getElementById('ai-status')!;
    status.style.display = 'none';
  };

  const showStatus = (message: string, type: 'loading' | 'success' | 'error') => {
    const status = document.getElementById('ai-status')!;
    status.style.display = 'block';
    status.textContent = message;

    if (type === 'loading') {
      status.style.background = 'rgba(14, 194, 188, 0.1)';
      status.style.color = '#0ec2bc';
      status.style.border = '1px solid rgba(14, 194, 188, 0.3)';
    } else if (type === 'success') {
      status.style.background = 'rgba(34, 197, 94, 0.1)';
      status.style.color = '#22c55e';
      status.style.border = '1px solid rgba(34, 197, 94, 0.3)';
    } else {
      status.style.background = 'rgba(239, 68, 68, 0.1)';
      status.style.color = '#ef4444';
      status.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    }
  };

  // Button click handler
  button.onclick = showModal;

  // Cancel button
  document.getElementById('ai-cancel')!.onclick = hideModal;

  // Click outside to close
  modal.onclick = (e) => {
    if (e.target === modal) hideModal();
  };

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      showModal();
    }
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      hideModal();
    }
  });

  // Iterate button handler
  document.getElementById('ai-iterate')!.onclick = async () => {
    const prompt = (document.getElementById('ai-prompt') as HTMLTextAreaElement).value.trim();
    if (!prompt) {
      showStatus('Please enter a prompt', 'error');
      return;
    }

    try {
      showStatus('AI is analyzing and updating your component...', 'loading');

      // Get current story context from Storybook
      const storyData = (window as any).__STORYBOOK_PREVIEW__?.currentSelection;
      if (!storyData) {
        showStatus('No story selected. Please view a component first.', 'error');
        return;
      }

      // Try to determine component path from story
      const storyId = storyData.storyId;
      const componentName = storyId.split('--')[0].replace(/-/g, '');

      // Search likely component locations
      const searchPaths = [
        `/opt/ozean-licht-ecosystem/shared/ui/src/ui/${componentName}.tsx`,
        `/opt/ozean-licht-ecosystem/shared/ui/src/components/${componentName}.tsx`,
        `/opt/ozean-licht-ecosystem/apps/admin/components/ui/${componentName}.tsx`,
      ];

      // For MVP, use first path (can be enhanced later)
      const componentPath = searchPaths[0];

      // Fetch current component code
      const codeResponse = await fetch(componentPath);
      if (!codeResponse.ok) {
        showStatus(`Component file not found: ${componentName}.tsx`, 'error');
        return;
      }
      const currentCode = await codeResponse.text();

      // Call our Vite plugin endpoint (same origin - no CORS!)
      const response = await fetch('/__ai-iterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentPath,
          currentCode,
          prompt
        })
      });

      const result = await response.json();

      if (result.success) {
        showStatus('✓ Component updated! Changes will appear in ~1 second via HMR.', 'success');
        setTimeout(hideModal, 2000);
      } else {
        showStatus(`Error: ${result.error}`, 'error');
      }

    } catch (error: any) {
      showStatus(`Error: ${error.message}`, 'error');
    }
  };
})();
```

### 5. Inject Client Script via Storybook Decorator
Modify `/opt/ozean-licht-ecosystem/storybook/config/preview.ts`:

Add to the decorators array:
```typescript
// Add after existing decorators
import React from 'react';

// ... existing decorators ...

// AI Iteration Decorator
(Story) => {
  React.useEffect(() => {
    // Inject AI iteration client script
    const script = document.createElement('script');
    script.src = '/ai-mvp-client.js';
    script.async = true;

    // Only inject once
    if (!document.querySelector('script[src="/ai-mvp-client.js"]')) {
      document.body.appendChild(script);
    }
  }, []);

  return React.createElement(Story);
}
```

### 6. Register Vite Plugin in Storybook Config
Modify `/opt/ozean-licht-ecosystem/storybook/config/main.ts`:

```typescript
import { aiIterationPlugin } from '../ai-mvp/vite-plugin';
import path from 'path';
import fs from 'fs';

export default {
  // ... existing config ...

  viteFinal: async (config) => {
    // Add AI iteration plugin
    config.plugins = config.plugins || [];
    config.plugins.push(aiIterationPlugin());

    // Serve client script as static asset
    config.plugins.push({
      name: 'serve-ai-client',
      configureServer(server) {
        server.middlewares.use('/ai-mvp-client.js', async (req, res) => {
          const clientPath = path.join(__dirname, '../ai-mvp/client.ts');
          const clientCode = fs.readFileSync(clientPath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/javascript' });
          res.end(clientCode);
        });
      }
    });

    return config;
  },
};
```

### 7. Create Environment Configuration
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/.env.example`:
```bash
# Anthropic API Key (required)
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

Create `.env` from example and add your API key.

### 8. Create Quick Start Documentation
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/README.md`:
```markdown
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
```

### 9. Update Root Package.json Scripts
No changes needed! Storybook already works with:
```bash
pnpm storybook
```

The Vite plugin is automatically loaded when Storybook starts.

### 10. Test the Complete Flow
- Start Storybook: `pnpm storybook`
- Navigate to any component story
- Press Cmd+K (or click ✨ button)
- Type: "Make this component 20% larger"
- Click "Iterate"
- Verify component updates within 2-3 seconds

## Testing Strategy

### Manual Testing (MVP Scope)
1. **Smoke Test:**
   - Start Storybook
   - Verify floating ✨ button appears
   - Click button → modal opens
   - Press Escape → modal closes
   - Press Cmd+K → modal opens

2. **Iteration Test:**
   - View Button story
   - Prompt: "Make the button 50% larger"
   - Verify button size increases in preview
   - Check file was modified: `git diff shared/ui/src/ui/button.tsx`

3. **Design System Test:**
   - Prompt: "Add glass morphism effect to this card"
   - Verify output uses `backdrop-filter: blur(12px)`
   - Verify turquoise border color `#0ec2bc`

4. **Error Handling:**
   - Disconnect internet → Should show error message
   - Empty prompt → Should show "Please enter a prompt"
   - Invalid component path → Should show "Component not found"

### Future Testing (Post-MVP)
- Unit tests for `buildPrompt()` function
- Integration tests for Vite plugin endpoint
- E2E tests with Playwright
- TypeScript validation tests

## Acceptance Criteria

- [ ] Floating ✨ button appears in Storybook preview
- [ ] Cmd+K keyboard shortcut opens prompt modal
- [ ] Typing prompt and clicking "Iterate" calls AI
- [ ] Component file is modified on disk
- [ ] Changes appear via HMR within 3 seconds
- [ ] Works with at least one component (Button)
- [ ] Design system context is included in prompts
- [ ] No separate server process needed
- [ ] Single Coolify deployment works
- [ ] No CORS errors in browser console

## Validation Commands

Execute these commands to validate the task is complete:

- `pnpm storybook` - Start Storybook with AI iteration enabled
- Open http://localhost:6006 - Verify floating ✨ button appears
- Press Cmd+K - Verify modal opens with prompt input
- View Button story - Navigate to button component
- Test iteration - Type "make button larger" and verify it works
- Check git diff - `git diff shared/ui/src/ui/button.tsx` shows changes
- Check console - No errors in browser developer console

## Notes

### Why Vite Plugin vs Express API?

**Original Approach (Express API):**
- ❌ Two processes (Storybook + API server)
- ❌ Two Coolify services
- ❌ CORS configuration needed
- ❌ Network latency (browser → localhost:3001 → filesystem)
- ❌ Port management (6006 + 3001)
- ❌ Must run concurrently

**Vite Plugin Approach:**
- ✅ Single process (just Storybook)
- ✅ One Coolify service
- ✅ No CORS (same origin)
- ✅ Direct filesystem access (no network)
- ✅ One port (6006)
- ✅ Just run `pnpm storybook`

### Production Deployment (Coolify)

**Development Mode (this MVP):**
```yaml
# coolify.json
{
  "name": "storybook-dev",
  "type": "nodejs",
  "port": 6006,
  "buildCommand": "pnpm install",
  "startCommand": "pnpm storybook",
  "env": {
    "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
  }
}
```

**Production Mode (static build):**
For production Storybook, build static version without AI iteration:
```bash
pnpm build-storybook
```
AI iteration is a **development-only tool**, not for end users.

### Dependencies

All required dependencies are already installed:
- `@anthropic-ai/sdk` ✅ (in package.json)
- `vite` ✅ (Storybook uses Vite)
- Node.js `fs/promises` ✅ (built-in)
- Node.js `path` ✅ (built-in)

**No new dependencies needed!**

### Security Considerations (MVP)

For MVP, we trust Claude and skip validation. For production, add:
- File path whitelist (only allow `/shared/ui/src/**`)
- TypeScript validation before writing
- Git stash safety net
- Rate limiting (10 iterations/minute)

See `/specs/storybook-ai-iteration-system.md` for full security implementation.

### Total Implementation Time

**Estimated: 2-3 hours** (vs 8-10 hours for separate API server)

**Breakdown:**
- Vite plugin creation: 45 minutes
- Client-side UI: 45 minutes
- Storybook integration: 30 minutes
- Testing and debugging: 30-60 minutes

**Why faster?**
- No Express server setup
- No CORS configuration
- No process management (concurrently)
- Simpler architecture = less code = faster implementation
