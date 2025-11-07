# Claude Agent SDK Cost Tracking Documentation

## Overview

The Claude Agent SDK provides detailed token usage information for each interaction. The documentation emphasizes proper tracking to avoid double-charging users.

## Key Concepts

**Steps and Messages**: A step represents a single request/response pair. Messages within a step include text, tool uses, and tool results. Usage data attaches to assistant messages.

## Critical Usage Rules

**Message ID Deduplication**: "All messages with the same `id` field report identical usage." When Claude sends multiple outputs in one turn (text plus tool uses), they share the same ID and usage data—you should charge only once per unique message ID.

**Single Charging Per Step**: The system ensures you bill users once per step, not per individual message, even when multiple assistant messages appear simultaneously.

**Cumulative Reporting**: The final result message contains total cumulative usage from all conversation steps, providing authoritative billing information.

## Usage Fields

Each usage object includes:
- `input_tokens`: Base input tokens processed
- `output_tokens`: Generated response tokens
- `cache_creation_input_tokens`: Tokens creating cache entries
- `cache_read_input_tokens`: Tokens read from cache
- `service_tier`: Service tier used
- `total_cost_usd`: Total cost (result message only)

## Implementation Strategy

Track processed message IDs to prevent duplicate charges. Monitor the result message for authoritative cumulative usage data. Log all usage for auditing purposes and handle failures gracefully by tracking partial usage.

## Edge Cases

In rare instances, `output_tokens` values may differ for same-ID messages—use the highest value and verify against `total_cost_usd` for accuracy.
