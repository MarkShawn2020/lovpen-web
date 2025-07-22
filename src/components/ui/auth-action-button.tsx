'use client';

import Link from 'next/link';
import {Button} from '@/components/lovpen-ui/button';
import {WaitlistButton} from './waitlist-button';
import {WaitlistButtonWithEffect} from './waitlist-button-with-effect';

type AuthActionButtonProps = {
  source: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  signInUrl?: string;
  onClick?: () => void;
  useWaitlistForLogin?: boolean; // 新增：是否在登录时也使用waitlist
  withEffect?: boolean; // 新增：是否使用特效版本
  pendingText?: string; // 添加 pending 文本传递
};

// 映射不同Button组件的variant和size
const mapToLovpenButtonVariant = (variant: string) => {
  switch (variant) {
    case 'default':
      return 'primary';
    case 'destructive':
      return 'error';
    default:
      return variant;
  }
};

const mapToLovpenButtonSize = (size: string) => {
  switch (size) {
    case 'default':
      return 'md';
    default:
      return size;
  }
};

export function AuthActionButton({
                                   source,
                                   children,
                                   className,
                                   variant = 'default',
                                   size = 'default',
                                   signInUrl = '/login',
                                   onClick,
                                   withEffect = false,
                                   pendingText = '申请已提交'
                                 }: AuthActionButtonProps) {
  const WaitlistComponent = withEffect ? WaitlistButtonWithEffect : WaitlistButton;

  // 如果开启登录功能
  if (process.env.NEXT_PUBLIC_LOGIN_ENABLED === 'true') {
    // 否则跳转到登录页（导航栏场景）
    return (
      <Link href={signInUrl} onClick={onClick}>
        <Button
          variant={mapToLovpenButtonVariant(variant) as any}
          size={mapToLovpenButtonSize(size) as any}
          className={className}
        >
          {children}
        </Button>
      </Link>
    );
  }

  // 如果未开启登录功能，显示申请内测按钮
  return (
    <WaitlistComponent
      source={source}
      variant={variant}
      size={size}
      className={className}
      pendingText={pendingText}
    >
      申请内测
    </WaitlistComponent>
  );
}
