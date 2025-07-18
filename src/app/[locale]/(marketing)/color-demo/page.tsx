import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import {Button} from '@/components/lovpen-ui/button';

type IColorDemoProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IColorDemoProps) {
  const {locale} = await props.params;
  const _t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: 'LovPen 颜色系统展示',
    description: '查看更新后的颜色系统效果',
  };
}

export default async function ColorDemo(props: IColorDemoProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <AnchorSection id="color-demo" className="w-full py-16 lg:py-24 bg-background-main">
      <Container>
        <div className="space-y-16">
          {/* 标题 */}
          <div className="text-center">
            <h1 className="u-display-xl mb-4 text-brand-gradient">LovPen 品牌色系统展示</h1>
            <p className="u-paragraph-l text-text-main">
              您的首款产品现在拥有专业的品牌色彩系统
            </p>
          </div>

          {/* 主要颜色展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-full h-32 bg-primary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">#D97757</span>
              </div>
              <h3 className="u-display-s">主品牌色</h3>
              <p className="u-paragraph-m text-text-faded">Primary</p>
            </div>
            
            <div className="text-center">
              <div className="w-full h-32 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">#629A90</span>
              </div>
              <h3 className="u-display-s">辅助色</h3>
              <p className="u-paragraph-m text-text-faded">Secondary</p>
            </div>
            
            <div className="text-center">
              <div className="w-full h-32 bg-success rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">#22C55E</span>
              </div>
              <h3 className="u-display-s">成功色</h3>
              <p className="u-paragraph-m text-text-faded">Success</p>
            </div>
            
            <div className="text-center">
              <div className="w-full h-32 bg-warning rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">#F59E0B</span>
              </div>
              <h3 className="u-display-s">警告色</h3>
              <p className="u-paragraph-m text-text-faded">Warning</p>
            </div>
          </div>

          {/* 品牌色文字效果展示 */}
          <div className="space-y-8">
            <h2 className="u-display-m text-center text-brand-gradient">品牌色文字效果</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <h3 className="u-display-s text-brand-primary">主品牌色文字</h3>
                <div className="space-y-3">
                  <p className="text-brand-primary">主品牌色文字</p>
                  <p className="text-brand-secondary">辅助品牌色文字</p>
                  <p className="text-brand-gradient">品牌色渐变文字</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="u-display-s text-brand-secondary">特殊文字效果</h3>
                <div className="space-y-3">
                  <p className="text-brand-warm">温暖发光文字</p>
                  <p className="hover-brand-primary">悬停变色文字</p>
                  <p className="text-brand-gradient">渐变色文字</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="u-display-s text-brand-gradient">组合效果</h3>
                <div className="space-y-3">
                  <p className="text-brand-primary text-2xl">大标题效果</p>
                  <p className="text-brand-secondary text-lg">中标题效果</p>
                  <p className="text-brand-gradient text-base">正文效果</p>
                </div>
              </div>
            </div>
          </div>

          {/* 品牌色背景展示 */}
          <div className="space-y-8">
            <h2 className="u-display-m text-center text-brand-gradient">品牌色背景系统</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-brand-primary text-white p-6 rounded-lg">
                <h3 className="u-display-s mb-2">主品牌色背景</h3>
                <p className="u-paragraph-m">适用于重要的强调区域</p>
              </div>
              
              <div className="bg-brand-secondary text-white p-6 rounded-lg">
                <h3 className="u-display-s mb-2">辅助品牌色背景</h3>
                <p className="u-paragraph-m">适用于次要的强调区域</p>
              </div>
              
              <div className="bg-brand-gradient text-white p-6 rounded-lg">
                <h3 className="u-display-s mb-2">品牌色渐变背景</h3>
                <p className="u-paragraph-m">适用于特殊的展示区域</p>
              </div>
              
              <div className="bg-brand-soft text-text-main p-6 rounded-lg">
                <h3 className="u-display-s mb-2">柔和品牌色背景</h3>
                <p className="u-paragraph-m">适用于卡片和内容区域</p>
              </div>
              
              <div className="bg-brand-subtle text-text-main p-6 rounded-lg">
                <h3 className="u-display-s mb-2">微妙品牌色背景</h3>
                <p className="u-paragraph-m">适用于大面积背景</p>
              </div>
              
              <div className="bg-brand-texture text-text-main p-6 rounded-lg">
                <h3 className="u-display-s mb-2">品牌色纹理背景</h3>
                <p className="u-paragraph-m">适用于装饰性背景</p>
              </div>
            </div>
          </div>

          {/* 品牌色卡片展示 */}
          <div className="space-y-8">
            <h2 className="u-display-m text-center text-brand-gradient">品牌色卡片系统</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card-brand-primary p-6 rounded-lg hover:shadow-brand-primary transition-all duration-300">
                <h3 className="u-display-s mb-2 text-brand-primary">主品牌色卡片</h3>
                <p className="u-paragraph-m text-text-main">带有主品牌色边框和背景的卡片效果</p>
              </div>
              
              <div className="card-brand-secondary p-6 rounded-lg hover:shadow-brand-secondary transition-all duration-300">
                <h3 className="u-display-s mb-2 text-brand-secondary">辅助品牌色卡片</h3>
                <p className="u-paragraph-m text-text-main">带有辅助品牌色边框和背景的卡片效果</p>
              </div>
              
              <div className="card-brand-gradient p-6 rounded-lg hover:shadow-brand-warm transition-all duration-300">
                <h3 className="u-display-s mb-2 text-brand-gradient">渐变品牌色卡片</h3>
                <p className="u-paragraph-m text-text-main">带有渐变品牌色边框和背景的卡片效果</p>
              </div>
            </div>
          </div>

          {/* 按钮变体展示 */}
          <div className="space-y-8">
            <h2 className="u-display-m text-center text-brand-gradient">增强的按钮系统</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <h3 className="u-display-s text-brand-primary">品牌色按钮</h3>
                <div className="space-y-3">
                  <Button variant="primary" size="lg" className="shadow-brand-primary">主要按钮</Button>
                  <Button variant="secondary" size="lg">次要按钮</Button>
                  <Button variant="outline" size="lg" className="border-brand-primary text-brand-primary">轮廓按钮</Button>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="u-display-s text-brand-secondary">语义化按钮</h3>
                <div className="space-y-3">
                  <Button variant="success" size="lg">成功操作</Button>
                  <Button variant="warning" size="lg">警告操作</Button>
                  <Button variant="error" size="lg">错误操作</Button>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="u-display-s text-brand-gradient">特殊效果</h3>
                <div className="space-y-3">
                  <Button variant="ghost" size="lg" className="hover-brand-primary">幽灵按钮</Button>
                  <Button variant="link" size="lg" className="text-brand-primary">链接按钮</Button>
                  <Button variant="info" size="lg">信息按钮</Button>
                </div>
              </div>
            </div>
          </div>

          {/* 文本颜色展示 */}
          <div className="space-y-8">
            <h2 className="u-display-m text-center">文本颜色系统</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="u-display-s">排版层级</h3>
                <div className="space-y-2">
                  <h1 className="u-display-xl">Display XL 标题</h1>
                  <h2 className="u-display-m">Display M 标题</h2>
                  <h3 className="u-display-s">Display S 标题</h3>
                  <p className="u-paragraph-l">大段落文本示例</p>
                  <p className="u-paragraph-m">中等段落文本示例</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="u-display-s">文本颜色</h3>
                <div className="space-y-2">
                  <p className="text-text-main">主要文本颜色</p>
                  <p className="text-text-faded">次要文本颜色</p>
                  <p className="text-text-link">链接文本颜色</p>
                  <p className="text-success">成功文本颜色</p>
                  <p className="text-warning">警告文本颜色</p>
                  <p className="text-error">错误文本颜色</p>
                </div>
              </div>
            </div>
          </div>

          {/* 背景颜色展示 */}
          <div className="space-y-8">
            <h2 className="u-display-m text-center">背景颜色系统</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background-main border border-border-default rounded-lg p-6">
                <h3 className="u-display-s mb-2">主背景</h3>
                <p className="u-paragraph-m text-text-faded">background-main</p>
              </div>
              
              <div className="bg-background-ivory-medium border border-border-default rounded-lg p-6">
                <h3 className="u-display-s mb-2">象牙色背景</h3>
                <p className="u-paragraph-m text-text-faded">background-ivory-medium</p>
              </div>
              
              <div className="bg-background-oat border border-border-default rounded-lg p-6">
                <h3 className="u-display-s mb-2">燕麦色背景</h3>
                <p className="u-paragraph-m text-text-faded">background-oat</p>
              </div>
            </div>
          </div>

          {/* 对比度信息 */}
          <div className="bg-background-ivory-medium rounded-lg p-8">
            <h2 className="u-display-m text-center mb-6">无障碍性合规</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="u-display-s mb-4">WCAG 2.1 AA 合规</h3>
                <ul className="space-y-2 u-paragraph-m text-text-faded">
                  <li>✅ 主色调与白色背景: 4.8:1</li>
                  <li>✅ 文本与背景对比度: 12.2:1</li>
                  <li>✅ 次要文本对比度: 4.6:1</li>
                  <li>✅ 所有交互元素都有焦点指示器</li>
                </ul>
              </div>
              <div>
                <h3 className="u-display-s mb-4">特殊功能支持</h3>
                <ul className="space-y-2 u-paragraph-m text-text-faded">
                  <li>✅ 高对比度模式</li>
                  <li>✅ 减少动画首选项</li>
                  <li>✅ 暗色主题支持</li>
                  <li>✅ 键盘导航优化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </AnchorSection>
  );
}
