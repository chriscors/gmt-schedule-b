// Server-side session cookie storage for Census API
// The Census API requires a session cookie (ccce.key) to process requests

let sessionCookie: string | null = null;
let sessionExpiry: number = 0;

/**
 * Get the current session cookie if it's still valid
 * @returns The session cookie string or null if expired/missing
 */
export function getSessionCookie(): string | null {
  if (Date.now() > sessionExpiry) {
    sessionCookie = null;
  }
  return sessionCookie;
}

/**
 * Store a session cookie with expiration
 * @param cookie - The full cookie string (e.g., "ccce.key=...")
 */
export function setSessionCookie(cookie: string) {
  sessionCookie = cookie;
  // Session typically lasts 30 minutes, refresh 5 minutes early
  sessionExpiry = Date.now() + 25 * 60 * 1000;
}

/**
 * Clear the stored session cookie
 */
export function clearSessionCookie() {
  sessionCookie = null;
  sessionExpiry = 0;
}

/**
 * Extract the ccce.key cookie from Set-Cookie header
 * @param setCookieHeader - The Set-Cookie header value (can be a single header or array)
 * @returns The cookie string or null if not found
 */
export function extractSessionCookie(setCookieHeader: string | string[] | null): string | null {
  if (!setCookieHeader) return null;
  
  // Handle array of Set-Cookie headers (some servers return multiple)
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  
  for (const header of headers) {
    // Set-Cookie format: "name=value; Path=/; HttpOnly; SameSite=None"
    // We need to find ccce.key=... and extract just the name=value part
    // Note: commas in cookie values are rare, but we should be careful
    // The safest approach is to look for "ccce.key=" and extract until the first semicolon
    
    const match = header.match(/ccce\.key=([^;]+)/);
    if (match) {
      return `ccce.key=${match[1]}`;
    }
  }
  
  return null;
}
