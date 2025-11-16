# Plan: Storybook AI Iteration MVP

## Task Description
Build the absolute simplest MVP for AI-powered component iteration in Storybook. Users can click a button or press Cmd+K while viewing any component, type a prompt describing changes they want (e.g., "make this button bigger with glass effect"), and see the component update live via HMR. Keep it stupid simple - no complex features, just the core happy path working end-to-end.

## Objective
Create a working proof-of-concept where:
1. User views component in Storybook
2. User presses floating button or Cmd+K
3. User types iteration prompt
4. AI modifies component file
5. Changes appear instantly via HMR

## Solution Approach
Instead of building a complex Storybook addon, we'll:
- Inject a simple floating button via preview decorator
- Run a minimal Express server with one endpoint
- Use the already-installed @anthropic-ai/sdk
- Write directly to component files and let Vite HMR handle updates
- Skip all validation, safety checks, and complex features for MVP

## Relevant Files
Use these files to complete the task:

- `/opt/ozean-licht-ecosystem/storybook/config/preview.ts` - Add floating button decorator here
- `/opt/ozean-licht-ecosystem/package.json` - @anthropic-ai/sdk already installed
- `/opt/ozean-licht-ecosystem/design-system.md` - Design system rules to inject

### New Files
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/server.js` - Simple Express server
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/client.js` - Client-side button/modal logic
- `/opt/ozean-licht-ecosystem/storybook/ai-mvp/.env.example` - API key configuration

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Create MVP Directory Structure
- Create directory `/opt/ozean-licht-ecosystem/storybook/ai-mvp/`
- Keep everything contained in this single directory for easy removal/upgrade

### 2. Build Minimal Express Server
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Read design system once at startup
let designSystem = '';
fs.readFile(path.join(__dirname, '../../design-system.md'), 'utf8')
  .then(content => { designSystem = content; });

app.post('/iterate', async (req, res) => {
  const { componentPath, currentCode, prompt } = req.body;

  try {
    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are modifying a React component. Follow these design rules:

${designSystem.slice(0, 2000)} // First 2000 chars of design system

Current component code:
\`\`\`tsx
${currentCode}
\`\`\`

User request: ${prompt}

Return ONLY the complete updated component code. No explanations.`
      }]
    });

    const newCode = response.content[0].text;

    // Write to file
    await fs.writeFile(componentPath, newCode);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('AI Server running on http://localhost:3001');
});
```

### 3. Create Client-Side Button and Modal
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/client.js`:
```javascript
// Inject floating button and modal into Storybook preview
(function() {
  // Only inject once
  if (window.__AI_ITERATE_INJECTED__) return;
  window.__AI_ITERATE_INJECTED__ = true;

  // Create floating button
  const button = document.createElement('button');
  button.innerHTML = '✨';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: #0ec2bc;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(14, 194, 188, 0.4);
  `;

  // Create modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #1A1F2E;
    border: 1px solid #0ec2bc;
    border-radius: 12px;
    padding: 24px;
    z-index: 100000;
    box-shadow: 0 0 40px rgba(14, 194, 188, 0.3);
  `;

  modal.innerHTML = `
    <h3 style="color: white; margin: 0 0 16px 0;">AI Iterate Component</h3>
    <textarea
      id="ai-prompt"
      placeholder="What changes do you want? (e.g., make button bigger with glow effect)"
      style="width: 400px; height: 100px; background: #0A0F1A; color: white; border: 1px solid #0ec2bc; border-radius: 8px; padding: 12px;"
    ></textarea>
    <div style="margin-top: 16px; text-align: right;">
      <button onclick="window.__closeAIModal()" style="margin-right: 8px; padding: 8px 16px;">Cancel</button>
      <button onclick="window.__executeAI()" style="padding: 8px 16px; background: #0ec2bc; color: white; border: none; border-radius: 4px;">Iterate</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(modal);

  // Button click handler
  button.onclick = () => {
    modal.style.display = 'block';
    document.getElementById('ai-prompt').focus();
  };

  // Keyboard shortcut (Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      modal.style.display = 'block';
      document.getElementById('ai-prompt').focus();
    }
  });

  // Modal handlers
  window.__closeAIModal = () => {
    modal.style.display = 'none';
  };

  window.__executeAI = async () => {
    const prompt = document.getElementById('ai-prompt').value;
    if (!prompt) return;

    // Get current story context from Storybook
    const storyContext = window.__STORYBOOK_PREVIEW__?.currentSelection;
    if (!storyContext) {
      alert('No story selected');
      return;
    }

    // Try to determine component path
    let componentPath = '';
    const storyId = storyContext.storyId;
    const componentName = storyId.split('--')[0].replace(/-/g, '');

    // Search likely locations
    const searchPaths = [
      `/opt/ozean-licht-ecosystem/shared/ui/src/ui/${componentName}.tsx`,
      `/opt/ozean-licht-ecosystem/shared/ui/src/components/${componentName}.tsx`,
      `/opt/ozean-licht-ecosystem/apps/admin/components/ui/${componentName}.tsx`,
    ];

    // For MVP, just use the first path (user can manually fix if wrong)
    componentPath = searchPaths[0];

    try {
      // Read current component code (this is a hack for MVP)
      const response = await fetch(componentPath);
      const currentCode = await response.text();

      // Call our server
      const result = await fetch('http://localhost:3001/iterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentPath,
          currentCode,
          prompt
        })
      });

      if (result.ok) {
        window.__closeAIModal();
        document.getElementById('ai-prompt').value = '';
        // HMR will automatically reload the component
      } else {
        alert('Error: ' + await result.text());
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
})();
```

### 4. Inject Client Script into Storybook Preview
Modify `/opt/ozean-licht-ecosystem/storybook/config/preview.ts`:
- Add to the decorators array:
```typescript
// Add after existing decorators
(Story) => {
  React.useEffect(() => {
    // Inject AI iteration client
    const script = document.createElement('script');
    script.src = 'http://localhost:3001/client.js';
    document.body.appendChild(script);
  }, []);

  return React.createElement(Story);
}
```

### 5. Serve Client Script from Express
Add to `/opt/ozean-licht-ecosystem/storybook/ai-mvp/server.js`:
```javascript
// Serve client script
app.get('/client.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.js'));
});
```

### 6. Create Environment Configuration
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/.env.example`:
```bash
ANTHROPIC_API_KEY=your-api-key-here
```

### 7. Add NPM Scripts
Add to `/opt/ozean-licht-ecosystem/package.json`:
```json
"scripts": {
  "ai-server": "node storybook/ai-mvp/server.js",
  "storybook-ai": "concurrently \"npm run ai-server\" \"npm run storybook\""
}
```

### 8. Install Minimal Dependencies
- Run: `npm install express cors concurrently`
- @anthropic-ai/sdk is already installed

### 9. Create Quick Start Documentation
Create `/opt/ozean-licht-ecosystem/storybook/ai-mvp/README.md`:
```markdown
# Storybook AI Iteration MVP

## Quick Start
1. Copy `.env.example` to `.env` and add your Anthropic API key
2. Run: `npm run storybook-ai`
3. Open Storybook
4. View any component
5. Press floating ✨ button or Cmd+K
6. Type what you want to change
7. Watch it update live!

## How It Works
- Floating button injected into every story
- Simple Express server modifies component files
- Vite HMR reloads changes automatically

## Limitations (MVP)
- No validation or safety checks
- No git integration
- Component path detection is basic
- No undo/redo
- No conversation history

## Next Steps
See `/specs/storybook-ai-iteration-system.md` for full production plan.
```

## Testing Strategy
For MVP, manual testing only:
1. Start the server
2. Open Storybook
3. Click button on any component
4. Type "make this button bigger"
5. Verify component updates

## Acceptance Criteria
- [ ] Floating button appears in Storybook
- [ ] Cmd+K opens prompt modal
- [ ] Typing prompt and clicking "Iterate" calls API
- [ ] Component file is modified
- [ ] Changes appear via HMR within 5 seconds
- [ ] Works with at least one component (button)

## Validation Commands
Execute these commands to validate the task is complete:

- `npm run storybook-ai` - Starts both AI server and Storybook
- Open http://localhost:6006 - Verify floating button appears
- View Button story - Test iteration on button component
- Check console for server logs at http://localhost:3001

## Notes
This is a **true MVP** - intentionally missing many features:
- No TypeScript validation (trust Claude)
- No git safety (user handles git)
- No complex context gathering
- No design system validation
- Basic component path detection
- No error recovery

Total implementation time: 2-4 hours
Upgrade path: Move to full `/specs/storybook-ai-iteration-system.md` plan after MVP validation

**Key Simplifications:**
1. No Storybook addon - just inject HTML via decorator
2. No complex resolution - hardcode likely paths
3. No validation - write directly to disk
4. No git operations - user handles manually
5. One endpoint, one file, minimal code

**Why This Works:**
- Leverages existing HMR
- Uses already-installed @anthropic-ai/sdk
- Minimal new dependencies (express, cors)
- Can be built and tested in one afternoon
- Easy to throw away and rebuild properly later