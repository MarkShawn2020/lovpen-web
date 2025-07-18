import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/lovpen-ui/button';
import {Card, CardContent, CardHeader, CardIcon} from '@/components/lovpen-ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/lovpen-ui/tabs';
import Architecture from "@/app/[locale]/(marketing)/architecture/page";
import Workflow from "@/app/[locale]/(marketing)/workflow/page";

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

            {/* LovPen Flow System */}
            <Architecture params={props.params}/>

          </div>
        </Container>
      </section>

      {/* AI Process & Platform Support Section */}
      <Workflow params={props.params}/>

      {/* Features Section */}
      <section id="features" className="w-full py-16 lg:py-24 bg-white u-bg-subtle-waves relative">
        <Container>
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
        </Container>
      </section>

      {/* Cases Section */}
      <section id="cases" className="w-full py-16 lg:py-24 u-bg-ivory-medium u-bg-premium-texture relative">
        <Container>
          <div className="text-center mb-12">
            <h2 className="u-display-m mb-4 text-text-main">{t('cases_title')}</h2>
            <p className="u-paragraph-l text-text-faded">
              {t('cases_subtitle')}
            </p>
          </div>

          <Tabs defaultValue="personal" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">{t('case_personal_tab')}</TabsTrigger>
              <TabsTrigger value="lifestyle">{t('case_lifestyle_tab')}</TabsTrigger>
              <TabsTrigger value="tech">{t('case_tech_tab')}</TabsTrigger>
              <TabsTrigger value="business">{t('case_business_tab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="u-display-s text-text-main">{t('case_personal_title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  "
{t('case_personal_quote')}
"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">{t('case_personal_author')}</span>
                  <span>•</span>
                  <span>{t('case_personal_role')}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="u-display-s text-text-main">{t('case_lifestyle_title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  "
{t('case_lifestyle_quote')}
"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">{t('case_lifestyle_author')}</span>
                  <span>•</span>
                  <span>{t('case_lifestyle_role')}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="u-display-s text-text-main">{t('case_tech_title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  "
{t('case_tech_quote')}
"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">{t('case_tech_author')}</span>
                  <span>•</span>
                  <span>{t('case_tech_role')}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="u-display-s text-text-main">{t('case_business_title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  "
{t('case_business_quote')}
"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">{t('case_business_author')}</span>
                  <span>•</span>
                  <span>{t('case_business_role')}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-16 lg:py-24 bg-white relative">
        <Container>
          <div className="text-center mb-16">
            <h2 className="u-display-m mb-4 text-text-main">{t('pricing_title')}</h2>
            <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
              {t('pricing_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* 免费版 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">{t('plan_free_name')}</h3>
                <div className="text-3xl font-bold text-text-main mb-4">
{t('plan_free_price')}
<span className="text-sm font-normal text-text-faded">{t('plan_free_period')}</span>
                </div>
                <p className="text-sm text-text-faded mb-6">{t('plan_free_description')}</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_free_feature_1')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_free_feature_2')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_free_feature_3')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_free_feature_4')}
                </li>
              </ul>
              <Button variant="secondary" size="md" className="w-full">
                {t('plan_free_button')}
              </Button>
            </div>

            {/* 入门版 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">{t('plan_starter_name')}</h3>
                <div className="text-3xl font-bold text-text-main mb-4">
{t('plan_starter_price')}
<span className="text-sm font-normal text-text-faded">{t('plan_starter_period')}</span>
                </div>
                <p className="text-sm text-text-faded mb-6">{t('plan_starter_description')}</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_starter_feature_1')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_starter_feature_2')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_starter_feature_3')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_starter_feature_4')}
                </li>
              </ul>
              <Button variant="secondary" size="md" className="w-full">
                {t('plan_starter_button')}
              </Button>
            </div>

            {/* 专业版 */}
            <div className="bg-gradient-to-br from-primary/5 to-swatch-cactus/5 rounded-2xl p-6 border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">{t('plan_pro_badge')}</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">{t('plan_pro_name')}</h3>
                <div className="text-3xl font-bold text-text-main mb-4">
{t('plan_pro_price')}
<span className="text-sm font-normal text-text-faded">{t('plan_pro_period')}</span>
                </div>
                <p className="text-sm text-text-faded mb-6">{t('plan_pro_description')}</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_pro_feature_1')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_pro_feature_2')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_pro_feature_3')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_pro_feature_4')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_pro_feature_5')}
                </li>
              </ul>
              <Button variant="primary" size="md" className="w-full">
                {t('plan_pro_button')}
              </Button>
            </div>

            {/* 团队版 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">{t('plan_team_name')}</h3>
                <div className="text-2xl font-bold text-text-main mb-4">
{t('plan_team_price')}
<span className="text-xs font-normal text-text-faded block">{t('plan_team_period')}</span>
                </div>
                <p className="text-sm text-text-faded mb-6">{t('plan_team_description')}</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_team_feature_1')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_team_feature_2')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_team_feature_3')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_team_feature_4')}
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  {t('plan_team_feature_5')}
                </li>
              </ul>
              <Button variant="secondary" size="md" className="w-full">
                {t('plan_team_button')}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-16 lg:py-24 u-bg-ivory-medium u-bg-premium-texture relative">
        <Container>
          <div className="text-center mb-16">
            <h2 className="u-display-m mb-4 text-text-main">{t('about_title')}</h2>
            <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
              {t('about_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-text-main mb-6">{t('about_content_title')}</h3>
              <div className="space-y-6">
                <p className="text-lg text-text-faded">
                  {t('about_content_p1')}
                </p>
                <p className="text-lg text-text-faded">
                  {t('about_content_p2')}
                </p>
                <p className="text-lg text-text-faded">
                  {t('about_content_p3')}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-2">{t('about_mission_title')}</h4>
                  <p className="text-text-faded">{t('about_mission_desc')}</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-2">{t('about_vision_title')}</h4>
                  <p className="text-text-faded">{t('about_vision_desc')}</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-2">{t('about_values_title')}</h4>
                  <p className="text-text-faded">{t('about_values_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="w-full py-16 lg:py-24 bg-gradient-to-r from-primary/10 to-swatch-cactus/10 u-bg-organic-noise relative"
      >
        <Container>
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
        </Container>
      </section>
    </>
  );
};
