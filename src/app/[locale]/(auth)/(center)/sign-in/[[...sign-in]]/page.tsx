import {redirect} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';

type ISignInPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage(props: ISignInPageProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  // Redirect to the new login page
  redirect(`/${locale}/login`);
};
