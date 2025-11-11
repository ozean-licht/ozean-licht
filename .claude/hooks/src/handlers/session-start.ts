#!/usr/bin/env tsx
/**
 * SessionStart Hook Handler
 * Checks service health and initializes session environment
 */

import * as fs from 'fs';
import { logger } from '../utils/logger';
import { mcpClient } from '../utils/mcp-client';
import { HookInputSchema, HookOutput, ServiceHealth } from '../types';
import { isGitRepository } from '../utils/git';

async function main() {
  try {
    // Read stdin
    const stdinBuffer = fs.readFileSync(0, 'utf-8');
    logger.debug('SessionStart hook triggered', { inputLength: stdinBuffer.length });

    // Parse input
    const input = HookInputSchema.parse(JSON.parse(stdinBuffer));

    logger.info('Initializing session', { sessionId: input.sessionId });

    // Check service health
    const healthChecks: ServiceHealth[] = [];

    // Check MCP Gateway
    try {
      const mcpHealth = await mcpClient.checkHealth();
      healthChecks.push(mcpHealth);
      logger.info('MCP Gateway health check', { status: mcpHealth.status });
    } catch (error) {
      logger.error('MCP Gateway health check failed', error as Error);
      healthChecks.push({
        service: 'mcp-gateway',
        status: 'unhealthy',
        endpoint: process.env.MCP_GATEWAY_URL || 'unknown',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }

    // Check Git repository
    const isGitRepo = isGitRepository();
    logger.info('Git repository check', { isGitRepo });

    // Build context message
    const healthySvcs = healthChecks.filter(h => h.status === 'healthy').length;
    const totalSvcs = healthChecks.length;

    const contextLines: string[] = [
      '## Session Initialized',
      '',
      `**Services:** ${healthySvcs}/${totalSvcs} healthy`,
    ];

    // Add unhealthy services
    const unhealthySvcs = healthChecks.filter(h => h.status !== 'healthy');
    if (unhealthySvcs.length > 0) {
      contextLines.push('', '**Issues:**');
      unhealthySvcs.forEach(svc => {
        contextLines.push(`- ⚠️ ${svc.service}: ${svc.status} - ${svc.error || 'Unknown error'}`);
      });
    }

    if (!isGitRepo) {
      contextLines.push('', '⚠️ Not in a git repository');
    }

    contextLines.push('', `Session ID: ${input.sessionId || 'unknown'}`);
    contextLines.push(`Started: ${new Date().toISOString()}`);

    const output: HookOutput = {
      continue: true,
      contextMessage: contextLines.join('\n'),
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    logger.error('SessionStart hook failed', error as Error);

    // On error, continue with warning
    const output: HookOutput = {
      continue: true,
      contextMessage: 'Session initialization encountered errors but will continue',
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
