'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/lovpen-ui/button';

type AuthAwareButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  authenticatedHref?: string;
  unauthenticatedHref?: string;
};

export function AuthAwareButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  authenticatedHref = '/playground',
  unauthenticatedHref = '/register',
}: AuthAwareButtonProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        disabled
      >
        {children}
      </Button>
    );
  }

  const href = isAuthenticated ? authenticatedHref : unauthenticatedHref;

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      asChild
    >
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
}
