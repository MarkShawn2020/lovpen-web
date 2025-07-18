import {getTranslations, setRequestLocale} from 'next-intl/server';
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
    <AnchorSection id="workflow" className="w-full py-16 lg:py-24 bg-brand-subtle u-bg-premium-texture relative">
      <PlatformShowcase/>
    </AnchorSection>
  );
}
