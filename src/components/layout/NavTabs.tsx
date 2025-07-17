'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavTabsProps = {
  children: ReactNode;
  className?: string;
}

type NavTabsListProps = {
  children: ReactNode;
  className?: string;
}

type NavTabsLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function NavTabs({ children, className }: NavTabsProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {children}
    </div>
  );
}

function NavTabsList({ children, className }: NavTabsListProps) {
  return (
    <div
      className={cn(
        'bg-background-main/50 text-text-faded inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] border border-border-default/20',
        className
      )}
    >
      {children}
    </div>
  );
}

function NavTabsLink({ href, children, className, onClick }: NavTabsLinkProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/space') {
      return pathname === '/space';
    }
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };
  
  const active = isActive(href);
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        // 基础样式
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200',
        // 焦点样式
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        // 禁用样式
        'disabled:pointer-events-none disabled:opacity-50',
        // 图标样式
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
        // 活跃状态
        active
          ? 'bg-background-main text-primary shadow-sm border-border-default/20'
          : 'text-text-main hover:text-primary hover:bg-primary/5',
        className
      )}
    >
      {children}
    </Link>
  );
}

export { NavTabs, NavTabsLink, NavTabsList };
