import {getLocale, getTranslations} from 'next-intl/server';
import Link from 'next/link';
import {LogoWithText} from '@/components/lovpen-ui/logo';
import {SmartNavLink} from '@/components/lovpen-ui/smart-nav-link';
import {getI18nPath} from '@/utils/Helpers';
import {Container} from './Container';
import {HeaderClient} from './HeaderClient';

const Header = async () => {
  // 移除Clerk依赖，使用客户端组件处理认证状态
  const locale = await getLocale();
  const t = await getTranslations('Header');

  const navigation = [
    {name: t('features'), href: '/features'},
    {name: t('docs'), href: '/docs'},
    {name: t('pricing'), href: '/pricing'},
    {name: t('about'), href: '/about'},
  ];

  const signInUrl = getI18nPath('/login', locale);
  const signUpUrl = getI18nPath('/register', locale);
  const dashboardUrl = getI18nPath('/dashboard', locale);

  return (
    <header className="w-full bg-background-main border-b border-border-default/20">
      <Container>
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center no-underline text-text-main hover:text-primary transition-colors"
            >
              <LogoWithText size="md"/>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map(item => (
              item.href === '/features'
                ? (
                    <SmartNavLink
                      key={item.name}
                      href={item.href}
                      scrollToId="features"
                      className="text-text-main hover:text-primary transition-colors no-underline"
                    >
                      {item.name}
                    </SmartNavLink>
                  )
                : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-text-main hover:text-primary transition-colors no-underline"
                    >
                      {item.name}
                    </Link>
                  )
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
