# Claude Models Overview - Complete Documentation

## Recommended Model

**Claude Sonnet 4.5** is recommended as the starting point, offering "the best balance of intelligence, speed, and cost for most use cases, with exceptional performance in coding and agentic tasks."

## Current Model Lineup

### Claude Sonnet 4.5
- **API ID**: claude-sonnet-4-5-20250929
- **Description**: Smartest model for complex agents and coding
- **Pricing**: $3/input MTok, $15/output MTok
- **Context**: 200K tokens / 1M tokens (beta)
- **Max Output**: 64K tokens
- **Knowledge Cutoff**: January 2025 (reliable); July 2025 (training data)
- **Latency**: Fast
- **Features**: Extended thinking, Priority Tier support

### Claude Haiku 4.5
- **API ID**: claude-haiku-4-5-20251001
- **Description**: Fastest model with near-frontier intelligence
- **Pricing**: $1/input MTok, $5/output MTok
- **Context**: 200K tokens
- **Max Output**: 64K tokens
- **Knowledge Cutoff**: January 2025 (reliable); July 2025 (training data)
- **Latency**: Fastest
- **Features**: Extended thinking, Priority Tier support

### Claude Opus 4.5
- **API ID**: claude-opus-4-5-20251101
- **Description**: Premium model combining maximum intelligence with practical performance
- **Pricing**: $5/input MTok, $25/output MTok
- **Context**: 200K tokens
- **Max Output**: 64K tokens
- **Knowledge Cutoff**: March 2025 (reliable); August 2025 (training data)
- **Latency**: Moderate
- **Features**: Extended thinking, Priority Tier support

### Claude Opus 4.1
- **API ID**: claude-opus-4-1-20250805
- **Description**: Exceptional model for specialized reasoning tasks
- **Pricing**: $15/input MTok, $75/output MTok
- **Context**: 200K tokens
- **Max Output**: 32K tokens
- **Knowledge Cutoff**: January 2025 (reliable); March 2025 (training data)
- **Latency**: Moderate
- **Features**: Extended thinking, Priority Tier support

## Key Capabilities

All current models support:
- Text and image input
- Text output
- Multilingual capabilities
- Vision processing
- Extended thinking
- Prompt caching
- Batch processing

## Platform Availability

Models accessible through:
- Anthropic API
- AWS Bedrock
- Google Vertex AI

The documentation emphasizes using specific versioned model IDs in production rather than aliases for consistent behavior.