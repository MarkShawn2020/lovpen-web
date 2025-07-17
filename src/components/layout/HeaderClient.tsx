'use client';

import Link from 'next/link';
import React, {useState} from 'react';
import {Button} from '@/components/lovpen-ui/button';
import {SmartNavLink} from '@/components/lovpen-ui/smart-nav-link';
import {useAuth} from '@/contexts/AuthContext';

type HeaderClientProps = {
  navigation: Array<{ name: string; href: string }>;
  urls: {
    signIn: string;
    signUp: string;
    dashboard: string;
  };
  translations: {
    signIn: string;
    getStarted: string;
    dashboard: string;
    signOut: string;
  };
};

export const HeaderClient = ({navigation, urls, translations}: HeaderClientProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isAuthenticated, logout, loading} = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center space-x-4">
        {isAuthenticated
          ? (
            // Authenticated user actions
              <>
                <Link href={urls.dashboard}>
                  <Button variant="secondary" size="md">
                    {translations.dashboard}
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? '退出中...' : translations.signOut}
                </Button>
              </>
            )
          : (
            // Unauthenticated user actions
              <>
                <Link href={urls.signIn}>
                  <Button variant="secondary" size="md">
                    {translations.signIn}
                  </Button>
                </Link>
                <Link href={urls.signUp}>
                  <Button variant="primary" size="md">
                    {translations.getStarted}
                  </Button>
                </Link>
              </>
            )}
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden relative">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-text-main hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen
              ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                )
              : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 w-72 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <nav className="p-4">
              {navigation.map(item => (
                item.href === '/features'
                  ? (
                      <SmartNavLink
                        key={item.name}
                        href={item.href}
                        scrollToId="features"
                        className="block text-text-main hover:text-primary transition-colors py-2 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </SmartNavLink>
                    )
                  : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-text-main hover:text-primary transition-colors py-2 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border-default/20">
                {isAuthenticated
                  ? (
                    // Authenticated user actions
                      <>
                        <Link href={urls.dashboard} onClick={() => setIsMenuOpen(false)}>
                          <Button variant="secondary" size="md" className="w-full">
                            {translations.dashboard}
                          </Button>
                        </Link>
                        <Button 
                          variant="primary" 
                          size="md" 
                          className="w-full"
                          onClick={handleLogout}
                          disabled={loading}
                        >
                          {loading ? '退出中...' : translations.signOut}
                        </Button>
                      </>
                    )
                  : (
                    // Unauthenticated user actions
                      <>
                        <Link href={urls.signIn} onClick={() => setIsMenuOpen(false)}>
                          <Button variant="secondary" size="md" className="w-full">
                            {translations.signIn}
                          </Button>
                        </Link>
                        <Link href={urls.signUp} onClick={() => setIsMenuOpen(false)}>
                          <Button variant="primary" size="md" className="w-full">
                            {translations.getStarted}
                          </Button>
                        </Link>
                      </>
                    )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};
