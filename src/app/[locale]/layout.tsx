import type {Metadata} from 'next';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Fira_Code, Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {PostHogProvider} from '@/components/analytics/PostHogProvider';
import {ReactQueryProvider} from '@/components/providers/ReactQueryProvider';
import {JotaiProvider} from '@/providers/JotaiProvider';
import {AuthProvider} from '@/contexts/AuthContext';
import {routing} from '@/lib/I18nRouting';
import '@/styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/lovpen-logo-2/LovPen-pure-logo_primaryColor.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'shortcut icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const {locale} = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased">
        <JotaiProvider>
          <AuthProvider>
            <NextIntlClientProvider>
              <ReactQueryProvider>
                <PostHogProvider>
                  {props.children}
                </PostHogProvider>
              </ReactQueryProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
