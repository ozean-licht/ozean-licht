#!/usr/bin/env tsx
/**
 * PreCompact Hook Handler
 * Identifies critical information to preserve before context compaction
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput } from '../types';

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('PreCompact hook triggered', { inputLength: stdinBuffer.length });

    // Parse input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    logger.info('Analyzing context for compaction');

    // Extract context if available
    const context = input.context || {};
    const contextStr = JSON.stringify(context);

    // Identify critical information patterns
    const criticalPatterns = [
      { pattern: /error|exception|failed/i, type: 'Error Messages' },
      { pattern: /deployed|deployment|build/i, type: 'Deployment Info' },
      { pattern: /decision|chose|selected/i, type: 'Decisions Made' },
      { pattern: /\/[a-z-]+\/[a-z-]+\.[a-z]+/g, type: 'File Paths' },
      { pattern: /https?:\/\/[^\s]+/g, type: 'URLs' },
      { pattern: /TODO|FIXME|NOTE/i, type: 'Action Items' },
    ];

    const preserveItems: string[] = [];

    criticalPatterns.forEach(({ pattern, type }) => {
      if (pattern.test(contextStr)) {
        preserveItems.push(type);
      }
    });

    if (preserveItems.length === 0) {
      logger.debug('No critical information identified for preservation');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    // Build guidance message
    const contextMessage = [
      '## Context Compaction Guidance',
      '',
      '**Preserve the following:**',
      ...preserveItems.map(item => `- ${item}`),
      '',
      '**Safe to compact:**',
      '- Verbose tool outputs',
      '- Repeated information',
      '- Interim discussion steps',
    ].join('\n');

    logger.info('Compaction guidance provided', { preserveItems });

    const output: HookOutput = {
      continue: true,
      contextMessage,
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    logger.error('PreCompact hook failed', error as Error);

    // On error, continue without guidance
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
