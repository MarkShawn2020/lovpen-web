import {getLocale, getTranslations} from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import {SmartNavLink} from '@/components/lovpen-ui/smart-nav-link';
import {getI18nPath} from '@/utils/Helpers';
import {Container} from './Container';
import {HeaderClient} from './HeaderClient';
import packageJson from '../../../package.json';

const LandingNavbar = async () => {
  // 移除Clerk依赖，使用客户端组件处理认证状态
  const locale = await getLocale();
  const t = await getTranslations('Header');

  const navigation = [
    {name: t('workflow'), href: '/workflow', scrollToId: 'workflow'},
    {name: t('features'), href: '/features', scrollToId: 'features'},
    {name: t('cases'), href: '/cases', scrollToId: 'cases'},
    {name: t('pricing'), href: '/pricing', scrollToId: 'pricing'},
    {name: t('about'), href: '/about', scrollToId: 'about'},
  ];

  const signInUrl = getI18nPath('/login', locale);
  const signUpUrl = getI18nPath('/register', locale);
  const dashboardUrl = getI18nPath('/dashboard', locale);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-main/95 backdrop-blur-md border-b border-border-default/20 shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center no-underline text-text-main hover:text-primary transition-colors"
            >
              <div className="text-brand-primary transition-all duration-200 hover:scale-105 hover:opacity-90">
                <Image 
                  src="/assets/images/neurora-logo-theme.svg"
                  alt="Neurora Logo" 
                  width={120}
                  height={36}
                />
              </div>
            </Link>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200">
              v
{packageJson.version}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map(item => (
              <SmartNavLink
                key={item.href}
                href={item.href}
                scrollToId={item.scrollToId}
                className="text-text-main hover:text-primary transition-colors no-underline"
              >
                {item.name}
              </SmartNavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <HeaderClient
            navigation={navigation}
            urls={{
              signIn: signInUrl,
              signUp: signUpUrl,
              dashboard: dashboardUrl,
            }}
            translations={{
              signIn: t('sign_in'),
              getStarted: t('download_plugin'),
              tryNow: t('try_now'),
              dashboard: t('dashboard'),
              signOut: t('sign_out'),
            }}
            currentLocale={locale}
          />
        </div>
      </Container>
    </header>
  );
};

export {LandingNavbar};
