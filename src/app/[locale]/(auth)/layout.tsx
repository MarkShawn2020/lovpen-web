import {setRequestLocale} from 'next-intl/server';
import {AuthNavbar} from '@/components/layout/AuthNavbar';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <div className="container mx-auto px-4 py-8">
        {props.children}
      </div>
    </div>
  );
}
