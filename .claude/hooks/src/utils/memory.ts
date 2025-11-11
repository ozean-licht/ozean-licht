/**
 * Memory helper utilities for pattern detection and auto-saving
 */

import { mcpClient } from './mcp-client';
import { logger } from './logger';
import { MemoryPattern, MemoryCategory } from '../types';

/**
 * Pattern complexity heuristics
 */
export function assessComplexity(content: string): 'low' | 'medium' | 'high' {
  const length = content.length;
  const hasMultipleSteps = /step \d+|first|second|third|then|next|finally/i.test(content);
  const hasCodeBlocks = /```|`[^`]+`/.test(content);
  const hasTechnicalTerms = /database|deployment|authentication|configuration|architecture/i.test(content);

  if (length > 500 || (hasMultipleSteps && hasCodeBlocks && hasTechnicalTerms)) {
    return 'high';
  }
  if (length > 200 || (hasMultipleSteps && (hasCodeBlocks || hasTechnicalTerms))) {
    return 'medium';
  }
  return 'low';
}

/**
 * Auto-categorize memory based on content
 */
export function categorizeContent(content: string): MemoryCategory {
  const lower = content.toLowerCase();

  // Error patterns
  if (
    lower.includes('error') ||
    lower.includes('fix') ||
    lower.includes('bug') ||
    lower.includes('issue') ||
    lower.includes('problem')
  ) {
    return 'error';
  }

  // Decision patterns
  if (
    lower.includes('decided') ||
    lower.includes('chose') ||
    lower.includes('selected') ||
    lower.includes('architecture') ||
    lower.includes('design decision') ||
    lower.includes('trade-off')
  ) {
    return 'decision';
  }

  // Solution patterns
  if (
    lower.includes('solved') ||
    lower.includes('resolved') ||
    lower.includes('workaround') ||
    lower.includes('solution')
  ) {
    return 'solution';
  }

  // Workflow patterns
  if (
    lower.includes('workflow') ||
    lower.includes('process') ||
    lower.includes('sequence') ||
    lower.includes('pipeline') ||
    (lower.includes('step') && (lower.includes('then') || lower.includes('next')))
  ) {
    return 'workflow';
  }

  // Default to pattern
  return 'pattern';
}

/**
 * Extract tags from content
 */
export function extractTags(content: string): string[] {
  const tags: Set<string> = new Set();

  // Technology tags
  const techPatterns = [
    /typescript/gi,
    /javascript/gi,
    /node\.?js/gi,
    /react/gi,
    /next\.?js/gi,
    /postgres/gi,
    /docker/gi,
    /kubernetes/gi,
    /git/gi,
    /mcp/gi,
    /coolify/gi,
    /mem0/gi,
  ];

  techPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      tags.add(matches[0].toLowerCase());
    }
  });

  // Operation tags
  const operationPatterns = [
    /deploy/gi,
    /build/gi,
    /test/gi,
    /debug/gi,
    /optimize/gi,
    /refactor/gi,
    /migrate/gi,
    /backup/gi,
  ];

  operationPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      tags.add(matches[0].toLowerCase());
    }
  });

  return Array.from(tags);
}

/**
 * Check if memory should be auto-saved
 */
export function shouldAutoSave(pattern: MemoryPattern, minComplexity: 'low' | 'medium' | 'high' = 'medium'): boolean {
  const complexity = pattern.metadata.complexity || assessComplexity(pattern.content);

  const complexityMap = { low: 1, medium: 2, high: 3 };
  const minLevel = complexityMap[minComplexity];
  const patternLevel = complexityMap[complexity];

  return patternLevel >= minLevel;
}

/**
 * Save memory pattern to Mem0
 */
export async function saveMemory(
  content: string,
  category?: MemoryCategory,
  metadata?: Record<string, any>
): Promise<boolean> {
  try {
    const memoryCategory = category || categorizeContent(content);
    const complexity = assessComplexity(content);
    const tags = extractTags(content);

    const userId = process.env.MEMORY_USER_ID || 'agent_claude_code';

    const memoryMetadata = {
      category: memoryCategory,
      complexity,
      tags,
      source: 'claude-hooks',
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    logger.info('Saving memory to Mem0', {
      category: memoryCategory,
      complexity,
      tags,
      contentLength: content.length,
    });

    const response = await mcpClient.saveMemory(content, userId, memoryMetadata);

    if (response.status === 'success') {
      logger.info('Memory saved successfully', {
        memoryId: response.data?.memory?.id,
        category: memoryCategory,
      });
      return true;
    } else {
      logger.warn('Failed to save memory', { error: response.error });
      return false;
    }
  } catch (error) {
    logger.error('Error saving memory', error as Error);
    return false;
  }
}

/**
 * Search for relevant memories
 */
export async function searchMemory(
  query: string,
  userId?: string,
  limit: number = 10
): Promise<any[]> {
  try {
    logger.debug('Searching memories', { query, limit });

    const response = await mcpClient.searchMemory(query, userId, limit);

    if (response.status === 'success' && response.data?.results) {
      logger.info('Memory search completed', {
        query,
        resultsFound: response.data.results.length,
      });
      return response.data.results;
    } else {
      logger.warn('Memory search returned no results', { query });
      return [];
    }
  } catch (error) {
    logger.error('Error searching memories', error as Error);
    return [];
  }
}

/**
 * Get all memories for a user
 */
export async function getMemories(
  userId: string = 'agent_claude_code',
  limit: number = 50
): Promise<any[]> {
  try {
    logger.debug('Getting memories', { userId, limit });

    const response = await mcpClient.getMemories(userId, limit);

    if (response.status === 'success' && response.data?.memories) {
      logger.info('Retrieved memories', {
        userId,
        count: response.data.memories.length,
      });
      return response.data.memories;
    } else {
      logger.warn('No memories found for user', { userId });
      return [];
    }
  } catch (error) {
    logger.error('Error getting memories', error as Error);
    return [];
  }
}

/**
 * Check for duplicate memories before saving
 */
export async function isDuplicate(content: string, userId?: string): Promise<boolean> {
  try {
    const results = await searchMemory(content, userId, 3);

    // Check if any result has very high similarity (score > 0.95)
    const hasDuplicate = results.some((result) => result.score > 0.95);

    if (hasDuplicate) {
      logger.debug('Duplicate memory detected', { content: content.substring(0, 100) });
    }

    return hasDuplicate;
  } catch (error) {
    logger.error('Error checking for duplicates', error as Error);
    return false; // On error, allow saving
  }
}

/**
 * Format memory for display
 */
export function formatMemoryForContext(memories: any[]): string {
  if (memories.length === 0) {
    return '';
  }

  const formatted = memories.map((memory, index) => {
    const relevance = memory.score ? `(relevance: ${(memory.score * 100).toFixed(0)}%)` : '';
    const category = memory.metadata?.category ? `[${memory.metadata.category}]` : '';
    return `${index + 1}. ${category} ${memory.content} ${relevance}`;
  }).join('\n\n');

  return `## Relevant Memories\n\n${formatted}`;
}

/**
 * Create structured memory pattern
 */
export function createPattern(
  content: string,
  category: MemoryCategory,
  additionalMetadata?: Record<string, any>
): MemoryPattern {
  const complexity = assessComplexity(content);
  const tags = extractTags(content);
  const userId = process.env.MEMORY_USER_ID || 'agent_claude_code';

  return {
    content,
    category,
    user_id: userId,
    metadata: {
      source: 'claude-hooks',
      timestamp: new Date().toISOString(),
      complexity,
      tags,
      ...additionalMetadata,
    },
  };
}

export default {
  assessComplexity,
  categorizeContent,
  extractTags,
  shouldAutoSave,
  saveMemory,
  searchMemory,
  getMemories,
  isDuplicate,
  formatMemoryForContext,
  createPattern,
};
