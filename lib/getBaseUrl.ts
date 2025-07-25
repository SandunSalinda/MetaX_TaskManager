export function getBaseUrl() {
  // Client side
  if (typeof window !== 'undefined') {
    return '';
  }

  // Server side - Check for Vercel URL first, then custom API URL, then localhost
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`;
    console.log('Using Vercel URL:', url);
    return url;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Default fallback - try to detect the port from Next.js
  const port = process.env.PORT || '3000';
  const url = `http://localhost:${port}`;
  console.log('Using localhost URL:', url);
  return url;
}
