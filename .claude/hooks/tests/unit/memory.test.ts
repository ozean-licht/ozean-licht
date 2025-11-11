/**
 * Unit tests for memory utility
 */

import {
  assessComplexity,
  categorizeContent,
  extractTags,
  shouldAutoSave,
  createPattern,
} from '../../src/utils/memory';

describe('Memory Utilities', () => {
  describe('assessComplexity', () => {
    it('should assess low complexity for simple content', () => {
      const content = 'Simple text';
      expect(assessComplexity(content)).toBe('low');
    });

    it('should assess medium complexity for structured content', () => {
      const content = 'First, do this. Then, do that. Database configuration needed.';
      expect(assessComplexity(content)).toBe('medium');
    });

    it('should assess high complexity for detailed technical content', () => {
      const content = `
        Step 1: Configure database connection pool
        Step 2: Deploy application to production
        \`\`\`typescript
        const config = { pool: 10 };
        \`\`\`
        Step 3: Verify deployment with health checks
      `;
      expect(assessComplexity(content)).toBe('high');
    });
  });

  describe('categorizeContent', () => {
    it('should categorize error content', () => {
      expect(categorizeContent('Fixed the error in authentication')).toBe('error');
      expect(categorizeContent('Bug in database connection')).toBe('error');
    });

    it('should categorize decision content', () => {
      expect(categorizeContent('Decided to use TypeScript for this project')).toBe('decision');
      expect(categorizeContent('Architecture decision: use microservices')).toBe('decision');
    });

    it('should categorize solution content', () => {
      expect(categorizeContent('Solved the timeout issue by increasing pool size')).toBe('solution');
      expect(categorizeContent('Workaround for the connection problem')).toBe('solution');
    });

    it('should categorize workflow content', () => {
      expect(categorizeContent('Workflow: deploy then test then monitor')).toBe('workflow');
      expect(categorizeContent('Step 1 process, then step 2 validation')).toBe('workflow');
    });

    it('should default to pattern for general content', () => {
      expect(categorizeContent('Use connection pooling for better performance')).toBe('pattern');
    });
  });

  describe('extractTags', () => {
    it('should extract technology tags', () => {
      const content = 'Using TypeScript and PostgreSQL with Docker';
      const tags = extractTags(content);
      expect(tags).toContain('typescript');
      expect(tags).toContain('postgres');
      expect(tags).toContain('docker');
    });

    it('should extract operation tags', () => {
      const content = 'Deploy the application and run tests';
      const tags = extractTags(content);
      expect(tags).toContain('deploy');
      expect(tags).toContain('test');
    });

    it('should return empty array for content without tags', () => {
      const content = 'Some random text without technical terms';
      const tags = extractTags(content);
      expect(tags.length).toBe(0);
    });
  });

  describe('shouldAutoSave', () => {
    it('should auto-save high complexity patterns', () => {
      const pattern = createPattern('Complex content with multiple steps', 'pattern', {
        complexity: 'high',
      });
      expect(shouldAutoSave(pattern, 'medium')).toBe(true);
      expect(shouldAutoSave(pattern, 'high')).toBe(true);
    });

    it('should not auto-save low complexity patterns when threshold is medium', () => {
      const pattern = createPattern('Simple note', 'pattern', { complexity: 'low' });
      expect(shouldAutoSave(pattern, 'medium')).toBe(false);
    });

    it('should auto-save low complexity patterns when threshold is low', () => {
      const pattern = createPattern('Simple note', 'pattern', { complexity: 'low' });
      expect(shouldAutoSave(pattern, 'low')).toBe(true);
    });
  });

  describe('createPattern', () => {
    it('should create a valid memory pattern', () => {
      const pattern = createPattern(
        'Test pattern content',
        'decision',
        { customField: 'value' }
      );

      expect(pattern.content).toBe('Test pattern content');
      expect(pattern.category).toBe('decision');
      expect(pattern.user_id).toBe('agent_claude_code');
      expect(pattern.metadata.source).toBe('claude-hooks');
      expect(pattern.metadata.customField).toBe('value');
      expect(pattern.metadata.timestamp).toBeDefined();
      expect(pattern.metadata.complexity).toBeDefined();
      expect(pattern.metadata.tags).toBeDefined();
    });
  });
});
