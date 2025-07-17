'use client';

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// 基础 NavigationMenu 组件 - 简化版，不包含 viewport
function AuthNavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="auth-navigation-menu"
      className={cn(
        'relative flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

// NavigationMenuList 组件
function AuthNavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="auth-navigation-menu-list"
      className={cn(
        'group flex flex-1 list-none items-center justify-center gap-1',
        className
      )}
      {...props}
    />
  );
}

// NavigationMenuItem 组件
function AuthNavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="auth-navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

// 定制的导航链接样式 - 低调简洁版本
const authNavigationLinkStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 no-underline',
  {
    variants: {
      variant: {
        default: 'text-text-main hover:text-primary hover:no-underline',
        active: 'text-primary [&>span]:underline [&>span]:underline-offset-4 [&>span]:decoration-1 [&>span]:decoration-primary/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// 定制的导航链接组件 - 集成 Next.js Link 和路径检测
type AuthNavigationLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function AuthNavigationLink({
  href,
  children,
  className,
  onClick,
}: AuthNavigationLinkProps) {
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
    <NavigationMenuPrimitive.Link asChild active={active}>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          authNavigationLinkStyle({
            variant: active ? 'active' : 'default',
          }),
          className
        )}
      >
        {children}
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

// 也可以创建一个基于按钮的触发器（如果需要下拉菜单）
const authNavigationTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 no-underline',
  {
    variants: {
      variant: {
        default: 'text-text-main hover:text-primary hover:no-underline data-[state=open]:text-primary',
        active: 'text-primary [&>span]:underline [&>span]:underline-offset-4 [&>span]:decoration-1 [&>span]:decoration-primary/60 data-[state=open]:text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function AuthNavigationTrigger({
  className,
  children,
  active = false,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  active?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="auth-navigation-menu-trigger"
      className={cn(
        authNavigationTriggerStyle({
          variant: active ? 'active' : 'default',
        }),
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
}

export {
  AuthNavigationLink,
  authNavigationLinkStyle,
  AuthNavigationMenu,
  AuthNavigationMenuItem,
  AuthNavigationMenuList,
  AuthNavigationTrigger,
  authNavigationTriggerStyle,
};
