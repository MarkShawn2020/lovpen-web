import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {WaitlistButton} from '@/components/ui/waitlist-button';

type IPricingProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IPricingProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Pricing',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Pricing(props: IPricingProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Pricing',
  });

  return (
    <AnchorSection id="pricing" className="w-full py-16 lg:py-24 bg-brand-subtle u-bg-premium-texture relative">
      <Container>
        <div className="text-center mb-12">
          <h1 className="u-display-m text-brand-gradient mb-4">
            {t('hero_title')}
          </h1>
          <p className="u-paragraph-l text-text-main">
            {t('hero_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div
            className="card-brand-primary p-8 rounded-lg border-2 border-transparent max-w-md sm:mx-auto md:max-w-none hover:shadow-brand-primary transition-all duration-300"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-brand-primary mb-2">
                {t('free_plan_name')}
              </h3>
              <div className="text-4xl font-bold text-brand-primary mb-2">
                {t('free_plan_price')}
              </div>
              <p className="text-text-main">
                {t('free_plan_description')}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('free_plan_feature_1')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('free_plan_feature_2')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('free_plan_feature_3')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('free_plan_feature_4')}
              </li>
            </ul>
            <WaitlistButton 
              source="pricing-free"
              variant="outline" 
              size="lg" 
              className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              {t('get_started')}
            </WaitlistButton>
          </div>

          {/* Pro Plan */}
          <div
            className="card-brand-gradient p-8 rounded-lg border-2 border-brand-primary relative max-w-md sm:mx-auto md:max-w-none hover:shadow-brand-warm transition-all duration-300 hover:scale-105"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand-gradient text-white px-4 py-1 rounded-full text-sm font-medium">
                {t('popular_badge')}
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-brand-gradient mb-2">
                {t('pro_plan_name')}
              </h3>
              <div className="text-4xl font-bold text-brand-gradient mb-2">
                {t('pro_plan_price')}
              </div>
              <p className="text-text-main">
                {t('pro_plan_description')}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('pro_plan_feature_1')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('pro_plan_feature_2')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('pro_plan_feature_3')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('pro_plan_feature_4')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('pro_plan_feature_5')}
              </li>
            </ul>
            <WaitlistButton 
              source="pricing-pro"
              variant="default" 
              size="lg" 
              className="w-full shadow-brand-warm bg-brand-primary text-white hover:bg-brand-primary/90"
            >
              {t('upgrade_to_pro')}
            </WaitlistButton>
          </div>

          {/* Enterprise Plan */}
          <div
            className="card-brand-secondary p-8 rounded-lg border-2 border-transparent max-w-md sm:mx-auto md:max-w-none hover:shadow-brand-secondary transition-all duration-300"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-brand-secondary mb-2">
                {t('enterprise_plan_name')}
              </h3>
              <div className="text-4xl font-bold text-brand-secondary mb-2">
                {t('enterprise_plan_price')}
              </div>
              <p className="text-text-main">
                {t('enterprise_plan_description')}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('enterprise_plan_feature_1')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('enterprise_plan_feature_2')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('enterprise_plan_feature_3')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('enterprise_plan_feature_4')}
              </li>
              <li className="flex items-center text-text-main">
                <span className="text-success mr-2">✓</span>
                {t('enterprise_plan_feature_5')}
              </li>
            </ul>
            <WaitlistButton 
              source="pricing-enterprise"
              variant="outline" 
              size="lg" 
              className="w-full border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white"
            >
              {t('contact_sales')}
            </WaitlistButton>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-brand-gradient mb-8">
            {t('faq_title')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card-brand-primary p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                {t('faq_1_question')}
              </h3>
              <p className="text-text-main">
                {t('faq_1_answer')}
              </p>
            </div>
            <div className="card-brand-secondary p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-secondary mb-2">
                {t('faq_2_question')}
              </h3>
              <p className="text-text-main">
                {t('faq_2_answer')}
              </p>
            </div>
            <div className="card-brand-gradient p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-brand-gradient mb-2">
                {t('faq_3_question')}
              </h3>
              <p className="text-text-main">
                {t('faq_3_answer')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </AnchorSection>
  );
}
