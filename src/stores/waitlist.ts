import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 存储用户是否已申请试用的状态
export const hasAppliedWaitlistAtom = atomWithStorage('lovpen-waitlist-applied', false);

// 存储用户申请的邮箱（用于显示）
export const waitlistEmailAtom = atomWithStorage<string | null>('lovpen-waitlist-email', null);

// 存储申请时间
export const waitlistAppliedAtAtom = atomWithStorage<string | null>('lovpen-waitlist-applied-at', null);

// 计算是否应该显示已申请状态
export const waitlistStatusAtom = atom((get) => {
  const hasApplied = get(hasAppliedWaitlistAtom);
  const email = get(waitlistEmailAtom);
  const appliedAt = get(waitlistAppliedAtAtom);
  
  return {
    hasApplied,
    email,
    appliedAt,
  };
});

// 设置申请状态的action
export const setWaitlistAppliedAtom = atom(
  null,
  (get, set, { email, position, submissionTime }: { email: string; position?: number; submissionTime?: string }) => {
    set(hasAppliedWaitlistAtom, true);
    set(waitlistEmailAtom, email);
    set(waitlistAppliedAtAtom, submissionTime || new Date().toISOString());
    // Note: position could be stored in a separate atom if needed for later features
  }
);

// 重置申请状态（用于测试或管理）
export const resetWaitlistAtom = atom(
  null,
  (get, set) => {
    set(hasAppliedWaitlistAtom, false);
    set(waitlistEmailAtom, null);
    set(waitlistAppliedAtAtom, null);
  }
);
