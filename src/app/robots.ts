import type {MetadataRoute} from 'next';
import {getBaseUrl} from '@/utils/Helpers';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // todo: add extra dirs, or using sub dir
      disallow: '/playground/',
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
