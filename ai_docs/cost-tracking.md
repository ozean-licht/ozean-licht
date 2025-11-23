# Claude Agent SDK Cost Tracking Documentation

## Overview

The Claude Agent SDK provides detailed token usage information for each interaction with Claude. This guide explains how to properly track costs and understand usage reporting, especially when dealing with parallel tool uses and multi-step conversations.

## Key Concepts

**Steps**: A single request/response pair between your application and Claude

**Messages**: Individual messages within a step (text, tool uses, tool results)

**Usage**: Token consumption data attached to assistant messages

## Important Usage Rules

### Same ID = Same Usage

"All messages with the same `id` field report identical usage." When Claude sends multiple messages in the same turn (such as text combined with tool uses), they share the same message ID and usage data. You should only charge users once per step, not for each individual message.

### Cumulative Usage

The final `result` message contains the total cumulative usage from all steps in the conversation, including the `total_cost_usd` field.

## Usage Fields Reference

Each usage object contains:

- `input_tokens`: Base input tokens processed
- `output_tokens`: Tokens generated in the response
- `cache_creation_input_tokens`: Tokens used to create cache entries
- `cache_read_input_tokens`: Tokens read from cache
- `service_tier`: The service tier used (e.g., "standard")
- `total_cost_usd`: Total cost in USD (only in result message)

## Cost Tracking Implementation

Implementations should:

1. **Track processed message IDs** to avoid double-charging
2. **Monitor the result message** for authoritative cumulative usage
3. **Implement logging** for auditing and debugging
4. **Handle failures gracefully** by tracking partial usage
5. **Consider streaming** by accumulating usage as messages arrive

## Edge Cases

**Output Token Discrepancies**: Use the highest value when different `output_tokens` appear for the same ID. Verify against `total_cost_usd` for accuracy.

**Cache Token Tracking**: Separately track cache creation tokens (`ephemeral_5m_input_tokens`, `ephemeral_1h_input_tokens`) from regular usage.

## Related Resources

For complete API documentation, consult the TypeScript SDK reference and Agent SDK overview materials.
