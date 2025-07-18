'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {Button} from '@/components/lovpen-ui/button';
import {Logo} from '@/components/lovpen-ui/logo';
import {useAuth} from '@/contexts/AuthContext';
import {cn} from '@/lib/utils';
import {BarChart3, BookOpen, Calendar, LogOut, Settings, User} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AuthNavigationLink,
  AuthNavigationMenu,
  AuthNavigationMenuItem,
  AuthNavigationMenuList
} from './AuthNavigationMenu';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import packageJson from '../../../package.json';

const AuthNavbar = () => {
  const {user, logout} = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const navigation = [
    {name: '创作工坊', href: '/playground', icon: '🏠'},
    {name: '知识库', href: '/space', icon: BookOpen},
    {name: '选题排期', href: '/topic-schedule', icon: Calendar},
    {name: '数据库看板', href: '#', icon: BarChart3, pending: true},
  ];

  // 移动端菜单使用的 isActive 函数
  const isActive = (href: string) => {
    if (href === '/playground') {
      return pathname === '/playground';
    }
    if (href === '/space') {
      return pathname === '/space';
    }
    if (href === '/topic-schedule') {
      return pathname === '/topic-schedule';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handlePendingItemClick = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    if (itemName === '数据库看板') {
      setIsFeedbackModalOpen(true);
    }
  };

  return (
    <nav className="bg-background-main border-bborder-border-default/20 shrink-0 border-b">
      <div className="container mx-auto">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/playground" className="flex items-center space-x-2 no-underline">
              <Logo
                variant="horizontal"
                size="md"
                className="text-brand-gradient"
              />
            </Link>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200">
              v
{packageJson.version}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <AuthNavigationMenu>
              <AuthNavigationMenuList>
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <AuthNavigationMenuItem key={item.name}>
                      <AuthNavigationLink 
                        href={item.href}
                        onClick={item.pending ? e => handlePendingItemClick(e, item.name) : undefined}
                        className={item.pending ? 'opacity-60 cursor-pointer' : ''}
                      >
                        {typeof IconComponent === 'string'
                          ? (
                            <span className="mr-2">{IconComponent}</span>
                          )
                          : (
                            <IconComponent className="w-4 h-4 mr-2"/>
                          )}
                        <span>{item.name}</span>
                        {item.pending && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            即将开放
                          </span>
                        )}
                      </AuthNavigationLink>
                    </AuthNavigationMenuItem>
                  );
                })}
              </AuthNavigationMenuList>
            </AuthNavigationMenu>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-text-main hover:bg-primary/5 transition-colors"
                >
                  <div
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium"
                  >
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2"/>
                    个人资料
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2"/>
                    设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2"/>
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    item.pending && 'opacity-60 cursor-pointer',
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-main hover:text-primary hover:bg-primary/5'
                  )}
                  onClick={(e) => {
                    if (item.pending) {
                      handlePendingItemClick(e, item.name);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  {typeof IconComponent === 'string'
                    ? (
                      <span className="mr-3">{IconComponent}</span>
                    )
                    : (
                      <IconComponent className="w-5 h-5 mr-3"/>
                    )}
                  {item.name}
                  {item.pending && (
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      即将开放
                    </span>
                  )}
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
                href="/profile"
                className="flex items-center px-3 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-2"/>
                个人资料
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 text-sm text-text-main hover:bg-primary/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-2"/>
                设置
              </Link>
              <button
                type="button"
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

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </nav>
  );
};

export {AuthNavbar};
