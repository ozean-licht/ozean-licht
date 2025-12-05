/**
 * Widget CORS utilities
 * Validates request origins against WIDGET_ALLOWED_ORIGINS environment variable
 */

/**
 * Get CORS headers with validated origin
 * Returns the requesting origin if it's in the whitelist, otherwise 'null'
 */
export function getWidgetCORSHeaders(requestOrigin: string | null): HeadersInit {
  const allowedOrigins = process.env.WIDGET_ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];

  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000');
  }

  const isAllowed = requestOrigin && allowedOrigins.some(allowed =>
    requestOrigin === allowed || requestOrigin.endsWith(allowed.replace('https://', '.'))
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? requestOrigin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Widget-Platform-Key, X-Widget-Session-Id',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Validate platform key against environment variables
 */
export function validatePlatformKey(platformKey: string): { valid: boolean; platform?: string } {
  const platforms = ['ozean_licht', 'kids_ascension'] as const;

  for (const platform of platforms) {
    const envKey = `WIDGET_PLATFORM_KEY_${platform.toUpperCase()}`;
    const expectedKey = process.env[envKey];

    if (expectedKey && platformKey === expectedKey) {
      return { valid: true, platform };
    }
  }

  return { valid: false };
}
