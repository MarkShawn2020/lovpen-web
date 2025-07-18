import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/lovpen-ui/tabs';

type ICasesProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ICasesProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('cases_title'),
    description: t('cases_subtitle'),
  };
}

export default async function Cases(props: ICasesProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <AnchorSection id="cases" className="w-full py-16 lg:py-24 bg-brand-mesh u-bg-premium-texture relative">
      <Container>
        <div className="text-center mb-12">
          <h2 className="u-display-m mb-4 text-brand-gradient">{t('cases_title')}</h2>
          <p className="u-paragraph-l text-text-main">
            {t('cases_subtitle')}
          </p>
        </div>

        <Tabs defaultValue="personal" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 bg-brand-soft border-brand-primary/20">
            <TabsTrigger value="personal">{t('case_personal_tab')}</TabsTrigger>
            <TabsTrigger value="lifestyle">{t('case_lifestyle_tab')}</TabsTrigger>
            <TabsTrigger value="tech">{t('case_tech_tab')}</TabsTrigger>
            <TabsTrigger value="business">{t('case_business_tab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-8">
            <div className="text-center space-y-4 card-brand-primary p-8 rounded-lg">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="u-display-s text-brand-primary">{t('case_personal_title')}</h3>
              <p className="u-paragraph-m text-text-main">
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
            <div className="text-center space-y-4 card-brand-secondary p-8 rounded-lg">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="u-display-s text-brand-secondary">{t('case_lifestyle_title')}</h3>
              <p className="u-paragraph-m text-text-main">
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
            <div className="text-center space-y-4 card-brand-gradient p-8 rounded-lg">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="u-display-s text-brand-gradient">{t('case_tech_title')}</h3>
              <p className="u-paragraph-m text-text-main">
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
            <div className="text-center space-y-4 card-brand-primary p-8 rounded-lg">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="u-display-s text-brand-primary">{t('case_business_title')}</h3>
              <p className="u-paragraph-m text-text-main">
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
    </AnchorSection>
  );
}
