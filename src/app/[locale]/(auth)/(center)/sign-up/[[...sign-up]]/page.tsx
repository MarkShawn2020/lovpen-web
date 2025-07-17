import {redirect} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';

type ISignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage(props: ISignUpPageProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  // Redirect to the new register page
  redirect(`/${locale}/register`);
};
