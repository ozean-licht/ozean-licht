/**
 * Allowed HTML tags for rich text content
 * Based on TipTap editor capabilities
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'code', 'pre',
  'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr',
  'a', 'img', 'iframe',
];

/**
 * Allowed HTML attributes for rich text content
 */
const ALLOWED_ATTR_PATTERN = 'href|target|rel|src|alt|width|height|class|frameborder|allowfullscreen|allow';

/**
 * Simple server-side HTML sanitizer that strips dangerous tags
 * This avoids jsdom dependency issues during Next.js build
 */
function serverSanitize(html: string): string {
  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');

  // Remove tags not in allowed list
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const attrCleanPattern = new RegExp(`\\s+(?!(?:${ALLOWED_ATTR_PATTERN})=)[a-z-]+\\s*=\\s*["'][^"']*["']`, 'gi');
  sanitized = sanitized.replace(tagPattern, (match, tagName) => {
    if (ALLOWED_TAGS.includes(tagName.toLowerCase())) {
      // Clean attributes for allowed tags
      return match.replace(attrCleanPattern, '');
    }
    return '';
  });

  return sanitized;
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses regex-based sanitization on server to avoid jsdom dependency issues
 *
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  return serverSanitize(html);
}

/**
 * Validates that a URL is external and safe to fetch/embed
 * Prevents SSRF attacks by blocking private/internal IPs
 *
 * @param url - URL string to validate
 * @returns true if URL is safe to use, false otherwise
 */
export function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Block private/internal IPs and hostnames
    const hostname = parsed.hostname.toLowerCase();

    // Localhost variations
    if (hostname === 'localhost' || hostname === '0.0.0.0') {
      return false;
    }

    // Loopback addresses (127.0.0.0/8)
    if (hostname.startsWith('127.')) {
      return false;
    }

    // Private network ranges
    // 10.0.0.0/8
    if (hostname.startsWith('10.')) {
      return false;
    }

    // 192.168.0.0/16
    if (hostname.startsWith('192.168.')) {
      return false;
    }

    // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (hostname.startsWith('172.')) {
      const secondOctet = parseInt(hostname.split('.')[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) {
        return false;
      }
    }

    // Block common internal TLDs
    if (hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      return false;
    }

    return true;
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Validates that a file has an allowed extension
 *
 * @param filename - Name of the file to validate
 * @param allowedExtensions - Array of allowed extensions (e.g., ['.pdf', '.jpg'])
 * @returns true if file extension is allowed, false otherwise
 */
export function hasValidExtension(
  filename: string,
  allowedExtensions: string[]
): boolean {
  const lowerFilename = filename.toLowerCase();
  return allowedExtensions.some(ext => lowerFilename.endsWith(ext.toLowerCase()));
}
