import {getTranslations, setRequestLocale} from 'next-intl/server';
import Link from 'next/link';
import {Container} from '@/components/layout/Container';
import {Button} from '@/components/lovpen-ui/button';
import {Card, CardContent, CardHeader, CardIcon} from '@/components/lovpen-ui/card';
import {Logo} from '@/components/lovpen-ui/logo';
import {PlatformShowcase} from '@/components/lovpen-ui/platform-showcase';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/lovpen-ui/tabs';

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
      title: '碎片化思考收集',
      description: '类似flomo的灵感捕捉，支持语音、文字、图片等多种输入。随时记录观点，LovPen帮你汇聚成完整文章。',
    },
    {
      icon: '🔗',
      title: '观点智能整合',
      description: '将零散的想法、会议记录、读书笔记智能串联，自动发现关联性，组织成逻辑清晰的文章结构。',
    },
    {
      icon: '📊',
      title: '多格式内容输入',
      description: '支持报告文档、PPT大纲、表格数据等多种格式输入，智能解析并转化为优质图文内容。',
    },
    {
      icon: '✨',
      title: '美丽图文生成',
      description: '自动配图、智能排版、优雅字体，生成值得信赖的专业级图文内容，让每一份作品都赏心悦目。',
    },
    {
      icon: '🌐',
      title: '全平台精准适配',
      description: '支持微信公众号、知乎、小红书、Twitter、LinkedIn等20+平台，根据平台特性自动优化内容格式。',
    },
    {
      icon: '🎯',
      title: '风格学习引擎',
      description: '学习你喜欢的作者风格和表达习惯，确保输出内容既保持个人特色，又符合平台调性。',
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
                  立即开始创作
                </Link>
              </Button>
            </div>

            {/* LovPen Flow System */}
            <div className="mt-16 relative">
              <div className="max-w-6xl mx-auto">
                {/* 输入源环形布局 */}
                <div className="relative flex items-center justify-center min-h-[500px]">
                  {/* 输入源 - 左侧 */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-4">
                    <div
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform animate-pulse"
                      style={{animationDelay: '0s'}}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💭</span>
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">灵感闪现</p>
                          <p className="text-gray-600 text-xs">"今天突然想到..."</p>
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
                          <p className="font-medium text-gray-800">工作报告</p>
                          <p className="text-gray-600 text-xs">数据分析文档</p>
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
                          <p className="font-medium text-gray-800">语音备忘</p>
                          <p className="text-gray-600 text-xs">随时记录想法</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 流动线条 - 输入到引擎 */}
                  <div className="absolute left-32 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center">
                      <div
                        className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full relative overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
                        >
                        </div>
                      </div>
                      <div
                        className="w-0 h-0 border-l-8 border-l-purple-500 border-t-4 border-b-4 border-t-transparent border-b-transparent"
                      >
                      </div>
                    </div>
                  </div>

                  {/* LovPen 引擎 - 中心 */}
                  <div className="relative z-10">
                    <div
                      className="w-40 h-40 bg-gradient-to-br from-primary to-swatch-cactus rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30"
                    >
                      <div className="text-center text-white">
                        <div className="mb-2 flex justify-center">
                          <Logo
                            variant="pure"
                            size="lg"
                            color="white"
                          />
                        </div>
                        <div className="text-xl font-bold">LovPen</div>
                      </div>
                    </div>
                    {/* 脉动效果 */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-swatch-cactus/20 rounded-full animate-ping"
                    >
                    </div>
                    <div
                      className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-swatch-cactus/10 rounded-full animate-pulse"
                    >
                    </div>
                  </div>

                  {/* 流动线条 - 引擎到输出 */}
                  <div className="absolute right-32 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center">
                      <div
                        className="w-0 h-0 border-r-8 border-r-green-500 border-t-4 border-b-4 border-t-transparent border-b-transparent"
                      >
                      </div>
                      <div
                        className="w-24 h-1 bg-gradient-to-r from-green-500 to-cyan-400 rounded-full relative overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
                        >
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 输出平台 - 右侧 */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4">
                    <div
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">微信公众号</p>
                          <p className="text-gray-600 text-xs">专业排版</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎓</span>
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">知乎/小红书</p>
                          <p className="text-gray-600 text-xs">精美图文</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:scale-105 transition-transform"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🌐</span>
                        <div className="text-sm">
                          <p className="font-medium text-gray-800">20+平台</p>
                          <p className="text-gray-600 text-xs">一键分发</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 闭环反馈线 */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div
                      className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 shadow-lg"
                    >
                      <span className="text-lg">📊</span>
                      <span className="text-sm text-gray-700">数据反馈优化</span>
                      <div
                        className="w-6 h-6 border-2 border-gray-400 border-t-primary rounded-full animate-spin"
                      >
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部说明 */}
                <div className="text-center mt-8">
                  <p className="text-lg text-text-faded mb-2">每天的灵感流动，经过 LovPen 智能处理</p>
                  <p className="text-sm text-text-muted">形成精美内容，流向各大平台，数据闭环优化</p>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* AI Process & Platform Support Section */}
      <section className="w-full py-16 lg:py-24 u-bg-ivory-medium u-bg-premium-texture relative">
        <Container>
          <div className="text-center mb-16">
            <h2 className="u-display-m mb-4 text-text-main">{t('ai_process_title')}</h2>
            <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
              {t('ai_process_subtitle')}
            </p>
          </div>

          <PlatformShowcase/>
        </Container>
      </section>

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
            <h2 className="u-display-m mb-4 text-text-main">LovPen 让每个人都能成为优秀创作者</h2>
            <p className="u-paragraph-l text-text-faded">
              无论你的写作基础如何，LovPen 都能帮你创作出专业级别的内容
            </p>
          </div>

          <Tabs defaultValue="personal" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">个人品牌</TabsTrigger>
              <TabsTrigger value="lifestyle">生活博主</TabsTrigger>
              <TabsTrigger value="tech">技术博主</TabsTrigger>
              <TabsTrigger value="business">企业团队</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="u-display-s text-text-main">LovPen 放大了我的影响力</h3>
                <p className="u-paragraph-m text-text-faded">
                  "有了 LovPen 的帮助，我能保持高频的优质内容输出。LovPen 不仅学会了我的观点表达，还能根据不同平台的用户特点调整内容深度和风格。"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">李老师</span>
                  <span>•</span>
                  <span>知识博主</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="u-display-s text-text-main">LovPen 学会了我的美学品味</h3>
                <p className="u-paragraph-m text-text-faded">
                  "我让 LovPen 学习了几位知名博主的文风，现在它能用温暖细腻的笔触描述我的生活。旅行感悟、美食体验，LovPen
                  写得比我自己还动人。"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">小悦</span>
                  <span>•</span>
                  <span>生活方式博主</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="u-display-s text-text-main">LovPen 让技术写作更简单</h3>
                <p className="u-paragraph-m text-text-faded">
                  "我只需要说出技术要点，LovPen 就能基于我的知识库生成专业的技术文章。从算法原理到代码实现，LovPen
                  都能用我习惯的表达方式完美呈现。"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">张工</span>
                  <span>•</span>
                  <span>全栈开发者</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-8">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="u-display-s text-text-main">LovPen 团队的内容策略师</h3>
                <p className="u-paragraph-m text-text-faded">
                  "LovPen 学习了我们品牌的语调和客户的偏好，能为不同平台生成精准的营销内容。从严肃的商业分析到轻松的社交媒体文案，风格切换自如。"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-text-faded">
                  <span className="font-medium">王总</span>
                  <span>•</span>
                  <span>内容营销负责人</span>
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
            <h2 className="u-display-m mb-4 text-text-main">选择适合你的创作方案</h2>
            <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
              从个人创作者到专业团队，LovPen 为每个阶段提供贴心服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* 免费版 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">免费体验</h3>
                <div className="text-3xl font-bold text-text-main mb-4">
¥0
<span className="text-sm font-normal text-text-faded">/月</span>
                </div>
                <p className="text-sm text-text-faded mb-6">探索 LovPen 的基础功能</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  每月 10 篇文章生成
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  基础模板库
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  3个平台发布
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  社区支持
                </li>
              </ul>
              <Button variant="secondary" size="md" className="w-full">
                免费开始
              </Button>
            </div>

            {/* 入门版 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">入门创作</h3>
                <div className="text-3xl font-bold text-text-main mb-4">
¥29
<span className="text-sm font-normal text-text-faded">/月</span>
                </div>
                <p className="text-sm text-text-faded mb-6">适合初学者的创作工具</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  每月 50 篇文章生成
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  标准模板库
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  10个平台发布
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  邮件支持
                </li>
              </ul>
              <Button variant="secondary" size="md" className="w-full">
                立即开始
              </Button>
            </div>

            {/* 专业版 */}
            <div className="bg-gradient-to-br from-primary/5 to-swatch-cactus/5 rounded-2xl p-6 border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">推荐</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">专业创作</h3>
                <div className="text-3xl font-bold text-text-main mb-4">
¥99
<span className="text-sm font-normal text-text-faded">/月</span>
                </div>
                <p className="text-sm text-text-faded mb-6">适合认真创作的个人用户</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  无限文章生成
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  全部模板库
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  20+平台发布
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  风格学习训练
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  优先客服支持
                </li>
              </ul>
              <Button variant="primary" size="md" className="w-full">
                立即订阅
              </Button>
            </div>

            {/* 团队版 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary/30 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-main mb-2">团队协作</h3>
                <div className="text-2xl font-bold text-text-main mb-4">
联系销售
<span className="text-xs font-normal text-text-faded block">定制报价</span>
                </div>
                <p className="text-sm text-text-faded mb-6">企业级内容创作解决方案</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  专业版全部功能
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  团队协作工作区
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  品牌风格定制
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  数据分析报告
                </li>
                <li className="flex items-center text-sm text-text-main">
                  <span className="text-green-500 mr-2">✓</span>
                  专属客户经理
                </li>
              </ul>
              <Button variant="secondary" size="md" className="w-full">
                联系销售
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-16 lg:py-24 u-bg-ivory-medium u-bg-premium-texture relative">
        <Container>
          <div className="text-center mb-16">
            <h2 className="u-display-m mb-4 text-text-main">关于 LovPen</h2>
            <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
              我们致力于让每个人都能轻松创作出专业级的内容
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-text-main mb-6">让创作回归本质</h3>
              <div className="space-y-6">
                <p className="text-lg text-text-faded">
                  在信息爆炸的时代，优质内容变得比以往任何时候都更加重要。但传统的创作方式往往耗时费力，让许多有价值的想法无法得到及时表达。
                </p>
                <p className="text-lg text-text-faded">
                  LovPen 相信，技术应该赋能创作者，而不是取代创作者。我们通过 AI 技术帮助你把想法快速转化为精美的图文内容，让你专注于最重要的事情——思考和创新。
                </p>
                <p className="text-lg text-text-faded">
                  无论你是个人博主、知识工作者，还是企业内容团队，LovPen 都能学习你的风格，理解你的需求，成为你最可靠的创作伙伴。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-2">我们的使命</h4>
                  <p className="text-text-faded">让每个有想法的人都能轻松创作出专业级的内容</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-2">我们的愿景</h4>
                  <p className="text-text-faded">成为全球创作者最信赖的智能创作平台</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mb-2">我们的价值观</h4>
                  <p className="text-text-faded">用爱创作，让技术温暖人心</p>
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
                  立即开始创作
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div
              className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-text-faded max-w-4xl mx-auto"
            >
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <span className="text-green-600 text-lg">✨</span>
                <span>专业级美丽图文</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <span className="text-green-600 text-lg">🎯</span>
                <span>值得信赖的内容质量</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <span className="text-green-600 text-lg">🌐</span>
                <span>20+平台精准适配</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <span className="text-green-600 text-lg">💭</span>
                <span>碎片化思考整合</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
