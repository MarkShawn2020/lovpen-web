import {getTranslations, setRequestLocale} from 'next-intl/server';
import Hero from "@/app/[locale]/(marketing)/hero/page";
import Workflow from "@/app/[locale]/(marketing)/workflow/page";
import FeaturesHome from "@/app/[locale]/(marketing)/features-home/page";
import Cases from "@/app/[locale]/(marketing)/cases/page";
import Pricing from "@/app/[locale]/(marketing)/pricing/page";
import About from "@/app/[locale]/(marketing)/about/page";
import Ending from "@/app/[locale]/(marketing)/ending/page";

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <>
      {/* Hero Section */}
      <Hero params={props.params}/>

      {/* Architecture Section (add later) */}
      {/*<Architecture params={props.params}/>*/}

      {/* Workflow Section */}
      <Workflow params={props.params}/>

      {/* Features Section */}
      <FeaturesHome params={props.params}/>

      {/* Cases Section */}
      <Cases params={props.params}/>

      {/* Pricing Section */}
      <Pricing params={props.params}/>

      {/* About Section */}
      <About params={props.params}/>

      {/* Ending Section */}
      <Ending params={props.params}/>
    </>
  );
};
