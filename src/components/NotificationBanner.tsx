'use client';

import { useAtomValue } from 'jotai';
import { waitlistStatusAtom } from '@/stores/waitlist';
import { WaitlistModal } from '@/components/ui/waitlist-modal';

export const NotificationBanner = () => {
  const waitlistStatus = useAtomValue(waitlistStatusAtom);

  return (
    <div
      className="sticky top-0 z-50 bg-background-dark p-4 text-center text-base font-medium text-white border-b border-border-default/20"
    >
      <div className="flex items-center justify-center gap-2 text-sm">
        <span>🎉</span>
        <span>Lovpen 7.19 正式上线啦！</span>
        {!waitlistStatus.hasApplied && (
          <>
            <span>-</span>
            <WaitlistModal source="notification-banner">
              <button className="text-primary hover:opacity-80 transition-opacity underline underline-offset-2 font-semibold">
                欢迎申请内测
              </button>
            </WaitlistModal>
          </>
        )}
      </div>
    </div>
  );
};
