import {setRequestLocale} from 'next-intl/server';
import {Footer} from '@/components/layout/Footer';
import {LandingNavbar} from '@/components/layout/LandingNavbar';
import {NotificationBanner} from '@/components/NotificationBanner';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <>
      <NotificationBanner/>
      <div className="min-h-screen flex flex-col">
        <LandingNavbar/>
        <main className="flex-grow">
          {props.children}
        </main>
        <Footer/>
      </div>
    </>
  );
}
