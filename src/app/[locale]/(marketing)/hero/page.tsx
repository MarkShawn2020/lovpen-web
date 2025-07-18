import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {Button} from '@/components/lovpen-ui/button';

type IHeroProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IHeroProps) {
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

export default async function Hero(props: IHeroProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <AnchorSection
      id="hero"
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
    </AnchorSection>
  );
}
