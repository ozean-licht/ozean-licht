# Claude Agent SDK Cost Tracking Guide

## Overview
The Claude Agent SDK provides detailed token usage information for tracking costs and billing. Key principles include understanding that all messages with the same ID report identical usage data, and you should only charge once per step rather than per individual message.

## Core Concepts

**Steps and Messages**: A step represents a single request/response pair with Claude, while messages are individual components (text, tool uses, tool results) within that step.

**Usage Reporting**: Token consumption data attaches to assistant messages. When Claude executes tools in parallel, all messages sharing the same ID report the same usage metrics.

## Important Rules

1. **Same ID = Same Usage**: Multiple messages with identical IDs contain identical usage data, so deduplicate by message ID to avoid double-charging.

2. **Charge Once Per Step**: Process only unique message IDs; ignore duplicate messages from the same turn.

3. **Cumulative Usage**: The final result message contains total usage across all conversation steps, providing authoritative billing data.

## Implementation Strategy

Track processed message IDs using a Set to prevent duplicate charges. Monitor `output_tokens`, `input_tokens`, cache-related tokens, and `total_cost_usd` (available only in the result message).

## Handling Edge Cases

For rare output token discrepancies among same-ID messages, use the highest value. The `total_cost_usd` field in results is always authoritative for billing purposes.
