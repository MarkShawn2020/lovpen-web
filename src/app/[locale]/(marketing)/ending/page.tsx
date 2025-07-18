import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/lovpen-ui/button';

type IEndingProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IEndingProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('cta_title'),
    description: t('cta_subtitle'),
  };
}

export default async function Ending(props: IEndingProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <Container>
      <section
        className="w-full py-16 lg:py-24 bg-gradient-to-r from-primary/10 to-swatch-cactus/10 u-bg-organic-noise relative"
      >
        <div className="text-center">
          <h2 className="u-display-m text-text-main mb-6">{t('cta_title')}</h2>
          <p className="u-paragraph-l text-text-faded mb-8 max-w-2xl mx-auto">
            {t('cta_subtitle')}
          </p>
          <div className="flex justify-center">
            <Button variant="primary" size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/create">
                {t('hero_cta_primary')}
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-text-faded max-w-4xl mx-auto"
          >
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-green-600 text-lg">✨</span>
              <span>{t('trust_1')}</span>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-green-600 text-lg">🎯</span>
              <span>{t('trust_2')}</span>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-green-600 text-lg">🌐</span>
              <span>{t('trust_3')}</span>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-green-600 text-lg">💭</span>
              <span>{t('trust_4')}</span>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
