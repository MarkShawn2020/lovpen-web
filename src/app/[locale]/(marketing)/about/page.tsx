import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IAboutProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function About(props: IAboutProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return (
    <AnchorSection id="about" className="w-full py-16 lg:py-24 bg-brand-mesh u-bg-organic-noise relative">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="u-display-xl text-brand-gradient mb-6">
            {t('hero_title')}
          </h1>
          <p className="u-paragraph-l text-text-main max-w-3xl mx-auto">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="card-brand-primary p-8 rounded-lg mb-16">
          <h2 className="u-display-m text-brand-primary mb-6 text-center">
            {t('mission_title')}
          </h2>
          <p className="text-lg text-text-main text-center mb-8">
            {t('mission_description')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
              >
                💡
              </div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                {t('mission_point_1_title')}
              </h3>
              <p className="text-text-main">
                {t('mission_point_1_description')}
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
              >
                🤝
              </div>
              <h3 className="text-xl font-semibold text-brand-secondary mb-2">
                {t('mission_point_2_title')}
              </h3>
              <p className="text-text-main">
                {t('mission_point_2_description')}
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
              >
                🌍
              </div>
              <h3 className="text-xl font-semibold text-brand-gradient mb-2">
                {t('mission_point_3_title')}
              </h3>
              <p className="text-text-main">
                {t('mission_point_3_description')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Vision Section */}
        <div className="card-brand-secondary p-8 rounded-lg mb-16">
          <h2 className="u-display-m text-brand-secondary mb-6 text-center">
            {t('vision_title')}
          </h2>
          <p className="text-lg text-text-main text-center">
            {t('vision_description')}
          </p>
        </div>
        
        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-brand-gradient mb-8 text-center">
            {t('values_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-brand-primary p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-primary mb-3">
                {t('value_1_title')}
              </h3>
              <p className="text-text-main">
                {t('value_1_description')}
              </p>
            </div>
            <div className="card-brand-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-secondary mb-3">
                {t('value_2_title')}
              </h3>
              <p className="text-text-main">
                {t('value_2_description')}
              </p>
            </div>
            <div className="card-brand-gradient p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-gradient mb-3">
                {t('value_3_title')}
              </h3>
              <p className="text-text-main">
                {t('value_3_description')}
              </p>
            </div>
            <div className="card-brand-primary p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-primary mb-3">
                {t('value_4_title')}
              </h3>
              <p className="text-text-main">
                {t('value_4_description')}
              </p>
            </div>
          </div>
        </div>

      </Container>
    </AnchorSection>
  );
};
