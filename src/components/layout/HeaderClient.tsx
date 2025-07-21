'use client';

import Link from 'next/link';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/lovpen-ui/button';
import {SmartNavLink} from '@/components/lovpen-ui/smart-nav-link';
import {useAuth} from '@/contexts/AuthContext';
import {LanguageSwitcher} from './LanguageSwitcher';
import {AuthActionButton} from '@/components/ui/auth-action-button';

type HeaderClientProps = {
  navigation: Array<{ name: string; href: string; scrollToId: string }>;
  urls: {
    signIn: string;
    signUp: string;
    dashboard: string;
  };
  translations: {
    signIn: string;
    getStarted: string;
    tryNow: string;
    dashboard: string;
    signOut: string;
  };
};

export const HeaderClient = ({navigation, urls, translations}: HeaderClientProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isAuthenticated, logout, loading} = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center space-x-3">
        <LanguageSwitcher />
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
            <AuthActionButton
              source="navbar-desktop"
              variant="default"
              size="default"
              signInUrl={urls.signIn}
            >
              {translations.signIn}
            </AuthActionButton>
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
                <SmartNavLink
                  key={item.href}
                  href={item.href}
                  scrollToId={item.scrollToId}
                  className="block text-text-main hover:text-primary transition-colors py-2 no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </SmartNavLink>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border-default/20">
                {/* Language Switcher for Mobile */}
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
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
                    <AuthActionButton
                      source="navbar-mobile"
                      variant="default"
                      size="default"
                      className="w-full"
                      signInUrl={urls.signIn}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {translations.signIn}
                    </AuthActionButton>
                  )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};
