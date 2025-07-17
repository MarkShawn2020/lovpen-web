import {setRequestLocale} from 'next-intl/server';
import {AuthNavbar} from '@/components/layout/AuthNavbar';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <div className="u-flex-page bg-gray-50">
      <AuthNavbar />
      <div className="u-flex-content">
        <div className="container mx-auto py-4 h-full">
          {props.children}
        </div>
      </div>
    </div>
  );
}
