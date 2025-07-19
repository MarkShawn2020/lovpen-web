import {getTranslations} from 'next-intl/server';
import {Steps} from './steps';

type StepsServerProps = {
  locale?: string;
}

const StepsServer = async ({ locale }: StepsServerProps) => {
  const t = await getTranslations({
    locale: locale || 'zh',
    namespace: 'Index' as const,
  });

  // 将翻译值作为 props 传递而不是函数
  const stepData = {
    step1: {
      title: t('steps_1_title'),
      description: t('steps_1_description'),
      features: [t('steps_1_feature_1'), t('steps_1_feature_2'), t('steps_1_feature_3')],
    },
    step2: {
      title: t('steps_2_title'),
      description: t('steps_2_description'),
      features: [t('steps_2_feature_1'), t('steps_2_feature_2'), t('steps_2_feature_3')],
    },
    step3: {
      title: t('steps_3_title'),
      description: t('steps_3_description'),
      features: [t('steps_3_feature_1'), t('steps_3_feature_2'), t('steps_3_feature_3')],
    },
    step4: {
      title: t('steps_4_title'),
      description: t('steps_4_description'),
      features: [t('steps_4_feature_1'), t('steps_4_feature_2'), t('steps_4_feature_3')],
    },
    step5: {
      title: t('steps_5_title'),
      description: t('steps_5_description'),
      features: [t('steps_5_feature_1'), t('steps_5_feature_2'), t('steps_5_feature_3')],
    },
  };

  return <Steps stepData={stepData} />;
};

export { StepsServer };
