/**
 * Agent SDK Mock
 *
 * Mock Claude Agent SDK responses for integration testing.
 * Simulates agent execution without actual API calls.
 */

import type { SlashCommand, AgentExecutionResult } from '@/modules/adw/types.js';

export interface MockAgentResponse {
  success: boolean;
  output: string;
  sessionId?: string;
  retryCode?: string;
  error?: Error;
}

/**
 * Agent SDK Mock Manager
 *
 * Stores and retrieves mock responses for agent execution calls.
 */
export class AgentSDKMock {
  private static responses: Map<string, MockAgentResponse> = new Map();
  private static errors: Map<string, Error> = new Map();
  private static executionHistory: Array<{
    command: SlashCommand;
    args: string[];
    timestamp: Date;
  }> = [];

  /**
   * Mock a successful agent response
   *
   * @param command - Slash command
   * @param response - Agent response data
   */
  static mockAgentResponse(command: SlashCommand, response: MockAgentResponse): void {
    this.responses.set(command, response);
  }

  /**
   * Mock an agent error
   *
   * @param command - Slash command
   * @param error - Error to throw
   */
  static mockAgentError(command: SlashCommand, error: Error): void {
    this.errors.set(command, error);
  }

  /**
   * Get mocked agent response
   *
   * @param command - Slash command
   * @returns Mocked response or null
   */
  static getResponse(command: SlashCommand): MockAgentResponse | null {
    return this.responses.get(command) || null;
  }

  /**
   * Get mocked agent error
   *
   * @param command - Slash command
   * @returns Mocked error or null
   */
  static getError(command: SlashCommand): Error | null {
    return this.errors.get(command) || null;
  }

  /**
   * Record an agent execution
   *
   * @param command - Slash command executed
   * @param args - Arguments passed
   */
  static recordExecution(command: SlashCommand, args: string[]): void {
    this.executionHistory.push({
      command,
      args,
      timestamp: new Date(),
    });
  }

  /**
   * Get execution history
   *
   * @returns Array of all recorded executions
   */
  static getExecutionHistory(): Array<{
    command: SlashCommand;
    args: string[];
    timestamp: Date;
  }> {
    return [...this.executionHistory];
  }

  /**
   * Check if a command was executed
   *
   * @param command - Slash command to check
   * @returns True if command was executed
   */
  static wasExecuted(command: SlashCommand): boolean {
    return this.executionHistory.some(entry => entry.command === command);
  }

  /**
   * Get number of times a command was executed
   *
   * @param command - Slash command to count
   * @returns Execution count
   */
  static getExecutionCount(command: SlashCommand): number {
    return this.executionHistory.filter(entry => entry.command === command).length;
  }

  /**
   * Clear all mocks and history
   */
  static reset(): void {
    this.responses.clear();
    this.errors.clear();
    this.executionHistory = [];
  }

  /**
   * Create a default success response
   *
   * @param command - Slash command
   * @param output - Output message
   * @returns Agent execution result
   */
  static createSuccessResponse(
    command: SlashCommand,
    output: string = 'Success'
  ): AgentExecutionResult {
    return {
      success: true,
      output,
      sessionId: `mock-session-${Date.now()}`,
      retryCode: 'NONE',
    };
  }

  /**
   * Create a default error response
   *
   * @param command - Slash command
   * @param errorMessage - Error message
   * @returns Agent execution result
   */
  static createErrorResponse(
    command: SlashCommand,
    errorMessage: string = 'Mock error'
  ): AgentExecutionResult {
    return {
      success: false,
      output: errorMessage,
      retryCode: 'EXECUTION_ERROR',
      error: new Error(errorMessage),
    };
  }
}
