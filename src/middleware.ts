import type {NextFetchEvent, NextRequest} from 'next/server';
import {detectBot} from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';
import arcjet from '@/lib/Arcjet';
import {routing} from './lib/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }
  }

  // Skip i18n routing for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if user is authenticated and redirect root to /playground
  const authToken = request.cookies.get('fastapi_auth_token')?.value;
  const isAuthenticated = !!authToken;
  
  // Get the locale from the pathname
  const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
  const locale = pathSegments[0] && ['zh', 'en'].includes(pathSegments[0]) ? pathSegments[0] : 'zh';
  
  // Check if user is accessing root path (with or without locale)
  if (isAuthenticated && (
    request.nextUrl.pathname === '/' 
    || request.nextUrl.pathname === `/${locale}`
    || request.nextUrl.pathname === `/${locale}/`
  )) {
    const homeUrl = new URL(`/${locale}/playground`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Protect (auth) routes - require authentication
  const isAuthRoute = request.nextUrl.pathname.includes('/(auth)')
    || request.nextUrl.pathname.match(`/${locale}/(playground|profile|space|topic-schedule)`);
  
  if (isAuthRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Handle i18n routing
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
