#!/usr/bin/env tsx
/**
 * Stop Hook Handler
 * Saves session insights to memory when conversation stops
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput } from '../types';
import { saveMemory, categorizeContent } from '../utils/memory';

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('Stop hook triggered', { inputLength: stdinBuffer.length });

    // Parse input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    logger.info('Processing conversation stop');

    // Extract context or conversation history if available
    const context = input.context || {};
    const hasSignificantContext = Object.keys(context).length > 0;

    if (!hasSignificantContext) {
      logger.debug('No significant context to save');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    // Check if auto-save is enabled
    const autoSaveEnabled = process.env.MEMORY_AUTO_SAVE !== 'false';

    if (!autoSaveEnabled) {
      logger.debug('Memory auto-save is disabled');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    // Generate session summary
    const summary = `Session completed. Context: ${JSON.stringify(context, null, 2)}`;
    const category = categorizeContent(summary);

    logger.info('Saving session summary', { category, contextKeys: Object.keys(context) });

    // Save to memory
    const saved = await saveMemory(summary, category, {
      hookType: 'stop',
      timestamp: new Date().toISOString(),
      sessionId: input.sessionId,
    });

    if (saved) {
      logger.info('Session summary saved successfully');
    } else {
      logger.warn('Failed to save session summary');
    }

    // Return success
    const output: HookOutput = {
      continue: true,
      contextMessage: 'Session insights saved to institutional memory',
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    logger.error('Stop hook failed', error as Error);

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
