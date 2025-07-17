import type { NextFetchEvent, NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

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
  event: NextFetchEvent,
) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Run Clerk middleware on all routes to enable auth() usage in components
  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      const locale = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

      const signInUrl = new URL(`${locale}/sign-in`, req.url);

      await auth.protect({
        unauthenticatedUrl: signInUrl.toString(),
      });
    }

    // Skip i18n routing for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Handle homepage redirect for authenticated users
    const { userId } = await auth();
    if (userId) {
      const pathname = req.nextUrl.pathname;
      // Check if user is on root path or localized root path
      const isRootPath = pathname === '/' || pathname.match(/^\/[a-z]{2}(-[A-Z]{2})?$/);

      if (isRootPath) {
        // Let i18n routing handle the request first to get proper locale
        const i18nResponse = handleI18nRouting(request);
        
        // If i18n routing returns a redirect, follow it
        if (i18nResponse.status === 307 || i18nResponse.status === 308) {
          const redirectUrl = new URL(i18nResponse.headers.get('location') || '/', req.url);
          // Add /create to the redirected path
          redirectUrl.pathname = redirectUrl.pathname.replace(/\/$/, '') + '/create';
          return NextResponse.redirect(redirectUrl);
        }
        
        // For direct access, determine the correct locale path
        const createPath = pathname === '/' ? '/create' : `${pathname}/create`;
        return NextResponse.redirect(new URL(createPath, req.url));
      }
    }

    // Handle i18n routing for non-redirect cases
    return handleI18nRouting(request);
  })(request, event);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
