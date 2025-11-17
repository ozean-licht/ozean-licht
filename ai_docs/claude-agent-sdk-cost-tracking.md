# Claude Agent SDK Cost Tracking

## Overview

The Claude Agent SDK provides detailed token usage information for each interaction. Proper tracking is essential for billing and cost management, particularly when handling parallel tool uses and multi-step conversations.

## Key Concepts

**Steps**: Single request/response pairs between your application and Claude

**Messages**: Individual messages within a step (text, tool uses, results)

**Usage**: Token consumption data attached to assistant messages

## Usage Reporting Structure

### Important Rules

1. **Same ID = Same Usage**: "All messages with the same `id` field report identical usage." When Claude sends multiple messages in one turn (text + tool uses), they share the same ID and usage data.

2. **Charge Once Per Step**: Only charge users once per step, not for each individual message. When seeing multiple assistant messages with identical IDs, use the usage from any one of them.

3. **Cumulative Usage in Results**: "The final `result` message contains the total cumulative usage from all steps in the conversation" including `total_cost_usd`.

## Usage Fields

Each usage object contains:
- `input_tokens`: Base input tokens processed
- `output_tokens`: Tokens generated
- `cache_creation_input_tokens`: Tokens used creating cache entries
- `cache_read_input_tokens`: Tokens read from cache
- `service_tier`: Service tier used
- `total_cost_usd`: Total cost (result message only)

## Best Practices

- Use message IDs for deduplication to avoid double-charging
- Monitor the result message for authoritative cumulative usage
- Implement comprehensive logging for auditing
- Track partial usage even if conversations fail
- For streaming responses, accumulate usage as messages arrive

## Edge Cases

**Output Token Discrepancies**: Use the highest value when inconsistencies occur; verify against `total_cost_usd` which is authoritative.

**Cache Tracking**: Separately track cache creation and read tokens for accurate cost analysis.
