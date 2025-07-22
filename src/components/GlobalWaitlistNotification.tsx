'use client';

import { useAtom, useAtomValue } from 'jotai';
import { setWaitlistNotificationAtom, waitlistNotificationAtom } from '@/stores/waitlist';
import { WaitlistPositionNotification } from '@/components/ui/waitlist-position-notification';

export function GlobalWaitlistNotification() {
  const notificationConfig = useAtomValue(waitlistNotificationAtom);
  const [, setNotification] = useAtom(setWaitlistNotificationAtom);

  if (!notificationConfig) {
    return null;
  }

  return (
    <WaitlistPositionNotification
      config={notificationConfig}
      onDismiss={() => setNotification(null)}
    />
  );
}
