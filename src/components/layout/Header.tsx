import {getLocale, getTranslations} from 'next-intl/server';
import Link from 'next/link';
import {LogoWithText} from '@/components/lovpen-ui/logo';
import {SmartNavLink} from '@/components/lovpen-ui/smart-nav-link';
import {getI18nPath} from '@/utils/Helpers';
import {Container} from './Container';
import {HeaderClient} from './HeaderClient';
import packageJson from '../../../package.json';

const Header = async () => {
  // 移除Clerk依赖，使用客户端组件处理认证状态
  const locale = await getLocale();
  const t = await getTranslations('Header');

  const navigation = [
    {name: t('features'), href: '/features', scrollToId: 'features'},
    {name: t('cases'), href: '/cases', scrollToId: 'cases'},
    {name: t('pricing'), href: '/pricing', scrollToId: 'pricing'},
    {name: t('about'), href: '/about', scrollToId: 'about'},
  ];

  const signInUrl = getI18nPath('/login', locale);
  const signUpUrl = getI18nPath('/register', locale);
  const dashboardUrl = getI18nPath('/dashboard', locale);

  return (
    <header className="w-full bg-background-main border-b border-border-default/20">
      <Container>
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center no-underline text-text-main hover:text-primary transition-colors"
            >
              <LogoWithText size="md"/>
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
                key={item.name}
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
          />
        </div>
      </Container>
    </header>
  );
};

export {Header};
