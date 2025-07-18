import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Card, CardContent, CardHeader, CardIcon} from '@/components/lovpen-ui/card';

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
    <Container>
      <section id="features" className="w-full py-16 lg:py-24 bg-white u-bg-subtle-waves relative">
        <div className="text-center mb-16">
          <h2 className="u-display-m mb-4 text-text-main">{t('features_title')}</h2>
          <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
            {t('features_subtitle')}
          </p>
        </div>

        <div className="u-grid-desktop gap-8">
          {features.map(feature => (
            <div key={feature.title} className="lg:col-span-4">
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardIcon>
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {feature.icon}
                  </div>
                </CardIcon>
                <CardContent>
                  <CardHeader>
                    <h3 className="u-display-s mb-2 text-text-main">{feature.title}</h3>
                  </CardHeader>
                  <p className="u-paragraph-m text-text-faded">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
