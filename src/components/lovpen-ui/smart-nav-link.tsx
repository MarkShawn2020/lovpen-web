'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export type SmartNavLinkProps = {
  href: string;
  scrollToId?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const SmartNavLink = ({ ref, href, scrollToId, children, className, onClick, ...props }: SmartNavLinkProps & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e);
      }

      // Check if we're on the landing page and have a scrollToId
      if (scrollToId && (pathname === '/' || pathname.match(/^\/[a-z]{2}(-[A-Z]{2})?$/))) {
        e.preventDefault();
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    return (
      <Link
        href={href}
        className={className}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  };

SmartNavLink.displayName = 'SmartNavLink';

export { SmartNavLink };
