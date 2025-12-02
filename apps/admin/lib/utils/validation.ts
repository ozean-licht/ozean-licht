/**
 * Validation Utilities
 *
 * Helper functions for validating input and parsing errors
 */

/**
 * Validate if a string is a valid UUID v4
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Parse PostgreSQL errors into user-friendly messages
 */
export function parsePostgresError(error: any): { message: string; status: number } {
  // Check if error has a 'code' property (PostgreSQL error codes)
  if (error && typeof error === 'object' && 'code' in error) {
    const code = error.code as string;

    switch (code) {
      case '23505': // unique_violation
        return {
          message: 'A record with this value already exists',
          status: 409,
        };

      case '23503': // foreign_key_violation
        return {
          message: 'Referenced record does not exist',
          status: 400,
        };

      case '23502': // not_null_violation
        return {
          message: 'Required field is missing',
          status: 400,
        };

      case '23514': // check_violation
        return {
          message: 'Invalid value for field',
          status: 400,
        };

      case '22P02': // invalid_text_representation
        return {
          message: 'Invalid data format',
          status: 400,
        };

      case '42P01': // undefined_table
        return {
          message: 'Database table not found',
          status: 500,
        };

      case '42703': // undefined_column
        return {
          message: 'Database column not found',
          status: 500,
        };

      default:
        // Unknown PostgreSQL error
        return {
          message: 'Database operation failed',
          status: 500,
        };
    }
  }

  // Not a PostgreSQL error or no code property
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
}

/**
 * Validate UUID and return standardized error response data
 */
export function validateUUID(id: string, fieldName: string = 'ID'): { valid: boolean; error?: { message: string; status: number } } {
  if (!isValidUUID(id)) {
    return {
      valid: false,
      error: {
        message: `Invalid ${fieldName} format`,
        status: 400,
      },
    };
  }
  return { valid: true };
}
