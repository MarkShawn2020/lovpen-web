import {defineRouting} from 'next-intl/routing';
import {AppConfig} from '@/utils/AppConfig';

export const routing = defineRouting({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
  // Disable automatic locale detection to prevent unwanted redirects
  localeDetection: false,
});
