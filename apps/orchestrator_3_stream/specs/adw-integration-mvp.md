# ADW Integration MVP: The Simplest Thing That Works

**Goal:** Connect ADW to Orchestrator in < 100 lines of code
**Timeline:** 2-4 hours to working prototype

---

## 🎯 The Minimal Viable Integration

Just three things:
1. **Detect** when user mentions an issue number
2. **Spawn** the ADW workflow
3. **Show** it's running

That's it. No complex routing, no progress tracking, no fancy UI.

---

## 📝 Implementation: One File, One Function

Add this single method to `orchestrator_service.py`:

```python
async def check_for_adw_trigger(self, message: str, orchestrator_agent_id: str):
    """
    Check if message mentions an issue, if so, spawn ADW
    """
    import re
    import subprocess

    # Simple pattern: "issue 123" or "#123"
    pattern = r'(?:issue\s+#?|#)(\d+)'
    match = re.search(pattern, message.lower())

    if match:
        issue_number = match.group(1)

        # Determine workflow type from keywords
        workflow_type = "plan_build_iso"  # default
        if "fix" in message.lower() or "bug" in message.lower():
            workflow_type = "plan_build_iso"
        elif "review" in message.lower():
            workflow_type = "plan_build_review_iso"

        # Spawn ADW in background (fire and forget)
        cmd = [
            "uv", "run",
            f"adws/adw_{workflow_type}.py",
            issue_number
        ]

        # Log what we're doing
        self.logger.info(f"Spawning ADW workflow for issue {issue_number}")

        # Start process in background
        subprocess.Popen(
            cmd,
            cwd="/opt/ozean-licht-ecosystem",
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # Tell the user
        notification = f"✅ Started ADW {workflow_type} workflow for issue #{issue_number}\n\n" \
                      f"The workflow is running in the background. " \
                      f"Check GitHub for updates on the PR."

        # Broadcast via existing WebSocket
        await self.websocket_manager.broadcast_chat_stream(
            orchestrator_agent_id=orchestrator_agent_id,
            chunk=notification,
            is_complete=True
        )

        return True  # We handled it

    return False  # Let orchestrator handle normally
```

Then modify the existing `process_user_message` to call this:

```python
async def process_user_message(self, message: str, orchestrator_agent_id: str):
    # Check for ADW trigger FIRST
    if await self.check_for_adw_trigger(message, orchestrator_agent_id):
        return  # ADW is handling it

    # Otherwise, continue with normal orchestrator flow
    # ... existing code ...
```

---

## 🎨 Simple UI Feedback

Add ONE line to show ADW status in the chat:

In `OrchestratorChat.vue`, update the message display:

```vue
<div v-if="message.message.includes('Started ADW')"
     class="adw-notification">
  🔄 Workflow Running - Check GitHub for PR updates
</div>
```

Style it simply:

```css
.adw-notification {
  padding: 0.5rem;
  background: linear-gradient(90deg, rgba(0,255,255,0.1), transparent);
  border-left: 3px solid #00ffff;
  margin: 0.5rem 0;
}
```

---

## ✅ Testing: Manual is Fine

1. Start the orchestrator
2. Type: "Fix issue 123"
3. Check:
   - Message appears in chat
   - `ps aux | grep adw` shows process running
   - GitHub gets a PR after a few minutes

---

## 🚀 Ship It

This MVP:
- **Works today** with existing code
- **No new dependencies**
- **No complex state management**
- **Users get value immediately**

---

## 📈 Later Improvements (Only if Needed)

After shipping and seeing real usage:

### Phase 2: Basic Progress (if users ask)
```python
# Check if ADW worktree exists
worktree_path = f"/opt/ozean-licht-ecosystem/trees/*"
if Path(worktree_path).exists():
    status = "🔄 Running"
else:
    status = "✅ Complete"
```

### Phase 3: GitHub Integration (if really needed)
```python
# Check PR status via gh CLI
result = subprocess.run(
    ["gh", "pr", "list", "--search", f"issue:{issue_number}"],
    capture_output=True
)
```

But **don't build these until users actually need them**.

---

## 🎯 Success Metrics

1. **It works** - ADW spawns when triggered
2. **Users understand** - No confusion about what's happening
3. **No maintenance** - Set and forget

---

## 💡 Key Insight

**The best integration is invisible.** Users shouldn't have to think about ADW vs Orchestrator. They just type what they want, and the right thing happens.

This MVP achieves that with minimal code and maximum reliability.

---

## Next Step: Just Build It

1. Add the `check_for_adw_trigger` method (15 minutes)
2. Test with a real issue (5 minutes)
3. Ship to production (1 minute)
4. Learn from usage (ongoing)

**Total time to value: < 30 minutes**