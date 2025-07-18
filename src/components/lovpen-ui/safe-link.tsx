import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SafeLinkProps = {
  href: string;
  children: React.ReactNode;
  showComingSoon?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

// Define implemented routes - update this list as routes are implemented
const IMPLEMENTED_ROUTES = [
  '/',
  '/features',
  '/docs',
  '/pricing',
  '/about',
  '/sign-in',
  '/sign-up',
  '/playground',
  '/dashboard',
  '/knowledge-base',
  '/counter',
  '/portfolio',
];

// Routes that are planned but not yet implemented
const PLANNED_ROUTES = [
  '/docs/installation',
  '/docs/quick-start',
  '/docs/configuration',
  '/docs/writing',
  '/docs/styling',
  '/docs/publishing',
  '/docs/api',
  '/docs/plugins',
  '/docs/integrations',
  '/docs/troubleshooting',
  '/docs/faq',
  '/docs/community',
  '/support',
  '/contact',
  '/privacy',
  '/terms',
  '/blog',
  '/help',
  '/products/lovpen',
  '/status',
  '/cookies',
  '#careers',
  '#press',
  '#contact',
];

function isRouteImplemented(href: string): boolean {
  // Remove locale prefix if present (e.g., /en/features -> /features)
  const cleanHref = href.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
  return IMPLEMENTED_ROUTES.includes(cleanHref) || IMPLEMENTED_ROUTES.includes(href);
}

function isRoutePlanned(href: string): boolean {
  const cleanHref = href.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
  return PLANNED_ROUTES.includes(cleanHref) || PLANNED_ROUTES.includes(href);
}

const SafeLink = ({ ref, href, children, className, showComingSoon = true, ...props }: SafeLinkProps & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
    const implemented = isRouteImplemented(href);
    const planned = isRoutePlanned(href);

    // Handle hash links (anchors) - these should be treated as "planned" features
    if (href.startsWith('#')) {
      if (showComingSoon) {
        return (
          <span
            className={cn(
              'relative cursor-not-allowed opacity-60 text-text-faded group',
              className,
            )}
            title="Coming soon"
          >
            {children}
            <span
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-text-main text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap mb-1"
            >
              Coming soon
            </span>
          </span>
        );
      }
      return <span className={className}>{children}</span>;
    }

    if (implemented) {
      return (
        <Link href={href} className={className} ref={ref} {...props}>
          {children}
        </Link>
      );
    }

    if (planned && showComingSoon) {
      return (
        <span
          className={cn(
            'relative cursor-not-allowed opacity-60 text-text-faded group',
            className,
          )}
          title="Coming soon"
        >
          {children}
          <span
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-text-main text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap mb-1"
          >
            Coming soon
          </span>
        </span>
      );
    }

    // Fallback for external links or unplanned routes
    return (
      <Link href={href} className={className} ref={ref} {...props}>
        {children}
      </Link>
    );
  };

SafeLink.displayName = 'SafeLink';

export { SafeLink };
