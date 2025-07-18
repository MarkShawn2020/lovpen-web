import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {Button} from '@/components/lovpen-ui/button';
import {Logo} from '@/components/lovpen-ui/logo';
import {AuthAwareButton} from '@/components/auth/AuthAwareButton';

type IHeroProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IHeroProps) {
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

export default async function Hero(props: IHeroProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <AnchorSection
      id="hero"
      className="relative w-full min-h-screen bg-brand-texture"
    >
      {/* 品牌色背景 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-mesh opacity-80" />
        <div className="absolute inset-0 u-bg-subtle-dots opacity-20" />
      </div>

      <Container>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 lg:py-24">
          
          {/* 品牌展示 */}
          <div className="text-center mb-16 max-w-4xl">
            <div className="mb-8">
              <Logo variant="horizontal" size="xl" className="mb-8 text-brand-primary" />
            </div>
            
            {/* 主标题 */}
            <div className="space-y-6 mb-12">
              <h1 className="u-display-xl text-brand-gradient">
                {t('hero_title')}
              </h1>
              
              {/* 副标题 */}
              <p className="u-paragraph-l text-text-main">
                {t('hero_subtitle')}
              </p>
            </div>
          </div>

          {/* 核心特性展示 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
            <div className="text-center p-6 card-brand-primary rounded-lg hover:shadow-brand-primary transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="u-display-s mb-2 text-brand-primary">守护初心</h3>
              <p className="u-paragraph-m text-text-main">呵护每一个念头萌芽</p>
            </div>
            <div className="text-center p-6 card-brand-secondary rounded-lg hover:shadow-brand-secondary transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="u-display-s mb-2 text-brand-secondary">温暖陪伴</h3>
              <p className="u-paragraph-m text-text-main">与想法为伴的旅程</p>
            </div>
            <div className="text-center p-6 card-brand-gradient rounded-lg hover:shadow-brand-warm transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🌉</div>
              <h3 className="u-display-s mb-2 text-brand-gradient">连接心灵</h3>
              <p className="u-paragraph-m text-text-main">架起理解的桥梁</p>
            </div>
          </div>

          {/* CTA按钮组 */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-brand-gradient rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-300" />
              <AuthAwareButton 
                variant="primary" 
                size="lg" 
                className="relative shadow-brand-primary hover:shadow-brand-warm"
                authenticatedHref="/playground"
                unauthenticatedHref="/register"
              >
                {t('hero_cta_primary')}
              </AuthAwareButton>
            </div>
            
            <Button variant="outline" size="lg" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-brand-primary" asChild>
              <Link href="/demo">
                观看演示
              </Link>
            </Button>
          </div>

          {/* 产品亮点 */}
          <div className="mt-16 text-center">
            <p className="u-paragraph-m text-text-main mb-8">为创作者和内容团队而生</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center space-x-2 hover-brand-primary cursor-pointer transition-all duration-300">
                <span className="text-xl">🕊️</span>
                <span className="u-paragraph-m text-text-main">安全表达</span>
              </div>
              <div className="flex items-center space-x-2 hover-brand-primary cursor-pointer transition-all duration-300">
                <span className="text-xl">🌱</span>
                <span className="u-paragraph-m text-text-main">自然成长</span>
              </div>
              <div className="flex items-center space-x-2 hover-brand-primary cursor-pointer transition-all duration-300">
                <span className="text-xl">💫</span>
                <span className="u-paragraph-m text-text-main">真实共鸣</span>
              </div>
            </div>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-brand-primary rounded-full p-1 opacity-80">
              <div className="w-1 h-3 bg-brand-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </Container>
    </AnchorSection>
  );
}
