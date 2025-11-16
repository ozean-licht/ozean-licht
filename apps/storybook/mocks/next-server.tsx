/**
 * Mock for next/server in Storybook
 *
 * Next.js server utilities are not available in Storybook,
 * so we provide simple mocks for common server-side functions.
 */

/**
 * Mock NextRequest class
 */
export class NextRequest extends Request {
  geo?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
  };

  ip?: string;
  nextUrl: URL;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
    this.nextUrl = new URL(input instanceof Request ? input.url : input.toString());
  }
}

/**
 * Mock NextResponse class
 */
export class NextResponse extends Response {
  cookies: any;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
    this.cookies = {
      set: (name: string, value: string, options?: any) => {
        console.log('[Storybook] Cookie.set:', name, value, options);
      },
      get: (name: string) => {
        console.log('[Storybook] Cookie.get:', name);
        return undefined;
      },
      delete: (name: string) => {
        console.log('[Storybook] Cookie.delete:', name);
      },
    };
  }

  static json(data: any, init?: ResponseInit) {
    return new NextResponse(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }

  static redirect(url: string | URL, status?: number) {
    console.log('[Storybook] NextResponse.redirect:', url, status);
    return new NextResponse(null, {
      status: status || 307,
      headers: {
        Location: url.toString(),
      },
    });
  }

  static rewrite(destination: string | URL) {
    console.log('[Storybook] NextResponse.rewrite:', destination);
    return new NextResponse(null);
  }

  static next() {
    return new NextResponse(null);
  }
}

/**
 * Mock userAgent function
 */
export function userAgent(request: Request) {
  return {
    ua: '',
    browser: { name: 'Unknown', version: '' },
    device: { model: '', type: '', vendor: '' },
    engine: { name: '', version: '' },
    os: { name: '', version: '' },
    cpu: { architecture: '' },
    isBot: false,
  };
}
