import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {PlatformShowcase} from '@/components/lovpen-ui/platform-showcase';

type IWorkflowProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IWorkflowProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('ai_process_title'),
    description: t('ai_process_subtitle'),
  };
}

export default async function Workflow(props: IWorkflowProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <Container>
      <AnchorSection id="workflow" className="w-full py-16 lg:py-24 u-bg-ivory-medium u-bg-premium-texture relative">
        <div className="text-center mb-16">
          <h2 className="u-display-m mb-4 text-text-main">{t('ai_process_title')}</h2>
          <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
            {t('ai_process_subtitle')}
          </p>
        </div>
        <PlatformShowcase/>
      </AnchorSection>
    </Container>
  );
}
