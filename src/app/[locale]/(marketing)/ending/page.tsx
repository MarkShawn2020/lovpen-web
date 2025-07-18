import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {AuthAwareButton} from '@/components/auth/AuthAwareButton';

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
    <AnchorSection
      id="ending"
      className="w-full py-16 lg:py-24 bg-brand-gradient u-bg-organic-noise relative"
    >
      <Container>
        <div className="text-center">
          <h2 className="u-display-m text-white mb-6">{t('cta_title')}</h2>
          <p className="u-paragraph-l text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta_subtitle')}
          </p>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-white/20 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300" />
              <AuthAwareButton 
                variant="secondary" 
                size="lg" 
                className="relative text-lg px-8 py-4 bg-white text-brand-primary hover:bg-white/90 border-white"
                authenticatedHref="/playground"
                unauthenticatedHref="/register"
              >
                {t('hero_cta_primary')}
              </AuthAwareButton>
            </div>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-white/80 max-w-4xl mx-auto"
          >
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-white text-lg">✨</span>
              <span>{t('trust_1')}</span>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-white text-lg">🎯</span>
              <span>{t('trust_2')}</span>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-white text-lg">🌐</span>
              <span>{t('trust_3')}</span>
            </div>
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <span className="text-white text-lg">💭</span>
              <span>{t('trust_4')}</span>
            </div>
          </div>
        </div>
      </Container>
    </AnchorSection>
  );
}
