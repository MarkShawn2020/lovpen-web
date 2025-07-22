'use client';

import { useAtomValue } from 'jotai';
import { waitlistStatusAtom } from '@/stores/waitlist';
import { WaitlistButton } from './waitlist-button';

type WaitlistButtonWithEffectProps = {
  source: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  pendingText?: string;
};

export function WaitlistButtonWithEffect({ 
  source, 
  children, 
  className,
  variant = 'default',
  size = 'lg',
  pendingText
}: WaitlistButtonWithEffectProps) {
  const waitlistStatus = useAtomValue(waitlistStatusAtom);
  
  // 如果已申请，不显示特效
  if (waitlistStatus.hasApplied) {
    return (
      <WaitlistButton 
        source={source}
        variant={variant}
        size={"lg"}
        className={className}
        pendingText={pendingText}
      >
        {children}
      </WaitlistButton>
    );
  }

  // 未申请时显示带特效的按钮
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-brand-gradient rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300" />
      <WaitlistButton 
        source={source}
        variant={variant}
        size={size}
        className={`relative z-10 ${className}`}
        pendingText={pendingText}
      >
        {children}
      </WaitlistButton>
    </div>
  );
}
