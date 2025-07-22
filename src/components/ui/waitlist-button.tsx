'use client';

import { useAtomValue } from 'jotai';
import { waitlistStatusAtom } from '@/stores/waitlist';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from './waitlist-modal';
import { WaitlistStatusModal } from './waitlist-status-modal';

type WaitlistButtonProps = {
  source: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  pendingText?: string; // 添加可选的 pending 文本
};

export function WaitlistButton({ 
  source, 
  children, 
  className,
  variant = 'default',
  size = 'lg',
  pendingText = '申请已提交'
}: WaitlistButtonProps) {
  const waitlistStatus = useAtomValue(waitlistStatusAtom);
  
  if (waitlistStatus.hasApplied) {
    return (
      <WaitlistStatusModal>
        <Button 
          variant="outline" 
          size={size}
          className={`${className} border-green-300 text-green-700 bg-green-50 hover:bg-green-100 transition-colors`}
        >
          {pendingText}
{' '}
· 查看详情
        </Button>
      </WaitlistStatusModal>
    );
  }

  return (
    <WaitlistModal source={source}>
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </WaitlistModal>
  );
}
