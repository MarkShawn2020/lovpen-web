'use client';

import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { waitlistStatusAtom } from '@/stores/waitlist';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from './waitlist-modal';

type WaitlistButtonProps = {
  source: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export function WaitlistButton({ 
  source, 
  children, 
  className,
  variant = 'default',
  size = 'lg'
}: WaitlistButtonProps) {
  const t = useTranslations('Index');
  const waitlistStatus = useAtomValue(waitlistStatusAtom);
  
  if (waitlistStatus.hasApplied) {
    return (
      <Button 
        variant="outline" 
        size={size}
        className={`${className} border-gray-300 text-gray-500 cursor-default bg-gray-50`}
        disabled
      >
        {t('waitlist_button_pending')}
      </Button>
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
