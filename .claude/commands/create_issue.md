# Create GitHub Issue and Trigger ADW

Create a new GitHub issue and optionally trigger an ADW workflow to implement it.

## Usage

When you need to create a GitHub issue for tracking work, use this command. It will:
1. Create the issue on GitHub with proper formatting
2. Return the issue number and URL
3. Optionally trigger an ADW workflow to start implementation

## Process

1. **Parse Input** - Extract title, description, labels, and workflow preference
2. **Create Issue** - Use `gh issue create` to create on GitHub
3. **Get Issue Number** - Parse the response to get issue number
4. **Trigger ADW** (optional) - If requested, spawn ADW workflow
5. **Report Success** - Show issue URL and ADW status

## Implementation

```bash
# Create the issue using gh CLI
gh issue create \
  --title "$TITLE" \
  --body "$BODY" \
  --label "$LABELS"

# The response will be like:
# https://github.com/owner/repo/issues/123

# Parse the issue number from URL
ISSUE_NUMBER=$(echo $RESPONSE | grep -oP '\d+$')

# If ADW requested, trigger it
if [[ "$TRIGGER_ADW" == "true" ]]; then
  uv run adws/adw_${WORKFLOW_TYPE}.py $ISSUE_NUMBER
fi
```

## Parameters

- **title**: Issue title (required)
- **description**: Issue description/body (required)
- **labels**: Comma-separated labels (optional, defaults to "enhancement")
- **trigger_adw**: Whether to start ADW workflow (optional, defaults to true)
- **workflow_type**: ADW workflow to use (optional, defaults to "plan_build_iso")

## Examples

### Basic Issue Creation
```
Create an issue to add dark mode support to the admin dashboard
```

### Issue with Immediate Implementation
```
Create an issue "Add export functionality" with description "Users need to export data as CSV" and start working on it
```

### Bug Report with Auto-Fix
```
Create a bug issue "Fix login timeout" and trigger the fix workflow
```

## Response Format

Return a clear summary including:
- Issue number and URL
- Labels applied
- ADW workflow status (if triggered)
- Next steps for the user

## Best Practices

1. **Clear Titles** - Use imperative mood ("Add", "Fix", "Update")
2. **Detailed Descriptions** - Include acceptance criteria when possible
3. **Appropriate Labels** - Use "bug", "enhancement", "documentation", etc.
4. **ADW Selection** - Choose workflow based on issue type:
   - Bugs → plan_build_test_iso
   - Features → plan_build_iso
   - Reviews → plan_build_review_iso

## Error Handling

- If GitHub CLI fails, check authentication with `gh auth status`
- If ADW spawn fails, issue is still created (don't rollback)
- Always return the issue URL even if ADW fails

## Integration with Orchestrator

This command integrates seamlessly with the orchestrator's ADW trigger:
1. Issue gets created with proper structure
2. ADW workflow starts immediately if requested
3. User sees both issue URL and ADW notification in chat
4. Complete traceability from idea → issue → implementation → PR