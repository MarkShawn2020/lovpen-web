import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {Button} from '@/components/lovpen-ui/button';
import {Logo} from '@/components/lovpen-ui/logo';

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
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-background-main via-background-ivory-light to-background-ivory-medium"
    >
      {/* 动态背景效果 */}
      <div className="absolute inset-0 z-0">
        {/* 渐变动画背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-swatch-cactus/5 to-primary/20 animate-pulse" style={{animationDuration: '4s'}} />
        
        {/* 浮动粒子效果 */}
        <div className="absolute inset-0 opacity-30">
          {/* 大圆点 */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '0s', animationDuration: '6s'}} />
          <div className="absolute top-40 right-20 w-24 h-24 bg-swatch-cactus/30 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}} />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-primary/25 rounded-full blur-md animate-pulse" style={{animationDelay: '4s', animationDuration: '7s'}} />
          <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-swatch-cactus/20 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}} />
        </div>

        {/* 网格纹理 */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
        />
      </div>

      <Container>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 lg:py-24">
          
          {/* 震撼的品牌展示 */}
          <div className="text-center mb-12" style={{animation: 'fade-in-up 0.8s ease-out'}}>
            <div className="mb-8 relative">
              <div className="relative inline-block">
                <Logo variant="horizontal" size="xl" className="drop-shadow-2xl scale-150" />
                {/* 发光效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-swatch-cactus/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '3s'}} />
              </div>
            </div>
            
            {/* 主标题 - 分层展示 */}
            <div className="space-y-4 mb-8">
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-swatch-cactus to-primary leading-tight"
                style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-x 3s ease infinite'
                  }}
              >
                {t('hero_title')}
              </h1>
              
              {/* 动态强调标语 */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-swatch-cactus/10 p-6 backdrop-blur-sm border border-primary/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-swatch-cactus/5 animate-pulse" />
                <p className="relative text-xl md:text-2xl lg:text-3xl font-medium text-text-main leading-relaxed">
                  {t('hero_subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* 核心数据展示 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
            <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">10K+</div>
              <div className="text-text-faded font-medium">活跃用户</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-black text-swatch-cactus mb-2">99.9%</div>
              <div className="text-text-faded font-medium">可用性</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">24/7</div>
              <div className="text-text-faded font-medium">智能服务</div>
            </div>
          </div>

          {/* 震撼的CTA按钮组 */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-swatch-cactus rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
              <Button variant="primary" size="lg" className="relative text-xl px-12 py-6 bg-gradient-to-r from-primary to-swatch-cactus hover:from-primary/90 hover:to-swatch-cactus/90 shadow-2xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/create">
                  <span className="mr-2">🚀</span>
                  {t('hero_cta_primary')}
                </Link>
              </Button>
            </div>
            
            <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-2 border-primary/30 hover:border-primary/70 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105" asChild>
              <Link href="/demo">
                <span className="mr-2">🎯</span>
                观看演示
              </Link>
            </Button>
          </div>

          {/* 信任指标 */}
          <div className="mt-16 text-center">
            <p className="text-sm text-text-faded mb-6">已被全球用户信赖</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span className="text-sm font-medium">Product Hunt #1</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm font-medium">4.9/5 用户评分</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <span className="text-sm font-medium">企业级安全</span>
              </div>
            </div>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full p-1">
              <div className="w-1 h-3 bg-primary/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </Container>

      {/* 全局样式定义 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }}
      />
    </AnchorSection>
  );
}
