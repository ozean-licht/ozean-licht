#!/usr/bin/env tsx
/**
 * PostToolUse Hook Handler
 * Detects patterns and auto-saves valuable learnings
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput, MemoryCategory } from '../types';
import { saveMemory, shouldAutoSave, createPattern } from '../utils/memory';

// Pattern detection rules
function detectDeploymentPattern(input: any): boolean {
  const tool = input.tool?.toLowerCase() || '';
  const result = JSON.stringify(input.result || '').toLowerCase();

  return (
    (tool.includes('deploy') || tool.includes('coolify')) &&
    result.includes('success')
  );
}

function detectErrorResolutionPattern(input: any): boolean {
  const result = JSON.stringify(input.result || '').toLowerCase();
  const hadError = input.error !== undefined && input.error !== null;

  // If there was an error but now result is successful
  return hadError && result.includes('success');
}

function detectDatabasePattern(input: any): boolean {
  const tool = input.tool?.toLowerCase() || '';
  const command = JSON.stringify(input.args || '').toLowerCase();

  return (
    tool.includes('postgres') ||
    tool.includes('database') ||
    command.includes('sql') ||
    command.includes('migration')
  );
}

function detectGitWorkflowPattern(input: any): boolean {
  const tool = input.tool?.toLowerCase() || '';
  const command = JSON.stringify(input.args || '').toLowerCase();

  return (
    tool.includes('git') &&
    (command.includes('commit') || command.includes('push') || command.includes('merge'))
  );
}

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('PostToolUse hook triggered', { inputLength: stdinBuffer.length });

    // Parse and validate input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    if (!input.tool) {
      logger.debug('No tool specified in input');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    logger.info('Analyzing tool execution', {
      tool: input.tool,
      hasResult: !!input.result,
      hasError: !!input.error,
    });

    // Check if auto-save is enabled
    const autoSaveEnabled = process.env.MEMORY_AUTO_SAVE !== 'false';

    if (!autoSaveEnabled) {
      logger.debug('Memory auto-save is disabled');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    // Detect patterns
    let patternDetected = false;
    let category: MemoryCategory = 'pattern';
    let content = '';

    if (detectDeploymentPattern(input)) {
      patternDetected = true;
      category = 'workflow';
      content = `Successful deployment using ${input.tool}. Command: ${JSON.stringify(input.args, null, 2)}`;
      logger.info('Deployment pattern detected', { tool: input.tool });
    } else if (detectErrorResolutionPattern(input)) {
      patternDetected = true;
      category = 'solution';
      content = `Error resolution for ${input.tool}. Error: ${JSON.stringify(input.error)}. Resolution: ${JSON.stringify(input.result)}`;
      logger.info('Error resolution pattern detected', { tool: input.tool });
    } else if (detectDatabasePattern(input)) {
      patternDetected = true;
      category = 'pattern';
      content = `Database operation using ${input.tool}. Operation: ${JSON.stringify(input.args)}`;
      logger.info('Database pattern detected', { tool: input.tool });
    } else if (detectGitWorkflowPattern(input)) {
      patternDetected = true;
      category = 'workflow';
      content = `Git workflow: ${input.tool} with ${JSON.stringify(input.args)}`;
      logger.info('Git workflow pattern detected', { tool: input.tool });
    }

    // If pattern detected, check if it should be saved
    if (patternDetected && content) {
      const pattern = createPattern(content, category, {
        tool: input.tool,
        timestamp: new Date().toISOString(),
        hookType: 'post-tool-use',
      });

      // Check complexity threshold
      if (shouldAutoSave(pattern)) {
        logger.info('Attempting to save pattern', {
          category,
          complexity: pattern.metadata.complexity,
        });

        const saved = await saveMemory(content, category, pattern.metadata);

        if (saved) {
          logger.info('Pattern saved successfully', { category });
        } else {
          logger.warn('Failed to save pattern', { category });
        }
      } else {
        logger.debug('Pattern complexity below threshold, not saving', {
          complexity: pattern.metadata.complexity,
        });
      }
    } else {
      logger.debug('No significant pattern detected', { tool: input.tool });
    }

    // Always continue execution
    const output: HookOutput = { continue: true };
    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    logger.error('PostToolUse hook failed', error as Error);

    // On error, continue execution
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
