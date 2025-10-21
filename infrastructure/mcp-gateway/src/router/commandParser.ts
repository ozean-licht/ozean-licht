import { ParsedCommand } from '../mcp/protocol/types';
import { ValidationError } from '../utils/errors';

export class CommandParser {
  private readonly commandPattern = /^\/mcp-(\w+)\s+(.+)$/;
  private readonly dbPattern = /^(kids-ascension-db|ozean-licht-db|ka-db|ol-db)\s+(.+)$/;

  /**
   * Parse a slash command into structured components
   * Examples:
   * - /mcp-postgres kids-ascension-db list tables
   * - /mcp-mem0 remember "User prefers TypeScript"
   * - /mcp-github create-pr "feat: Add feature" "Description"
   */
  public parse(command: string): ParsedCommand {
    // Remove extra whitespace and trim
    command = command.trim().replace(/\s+/g, ' ');

    // Match the command pattern
    const match = command.match(this.commandPattern);
    if (!match) {
      throw new ValidationError(
        `Invalid command format. Expected: /mcp-[service] [args]`,
        { command }
      );
    }

    const [, service, argsString] = match;

    // Parse arguments based on service type
    const parsed = this.parseServiceArgs(service.toLowerCase(), argsString);

    return {
      service: service.toLowerCase(),
      ...parsed,
    };
  }

  private parseServiceArgs(service: string, argsString: string): Omit<ParsedCommand, 'service'> {
    switch (service) {
      case 'postgres':
      case 'postgresql':
        return this.parsePostgresArgs(argsString);

      case 'mem0':
      case 'memory':
        return this.parseMem0Args(argsString);

      case 'cloudflare':
      case 'cf':
        return this.parseCloudflareArgs(argsString);

      case 'github':
      case 'gh':
        return this.parseGithubArgs(argsString);

      case 'n8n':
      case 'workflow':
        return this.parseN8nArgs(argsString);

      default:
        return this.parseGenericArgs(argsString);
    }
  }

  private parsePostgresArgs(argsString: string): Omit<ParsedCommand, 'service'> {
    // Check if it starts with a database name
    const dbMatch = argsString.match(this.dbPattern);
    if (!dbMatch) {
      throw new ValidationError(
        'PostgreSQL commands require a database name (kids-ascension-db or ozean-licht-db)',
        { args: argsString }
      );
    }

    const [, database, remainingArgs] = dbMatch;
    const normalizedDb = this.normalizeDatabase(database);

    // Parse the operation and arguments
    const parts = this.splitArgs(remainingArgs);
    if (parts.length === 0) {
      throw new ValidationError('Operation required', { args: remainingArgs });
    }

    // Handle multi-word operations
    let operation = parts[0];
    let args = parts.slice(1);

    // Special cases for common operations
    if (operation === 'list' && parts[1] === 'tables') {
      operation = 'list-tables';
      args = parts.slice(2);
    } else if (operation === 'describe' || operation === 'desc') {
      operation = 'describe-table';
      args = parts.slice(1);
    } else if (operation === 'query' || operation === 'select') {
      operation = 'query';
      // Join remaining args as SQL query
      args = [parts.slice(1).join(' ')];
    }

    return {
      database: normalizedDb,
      operation,
      args,
      rawArgs: remainingArgs,
    };
  }

  private parseMem0Args(argsString: string): Omit<ParsedCommand, 'service'> {
    const parts = this.splitArgs(argsString);
    if (parts.length === 0) {
      throw new ValidationError('Operation required for Mem0', { args: argsString });
    }

    const operation = parts[0];
    const args = parts.slice(1);

    // For operations that take full text, join the args
    if (['remember', 'search', 'store'].includes(operation)) {
      return {
        operation,
        args: [args.join(' ')],
        rawArgs: argsString,
      };
    }

    return {
      operation,
      args,
      rawArgs: argsString,
    };
  }

  private parseCloudflareArgs(argsString: string): Omit<ParsedCommand, 'service'> {
    const parts = this.splitArgs(argsString);
    if (parts.length < 2) {
      throw new ValidationError(
        'Cloudflare commands require a resource and action',
        { args: argsString }
      );
    }

    // First part is resource (dns, stream, workers, etc.)
    // Second part is action
    const resource = parts[0];
    const action = parts[1];
    const operation = `${resource}-${action}`;
    const args = parts.slice(2);

    return {
      operation,
      args,
      rawArgs: argsString,
    };
  }

  private parseGithubArgs(argsString: string): Omit<ParsedCommand, 'service'> {
    const parts = this.splitArgs(argsString);
    if (parts.length === 0) {
      throw new ValidationError('Operation required for GitHub', { args: argsString });
    }

    // Convert hyphenated operations
    const operation = parts[0].replace(/_/g, '-');
    const args = parts.slice(1);

    return {
      operation,
      args,
      rawArgs: argsString,
    };
  }

  private parseN8nArgs(argsString: string): Omit<ParsedCommand, 'service'> {
    const parts = this.splitArgs(argsString);
    if (parts.length === 0) {
      throw new ValidationError('Operation required for N8N', { args: argsString });
    }

    const operation = parts[0];
    let args = parts.slice(1);

    // For execute operation with JSON data
    if (operation === 'execute' && args.length >= 2) {
      const workflowId = args[0];
      const jsonData = args.slice(1).join(' ');
      args = [workflowId, jsonData];
    }

    return {
      operation,
      args,
      rawArgs: argsString,
    };
  }

  private parseGenericArgs(argsString: string): Omit<ParsedCommand, 'service'> {
    const parts = this.splitArgs(argsString);

    if (parts.length === 0) {
      return {
        operation: 'help',
        args: [],
        rawArgs: argsString,
      };
    }

    return {
      operation: parts[0],
      args: parts.slice(1),
      rawArgs: argsString,
    };
  }

  /**
   * Split arguments respecting quoted strings
   */
  private splitArgs(argsString: string): string[] {
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      if ((char === '"' || char === "'") && (i === 0 || argsString[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = '';
        } else {
          current += char;
        }
      } else if (char === ' ' && !inQuotes) {
        if (current.length > 0) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current.length > 0) {
      args.push(current);
    }

    return args;
  }

  /**
   * Normalize database names
   */
  private normalizeDatabase(database: string): string {
    const map: Record<string, string> = {
      'kids-ascension-db': 'kids-ascension',
      'ka-db': 'kids-ascension',
      'ozean-licht-db': 'ozean-licht',
      'ol-db': 'ozean-licht',
    };

    return map[database.toLowerCase()] || database.toLowerCase();
  }
}

export const commandParser = new CommandParser();