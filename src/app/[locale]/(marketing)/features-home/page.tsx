import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';

type IFeaturesHomeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IFeaturesHomeProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('features_title'),
    description: t('features_subtitle'),
  };
}

export default async function FeaturesHome(props: IFeaturesHomeProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  const features = [
    {
      icon: '💭',
      title: t('feature_1_title'),
      description: t('feature_1_description'),
    },
    {
      icon: '🔗',
      title: t('feature_2_title'),
      description: t('feature_2_description'),
    },
    {
      icon: '📊',
      title: t('feature_3_title'),
      description: t('feature_3_description'),
    },
    {
      icon: '✨',
      title: t('feature_4_title'),
      description: t('feature_4_description'),
    },
    {
      icon: '🌐',
      title: t('feature_5_title'),
      description: t('feature_5_description'),
    },
    {
      icon: '🎯',
      title: t('feature_6_title'),
      description: t('feature_6_description'),
    },
  ];

  return (
    <AnchorSection id="features" className="w-full py-16 lg:py-24 bg-brand-subtle relative">
      <Container>
        <div className="text-center mb-16">
          <h2 className="u-display-m mb-4 text-brand-gradient">{t('features_title')}</h2>
          <p className="u-paragraph-l text-text-main max-w-3xl mx-auto">
            {t('features_subtitle')}
          </p>
        </div>

        <div className="u-grid-desktop u-gap-l">
          {features.map((feature, index) => (
            <div key={feature.title} className="lg:col-span-4">
              <div className={`h-full p-8 rounded-lg transition-all duration-300 hover:scale-105 ${
                index % 3 === 0
? 'card-brand-primary hover:shadow-brand-primary'
                : index % 3 === 1
? 'card-brand-secondary hover:shadow-brand-secondary'
                : 'card-brand-gradient hover:shadow-brand-warm'
              }`}
              >
                <div className="flex flex-col h-full">
                  <div className={`w-16 h-16 mb-6 text-4xl flex items-center justify-center rounded-lg ${
                    index % 3 === 0
? 'bg-brand-primary/10'
                    : index % 3 === 1
? 'bg-brand-secondary/10'
                    : 'bg-brand-gradient/10'
                  }`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`u-display-s mb-2 ${
                      index % 3 === 0
? 'text-brand-primary'
                      : index % 3 === 1
? 'text-brand-secondary'
                      : 'text-brand-gradient'
                    }`}
                    >
{feature.title}
                    </h3>
                    <p className="u-paragraph-m text-text-main leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </AnchorSection>
  );
}
