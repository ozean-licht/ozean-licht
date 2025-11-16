import { Plugin } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import type { IterateRequest, IterateResponse } from './types';

interface PluginOptions {
  projectRoot?: string;
  allowedPaths?: string[];
  mcpGatewayUrl?: string;
}

export function aiIterationPlugin(options: PluginOptions = {}): Plugin {
  let designSystem = '';
  let projectRoot = options.projectRoot || process.cwd();

  // MCP Gateway URL - defaults to local development
  const mcpGatewayUrl = options.mcpGatewayUrl ||
    process.env.MCP_GATEWAY_URL ||
    'http://localhost:8100';

  console.log(`✓ AI Iteration: Using MCP Gateway at ${mcpGatewayUrl}`);

  // Define allowed component directories (whitelist for security)
  const allowedPaths = options.allowedPaths || [
    path.join(projectRoot, 'shared/ui/src'),
    path.join(projectRoot, 'apps/admin/components'),
    path.join(projectRoot, 'apps/kids-ascension/components'),
    path.join(projectRoot, 'apps/ozean-licht/components'),
  ];

  /**
   * Validates that a component path is safe to write to
   * Prevents path traversal attacks
   */
  function validateComponentPath(componentPath: string): { valid: boolean; error?: string } {
    // Resolve to absolute path
    const absolutePath = path.resolve(componentPath);

    // Check if path is within allowed directories
    const isAllowed = allowedPaths.some(allowedPath => {
      const resolvedAllowedPath = path.resolve(allowedPath);
      return absolutePath.startsWith(resolvedAllowedPath);
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Path not allowed: ${componentPath}. Must be within: ${allowedPaths.join(', ')}`
      };
    }

    // Check file extension
    const ext = path.extname(absolutePath);
    if (!['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
      return {
        valid: false,
        error: `Invalid file extension: ${ext}. Only .tsx, .ts, .jsx, .js allowed`
      };
    }

    return { valid: true };
  }

  /**
   * Basic TypeScript syntax validation
   * Checks for obvious syntax errors before writing
   */
  function validateTypeScript(code: string): { valid: boolean; error?: string } {
    // Check for balanced braces
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { valid: false, error: 'Unbalanced braces in generated code' };
    }

    // Check for balanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      return { valid: false, error: 'Unbalanced parentheses in generated code' };
    }

    // Check for balanced brackets
    const openBrackets = (code.match(/\[/g) || []).length;
    const closeBrackets = (code.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      return { valid: false, error: 'Unbalanced brackets in generated code' };
    }

    // Check for React import (required for TSX)
    if (!code.includes('import') || !code.includes('React')) {
      return { valid: false, error: 'Missing React import in generated code' };
    }

    // Check for export statement
    if (!code.includes('export')) {
      return { valid: false, error: 'Missing export statement in generated code' };
    }

    return { valid: true };
  }

  return {
    name: 'ai-iteration',

    async buildStart() {
      // Load design system once at startup
      const designSystemPath = path.join(projectRoot, 'design-system.md');
      try {
        designSystem = await fs.readFile(designSystemPath, 'utf-8');
        console.log('✓ AI Iteration: Design system loaded');
      } catch (error) {
        console.error('⚠ AI Iteration: Failed to load design system:', error);
        designSystem = '';
      }

      console.log('✓ AI Iteration: Plugin initialized');
      console.log(`  Project root: ${projectRoot}`);
      console.log(`  Allowed paths: ${allowedPaths.length} directories`);
    },

    configureServer(server) {
      // Endpoint to fetch component source code
      server.middlewares.use('/__ai-get-component', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
          try {
            const { componentPath } = JSON.parse(body);

            // Validate path before reading
            const validation = validateComponentPath(componentPath);
            if (!validation.valid) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: validation.error }));
              return;
            }

            // Read component file
            const code = await fs.readFile(componentPath, 'utf-8');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, code }));
          } catch (error: any) {
            console.error('Get component error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      });

      // Endpoint to iterate on component with AI
      server.middlewares.use('/__ai-iterate', async (req, res) => {
        // Only handle POST requests
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        // Parse request body
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
          try {
            const { componentPath, currentCode, prompt }: IterateRequest = JSON.parse(body);

            // Validate path before writing
            const pathValidation = validateComponentPath(componentPath);
            if (!pathValidation.valid) {
              res.writeHead(403, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: pathValidation.error }));
              return;
            }

            // Call Claude with design system context
            const response = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 4000,
              messages: [{
                role: 'user',
                content: buildPrompt(designSystem, currentCode, prompt)
              }]
            });

            // Extract text from response (handle both text and other content types)
            const firstContent = response.content[0];
            const responseText = firstContent.type === 'text' ? firstContent.text : '';
            const newCode = extractCode(responseText);

            // Validate TypeScript syntax before writing
            const tsValidation = validateTypeScript(newCode);
            if (!tsValidation.valid) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                error: `TypeScript validation failed: ${tsValidation.error}`
              }));
              return;
            }

            // Write to file - Vite HMR will automatically detect and reload
            await fs.writeFile(componentPath, newCode, 'utf-8');

            // Small delay to ensure Vite picks up the change
            await new Promise(resolve => setTimeout(resolve, 100));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: 'Component updated successfully'
            } as IterateResponse));

          } catch (error: any) {
            console.error('AI iteration error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: error.message
            } as IterateResponse));
          }
        });
      });
    }
  };
}

function buildPrompt(designSystem: string, currentCode: string, userPrompt: string): string {
  // Extract first 2000 chars of design system for context
  const designRules = designSystem.slice(0, 2000);

  return `You are modifying a React component. Follow these design rules strictly:

${designRules}

Current component code:
\`\`\`tsx
${currentCode}
\`\`\`

User request: ${userPrompt}

CRITICAL INSTRUCTIONS:
1. Return ONLY the complete updated component code
2. No explanations, no markdown formatting, no \`\`\`tsx blocks
3. Start with imports, end with export
4. Preserve existing functionality unless explicitly asked to change
5. Follow the Ozean Licht design system (turquoise #0ec2bc, glass morphism, Montserrat font)

OUTPUT:`;
}

function extractCode(response: string): string {
  // Remove markdown code blocks if Claude included them
  let code = response.trim();

  // Remove ```tsx or ```typescript or ``` wrappers
  code = code.replace(/^```(?:tsx|typescript|ts|jsx|javascript|js)?\n/g, '');
  code = code.replace(/\n```$/g, '');

  return code.trim();
}
