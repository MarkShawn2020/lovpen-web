import type {LocalePrefixMode} from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'LovPen',
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix,
};
