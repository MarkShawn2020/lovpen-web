import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/lovpen-ui/button';
import Architecture from "@/app/[locale]/(marketing)/architecture/page";
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
  const t = await getTranslations('Index');

  return (
    <>
      {/* Hero Section */}
      <section
        className="w-full py-16 lg:py-24 bg-gradient-to-b from-background-main to-background-ivory-medium u-bg-layered-subtle relative overflow-hidden"
      >
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="u-display-xl mb-6 text-text-main">
              {t('hero_title')}
            </h1>
            <p className="u-paragraph-l mb-8 text-text-faded max-w-3xl mx-auto">
              {t('hero_subtitle')}
            </p>
            <div className="flex justify-center mb-12">
              <Button variant="primary" size="lg" asChild>
                <Link href="/create">
                  {t('hero_cta_primary')}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Architecture Section */}
      <Architecture params={props.params}/>

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
