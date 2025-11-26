# Tracking Costs and Usage - Claude Agent SDK Documentation

## Page Overview
This documentation guide explains how to track token usage and costs when using the Claude Agent SDK, with emphasis on handling parallel tool uses and multi-step conversations.

## Key Sections

### Understanding Token Usage
The SDK reports token usage at the message level. Three core concepts:
1. **Steps** - Single request/response pairs between application and Claude
2. **Messages** - Individual elements within a step (text, tool uses, tool results)
3. **Usage** - Token consumption data attached to assistant messages

### Usage Reporting Structure

**Single vs Parallel Tool Use:** When Claude executes tools, usage reporting differs based on sequential or parallel execution.

**Message Flow Example:** The documentation shows how messages and usage are reported across multi-step conversations, with identical usage data shared among messages with the same ID.

### Important Usage Rules

**Rule 1 - Same ID = Same Usage:** "All messages with the same `id` field report identical usage."

**Rule 2 - Charge Once Per Step:** Only charge users once per step, not for each individual message.

**Rule 3 - Result Contains Cumulative Usage:** The final result message includes total cumulative usage from all conversation steps.

### Code Example Provided
TypeScript example demonstrates tracking usage via `onMessage` callback within the query function, logging message IDs and usage data.

### Cost Tracking Implementation
The guide includes a complete CostTracker class example that:
- Processes messages and tracks unique message IDs
- Deduplicates usage to avoid double-charging
- Calculates costs based on input tokens, output tokens, and cache tokens

### Edge Cases Covered
- **Output Token Discrepancies:** Use highest values; verify against `total_cost_usd`
- **Cache Token Tracking:** Separate tracking for cache creation and read tokens

### Best Practices
- Use message IDs for deduplication
- Monitor result messages for authoritative usage
- Implement comprehensive logging
- Handle failures gracefully
- Consider streaming responses

### Usage Fields Reference
Standard fields include: input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens, service_tier, and total_cost_usd.

### Billing Dashboard Example
Documentation provides BillingAggregator class demonstrating how to aggregate usage data for multiple users and conversations.

## Related Resources
Links to TypeScript SDK Reference, SDK Overview, and SDK Permissions documentation are provided at the end.