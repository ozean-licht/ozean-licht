#!/usr/bin/env tsx
/**
 * PreToolUse Hook Handler
 * Validates tool usage before execution
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { HookInputSchema, HookOutput } from '../types';
import {
  validateToolExists,
  validateMCPGateway,
  validateDependencies,
  validateDestructiveOperation,
  validateSecretExposure,
  validateSensitivePaths,
  combineValidationResults,
} from '../utils/validation';

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('PreToolUse hook triggered', { inputLength: stdinBuffer.length });

    // Parse and validate input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    if (!input.tool) {
      logger.warn('No tool specified in input');
      const output: HookOutput = { continue: true };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    logger.info('Validating tool usage', { tool: input.tool });

    // Run validations
    const toolValidation = validateToolExists(input.tool);
    const dependencyValidation = validateDependencies(input.tool);
    const destructiveValidation = validateDestructiveOperation(input);
    const secretValidation = validateSecretExposure(input);
    const pathValidation = validateSensitivePaths(input);

    // MCP Gateway validation for MCP tools
    const mcpValidation = await validateMCPGateway(input.tool);

    // Combine all validation results
    const combined = combineValidationResults(
      toolValidation,
      dependencyValidation,
      destructiveValidation,
      secretValidation,
      pathValidation,
      mcpValidation
    );

    // Build output
    const output: HookOutput = {
      continue: combined.valid,
    };

    // Add context message if there are warnings or blockers
    if (combined.blockers.length > 0) {
      output.stopReason = combined.blockers.join('; ');
      output.contextMessage = [
        '## Validation Failed',
        '',
        '**Blockers:**',
        ...combined.blockers.map(b => `- ${b}`),
        '',
        combined.suggestions.length > 0
          ? '**Suggestions:**\n' + combined.suggestions.map(s => `- ${s}`).join('\n')
          : '',
      ].filter(Boolean).join('\n');

      logger.warn('Tool validation failed', {
        tool: input.tool,
        blockers: combined.blockers,
      });
    } else if (combined.warnings.length > 0) {
      output.contextMessage = [
        '## Validation Warnings',
        '',
        ...combined.warnings.map(w => `- ⚠️ ${w}`),
        '',
        combined.suggestions.length > 0
          ? combined.suggestions.map(s => `- 💡 ${s}`).join('\n')
          : '',
      ].filter(Boolean).join('\n');

      logger.info('Tool validation passed with warnings', {
        tool: input.tool,
        warnings: combined.warnings,
      });
    } else {
      logger.info('Tool validation passed', { tool: input.tool });
    }

    // Write output to stdout
    console.log(JSON.stringify(output));

    // Exit with appropriate code
    process.exit(combined.valid ? 0 : 2);
  } catch (error) {
    logger.error('PreToolUse hook failed', error as Error);

    // On error, allow execution to continue but log the issue
    const output: HookOutput = {
      continue: true,
      contextMessage: 'Pre-validation hook encountered an error but execution will continue',
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export default main;
