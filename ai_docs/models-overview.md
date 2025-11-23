# Claude Models Overview

## Current Model Lineup

Anthropic offers three primary Claude models with distinct strengths:

**Claude Sonnet 4.5** serves as the recommended starting point, balancing "intelligence, speed, and cost for most use cases" with exceptional coding capabilities. It features a 200K token context window (expandable to 1M tokens in beta) and 64K maximum output tokens.

**Claude Haiku 4.5** prioritizes speed, delivering near-frontier performance at lower latency and cost ($1/input MTok, $5/output MTok). It maintains the same 200K context window as Sonnet.

**Claude Opus 4.1** specializes in complex reasoning tasks, though it operates at moderate latency with higher costs ($15/input, $75/output MTok) and a 32K maximum output limit.

## Key Specifications

All models support multimodal input (text and images), text output, multilingual capabilities, and extended thinking. They're accessible via Anthropic's API, AWS Bedrock, and Google Vertex AI.

The models differ in knowledge cutoffs—Sonnet and Opus reflect January 2025 reliability, while Haiku extends to February 2025. All were trained on data through July 2025.

## Migration Guidance

The documentation emphasizes that users currently leveraging Claude 3 models should transition to Claude 4.5 versions to access "improved intelligence and enhanced capabilities."
