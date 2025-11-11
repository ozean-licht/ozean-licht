#!/usr/bin/env tsx
/**
 * UserPromptSubmit Hook Handler
 * Injects relevant context from memory based on user prompt
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput } from '../types';
import { searchMemory, formatMemoryForContext } from '../utils/memory';

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('UserPromptSubmit hook triggered', { inputLength: stdinBuffer.length });

    // Parse input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    if (!input.prompt || input.prompt.trim().length === 0) {
      logger.debug('No prompt provided');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    logger.info('Processing user prompt', {
      promptLength: input.prompt.length,
      promptPreview: input.prompt.substring(0, 100),
    });

    // Extract key terms from prompt
    const prompt = input.prompt.toLowerCase();
    const keywords: string[] = [];

    // Look for specific technology/operation keywords
    const keywordPatterns = [
      'deploy',
      'database',
      'git',
      'mcp',
      'authentication',
      'error',
      'bug',
      'fix',
      'optimize',
      'implement',
      'architecture',
      'design',
    ];

    keywordPatterns.forEach(keyword => {
      if (prompt.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    // If no specific keywords, use full prompt for search
    const searchQuery = keywords.length > 0 ? keywords.join(' ') : input.prompt;

    logger.debug('Searching memories', { searchQuery, keywords });

    // Search for relevant memories
    const memories = await searchMemory(searchQuery, undefined, 3);

    if (memories.length === 0) {
      logger.debug('No relevant memories found');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    // Format memories for context
    const contextMessage = formatMemoryForContext(memories);

    logger.info('Injecting context from memories', {
      memoriesFound: memories.length,
      topRelevance: memories[0]?.score || 0,
    });

    const output: HookOutput = {
      continue: true,
      contextMessage,
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    logger.error('UserPromptSubmit hook failed', error as Error);

    // On error, continue without context injection
    const output: HookOutput = { continue: true };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export default main;
