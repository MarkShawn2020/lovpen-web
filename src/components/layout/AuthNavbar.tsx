'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import {Button} from '@/components/lovpen-ui/button';
import {useAuth} from '@/contexts/AuthContext';
import {cn} from '@/lib/utils';
import {BookOpen, LogOut, Settings, User} from 'lucide-react';
import {
  AuthNavigationLink,
  AuthNavigationMenu,
  AuthNavigationMenuItem,
  AuthNavigationMenuList
} from './AuthNavigationMenu';

const AuthNavbar = () => {
  const {user, logout} = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigation = [
    {name: '工作空间', href: '/space', icon: '🏠'},
    {name: '知识库', href: '/database', icon: BookOpen},
  ];

  // 移动端菜单使用的 isActive 函数
  const isActive = (href: string) => {
    if (href === '/space') {
      return pathname === '/space';
    }
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-background-main border-b border-border-default/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/space" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold text-text-main">LovPen</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <AuthNavigationMenu>
              <AuthNavigationMenuList>
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <AuthNavigationMenuItem key={item.name}>
                      <AuthNavigationLink href={item.href}>
                        {typeof IconComponent === 'string'
                          ? (
                            <span className="mr-2">{IconComponent}</span>
                          )
                          : (
                            <IconComponent className="w-4 h-4 mr-2"/>
                          )}
                        <span>{item.name}</span>
                      </AuthNavigationLink>
                    </AuthNavigationMenuItem>
                  );
                })}
              </AuthNavigationMenuList>
            </AuthNavigationMenu>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-main hover:bg-primary/5 transition-colors"
              >
                <div
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium"
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-border-default/20 py-1 z-50"
                >
                  <Link
                    href="/dashboard/user-profile"
                    className="flex items-center px-4 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2"/>
                    个人资料
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2"/>
                    设置
                  </Link>
                  <hr className="my-1 border-border-default/20"/>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2"/>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background-main border-t border-border-default/20">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-main hover:text-primary hover:bg-primary/5'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {typeof IconComponent === 'string'
                    ? (
                      <span className="mr-3">{IconComponent}</span>
                    )
                    : (
                      <IconComponent className="w-5 h-5 mr-3"/>
                    )}
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t border-border-default/20 pt-4">
              <div className="flex items-center px-3 py-2 mb-3">
                <div
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3"
                >
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-text-main">
                  {user?.username}
                </span>
              </div>
              <Link
                href="/dashboard/user-profile"
                className="flex items-center px-3 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-2"/>
                个人资料
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-3 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-2"/>
                设置
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2"/>
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export {AuthNavbar};
