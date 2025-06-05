import { headers } from 'next/headers';

export function getBaseUrl() {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  if (env) return env;
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  if (host) {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
  }
  return 'http://localhost:3000';
}
