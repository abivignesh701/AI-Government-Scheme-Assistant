import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_CACHE = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  if (!pathname.startsWith('/_next') && !pathname.includes('.')) {
    const now = Date.now();
    const limitRecord = RATE_LIMIT_CACHE.get(ip);
    
    if (limitRecord) {
      if (now - limitRecord.timestamp < RATE_LIMIT_WINDOW) {
        if (limitRecord.count >= MAX_REQUESTS_PER_WINDOW) {
          return new NextResponse(JSON.stringify({ error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } }), {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60'
            }
          });
        }
        limitRecord.count++;
      } else {
        RATE_LIMIT_CACHE.set(ip, { count: 1, timestamp: now });
      }
    } else {
      RATE_LIMIT_CACHE.set(ip, { count: 1, timestamp: now });
    }
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/v1/admin')) {
    const isLocalDev = process.env.NODE_ENV === 'development';
    const mockAuthCookie = request.cookies.get('admin-auth');
    
    if (!mockAuthCookie) {
       return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }

  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', csp);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
