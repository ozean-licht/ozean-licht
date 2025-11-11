#!/usr/bin/env tsx
/**
 * SessionEnd Hook Handler
 * Generates session summary and cleanup
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput } from '../types';

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('SessionEnd hook triggered', { inputLength: stdinBuffer.length });

    // Parse input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    logger.info('Ending session', { sessionId: input.sessionId });

    // Build session summary
    const contextLines: string[] = [
      '## Session Completed',
      '',
      `Session ID: ${input.sessionId || 'unknown'}`,
      `Ended: ${new Date().toISOString()}`,
    ];

    // Add metadata if available
    if (input.metadata) {
      const keys = Object.keys(input.metadata);
      if (keys.length > 0) {
        contextLines.push('', '**Metadata:**');
        keys.forEach(key => {
          contextLines.push(`- ${key}: ${input.metadata![key]}`);
        });
      }
    }

    logger.info('Session ended successfully');

    const output: HookOutput = {
      continue: true,
      contextMessage: contextLines.join('\n'),
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    logger.error('SessionEnd hook failed', error as Error);

    // On error, continue
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
