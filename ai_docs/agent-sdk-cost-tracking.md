# Cost Tracking

The Claude Agent SDK provides detailed token usage information for tracking costs and billing. This guide explains how to properly monitor token consumption, especially with parallel tool usage and multi-step conversations.

## Steps, Messages, and Usage

A step represents one request/response cycle with Claude. Messages are individual communications within a step (text, tool calls, results). Usage data attaches to assistant messages, tracking token consumption.

## Critical Usage Rules

### Rule 1 - Identical IDs Share Usage Data

All messages with the same `id` field report identical usage. When Claude sends multiple messages simultaneously (like text plus tool calls), they share the same message ID and usage metrics.

### Rule 2 - Charge Once Per Step

Users should be charged only once per step, not per individual message. When multiple assistant messages share an ID, use the usage from any single instance.

### Rule 3 - Cumulative Usage in Results

The final `result` message contains the total cumulative usage from all steps in the conversation, including the `total_cost_usd` field.

## Implementation Pattern

The documentation provides a `CostTracker` class that:
- Tracks processed message IDs to prevent duplicate charging
- Records usage for each unique message
- Calculates costs based on token types
- Maintains a record of step-by-step usage

## Usage Fields

Each usage object includes:
- `input_tokens` - base input processing
- `output_tokens` - generated response tokens
- `cache_creation_input_tokens` - cache creation costs
- `cache_read_input_tokens` - cache retrieval costs
- `service_tier` - operational tier used
- `total_cost_usd` - final USD cost (result message only)

## Best Practices

The guide recommends:
- Deduplicating with message IDs
- Monitoring result messages for authoritative data
- Implementing comprehensive logging
- Handling partial usage on failures
- Accumulating usage during streaming responses
