export function getBaseUrl() {
  // Client side
  if (typeof window !== 'undefined') {
    return '';
  }

  // Server side - Check for Vercel URL first, then custom API URL, then localhost
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Default fallback - try to detect the port from Next.js
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}
