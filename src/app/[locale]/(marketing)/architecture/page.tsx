import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {Logo} from '@/components/lovpen-ui/logo';

type IArchitectureProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IArchitectureProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Architecture',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Architecture(props: IArchitectureProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Architecture',
  });

  return (
    <Container>
      <div className="mt-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-main mb-4">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-text-faded">
              {t('hero_subtitle')}
            </p>
          </div>

          {/* 流程布局 - 中心对称绝对定位架构 */}
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            
            {/* 桌面端：中心对称绝对定位布局 */}
            <div className="hidden lg:block relative w-full h-[600px]">
              
              {/* 中心基准点：LovPen 引擎 - 屏幕正中心 */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-primary to-swatch-cactus rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <div className="text-center text-white">
                      <div className="mb-2 flex justify-center">
                        <Logo
                          variant="pure"
                          size="lg"
                          color="white"
                        />
                      </div>
                      <div className="text-lg font-bold">LovPen</div>
                    </div>
                  </div>
                  {/* 脉动效果 */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-swatch-cactus/20 rounded-full animate-ping"
                    style={{animationDuration: '2s'}}
                  />
                  <div
                    className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-swatch-cactus/10 rounded-full animate-pulse"
                    style={{animationDuration: '3s'}}
                  />
                </div>
              </div>

              {/* 左侧输入区域 - 从中心向左 280px */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-full -translate-y-1/2 -ml-[280px]">
                <div className="w-[260px] space-y-6">
                  <div
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform animate-pulse"
                    style={{animationDelay: '0s'}}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl flex-shrink-0">💭</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_input_idea')}</p>
                        <p className="text-gray-600 text-xs">
                          {t('flow_input_idea_desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform animate-pulse"
                    style={{animationDelay: '1s'}}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_input_report')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_input_report_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform animate-pulse"
                    style={{animationDelay: '2s'}}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎤</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_input_voice')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_input_voice_desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧输出区域 - 从中心向右 280px (与左侧完全对称) */}
              <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 ml-[280px]">
                <div className="w-[260px] space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📱</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_output_wechat')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_output_wechat_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎓</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_output_social')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_output_social_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌐</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_output_platforms')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_output_platforms_desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 左箭头 - 精确连接左侧到中心 */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -ml-[100px]">
                <div className="flex items-center">
                  <div className="w-[80px] h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-primary rounded-full relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"
                      style={{animationDuration: '2s'}}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ping"
                      style={{animationDuration: '3s', animationDelay: '0.5s'}}
                    />
                  </div>
                  <div className="w-0 h-0 border-l-[12px] border-l-primary border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent ml-1" />
                </div>
              </div>

              {/* 右箭头 - 精确连接中心到右侧 (与左箭头完全对称) */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-[100px]">
                <div className="flex items-center">
                  <div className="w-0 h-0 border-r-[12px] border-r-swatch-cactus border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent mr-1" />
                  <div className="w-[80px] h-2 bg-gradient-to-r from-swatch-cactus via-green-500 to-cyan-400 rounded-full relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"
                      style={{animationDuration: '2s', animationDelay: '1s'}}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-ping"
                      style={{animationDuration: '3s', animationDelay: '1.5s'}}
                    />
                  </div>
                </div>
              </div>

              {/* 闭环反馈线 - 底部中心 */}
              <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2">
                <div className="flex items-center space-x-3 bg-white/85 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="text-lg">📊</span>
                  <span className="text-sm text-gray-700 font-medium">{t('flow_feedback')}</span>
                  <div
                    className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"
                    style={{animationDuration: '1.5s'}}
                  />
                </div>
              </div>
            </div>

            {/* 移动端垂直流程布局 */}
            <div className="lg:hidden space-y-8 px-4">
              {/* 输入源 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">{t('input_section_title')}</h3>
                <div className="space-y-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💭</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_input_idea')}</p>
                        <p className="text-gray-600 text-xs">
                          {t('flow_input_idea_desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_input_report')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_input_report_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎤</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_input_voice')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_input_voice_desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 向下箭头 */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-16 bg-gradient-to-b from-blue-400 to-primary rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse"></div>
                  </div>
                  <div className="w-0 h-0 border-t-[12px] border-t-primary border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent"></div>
                </div>
              </div>

              {/* LovPen 引擎 */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-swatch-cactus rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <div className="text-center text-white">
                      <div className="mb-2 flex justify-center">
                        <Logo variant="pure" size="md" color="white" />
                      </div>
                      <div className="text-lg font-bold">LovPen</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-swatch-cactus/20 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* 向下箭头 */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-16 bg-gradient-to-b from-swatch-cactus to-cyan-400 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse"></div>
                  </div>
                  <div className="w-0 h-0 border-t-[12px] border-t-cyan-400 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent"></div>
                </div>
              </div>

              {/* 输出平台 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">{t('output_section_title')}</h3>
                <div className="space-y-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📱</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_output_wechat')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_output_wechat_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎓</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_output_social')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_output_social_desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌐</span>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{t('flow_output_platforms')}</p>
                        <p className="text-gray-600 text-xs">{t('flow_output_platforms_desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 反馈循环 - 移动端 */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-lg">
                  <span className="text-lg">📊</span>
                  <span className="text-sm text-gray-700 font-medium">{t('flow_feedback')}</span>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部说明 */}
          <div className="text-center mt-8">
            <p className="text-lg text-text-faded mb-2">{t('flow_description_1')}</p>
            <p className="text-sm text-text-muted">{t('flow_description_2')}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
