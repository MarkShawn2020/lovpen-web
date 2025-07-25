import {setRequestLocale} from 'next-intl/server';
import {AuthNavbar} from '@/components/layout/AuthNavbar';
import {GlobalWaitlistNotification} from '@/components/GlobalWaitlistNotification';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <GlobalWaitlistNotification/>
      <div className="u-flex-page bg-gray-50">
        <AuthNavbar />
        <div className="u-flex-content u-container py-4">
          {props.children}
        </div>
      </div>
    </>
  );
}
