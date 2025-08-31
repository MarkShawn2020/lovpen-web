import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import Image from 'next/image';
import Link from 'next/link';

type ITestimonialsProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ITestimonialsProps) {
  const {locale} = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: 'LovPen 让每个人都能成为优秀创作者',
    description: '听听真实用户对 Lovpen 的评价',
  };
}

const testimonials = [
  {
    id: 1,
    name: 'ZENETH 樂彤',
    title: '亞洲人工智能初創大賽負責人',
    content: '作為活動主辦方我們希望見到 Lovpen 透過人工智能大模型，打造全新AI Agent 幫助更多初創企業管理自媒體矩陣！',
    avatar: '/assets/users/樂彤.jpg',
    accentColor: 'primary',
  },
  {
    id: 2,
    name: '拎壶不冲',
    title: '技术爱好者',
    content: '我是一个看书很多的半吊子技术人员，经常发现一些文学/哲学/美学/人类学/商科内容跟技术之间的奇妙关联。大多数想法都随风而逝，有点儿意思的才会记在obsidian，要特别有趣的才发在即刻，长篇大论的才会写个人的公众号。obsidian->jike->wechat的漏斗率大约每层都是百分之一。现在LovPen说"我给你把漏斗倒过来吧"，我只有一句回复"请问哪里买得到？"',
    avatar: '/assets/users/拎壶不冲.jpg',
    accentColor: 'secondary',
  },
  {
    id: 3,
    name: 'Leo Zhoski',
    title: '自由职业',
    content: '我想把想法转化成做内容创作，但是排版、生成风格一致的文字很浪费时间，所以很少在社交平台上表达出来，Lovpen也许能很好地解决我的问题，非常期待尽早用上！',
    avatar: '/assets/users/leo.jpg',
    accentColor: 'gradient',
  },
  {
    id: 4,
    name: 'Edison',
    title: '资深投资人',
    content: '我的自媒体生涯就靠Lovpen了！',
    avatar: '/assets/users/edison.jpg',
    accentColor: 'primary',
  },
  {
    id: 5,
    name: 'Isabelle',
    title: '外资投行数据分析师',
    content: '我真的特别看好Lovpen，我喜欢对产品真正有激情的founder！',
    avatar: '/assets/users/Isabelle.jpg',
    accentColor: 'secondary',
  },
];

export default async function Testimonials(props: ITestimonialsProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <AnchorSection id="testimonials" className="w-full py-16 lg:py-24 bg-brand-mesh u-bg-organic-noise relative">
      <Container>
        {/* Hero Section - 符合设计指南的标题样式 */}
        <div className="text-center mb-16">
          <h1 className="u-display-xl font-serif text-brand-gradient mb-6">
            LovPen 让每个人都能成为优秀创作者
          </h1>
          <p className="u-paragraph-l text-text-main max-w-3xl mx-auto">
            来自各行各业创作者的真实声音，他们都在用 Lovpen 提升创作效率
          </p>
        </div>

        {/* Testimonials Grid - 使用设计指南的网格系统 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => {
            // 根据 accentColor 决定卡片样式
            const cardClass = testimonial.accentColor === 'primary' 
              ? 'card-brand-primary' 
              : testimonial.accentColor === 'secondary'
              ? 'card-brand-secondary'
              : 'card-brand-gradient';
            
            const textColorClass = testimonial.accentColor === 'primary'
              ? 'text-brand-primary'
              : testimonial.accentColor === 'secondary'
              ? 'text-brand-secondary'
              : 'text-brand-gradient';

            return (
              <div 
                key={testimonial.id} 
                className={`flex flex-col h-full ${cardClass} p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg group`}
              >
                {/* Quote Icon - 使用设计指南的间距 */}
                <div className="mb-6">
                  <svg className={`w-10 h-10 ${textColorClass} opacity-50 group-hover:opacity-70 transition-opacity`} fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                
                {/* Content - 使用设计指南的字体系统 */}
                <div className="flex-1 flex flex-col">
                  <p className="u-paragraph-m text-text-main mb-8 leading-relaxed flex-1">
                    {testimonial.content}
                  </p>
                  
                  {/* Author Info - 使用设计指南的布局 */}
                  <div className="flex items-center gap-4 pt-6 border-t border-opacity-20 border-current">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-background-main shadow-md">
                      {testimonial.avatar
? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      )
: (
                        <div className={`w-full h-full flex items-center justify-center ${cardClass === 'card-brand-gradient' ? 'bg-brand-gradient' : ''} text-white font-semibold text-lg`}>
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`u-display-s font-semibold ${textColorClass}`}>
                        {testimonial.name}
                      </h4>
                      <p className="u-detail-m text-text-faded mt-1">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action - 使用设计指南的按钮样式 */}
        <div className="mt-16 text-center">
          <p className="u-paragraph-l text-text-main mb-8">
            加入数千位创作者，开启您的内容创作新旅程
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-brand-primary rounded-xl shadow-sm transition-all hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary u-display-s"
            >
              立即体验 Lovpen
            </Link>
            <a 
              href="#features" 
              className="inline-flex items-center justify-center px-8 py-4 font-medium text-text-main bg-transparent border-2 border-border-default rounded-xl shadow-sm transition-all hover:bg-background-main hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary u-display-s"
            >
              了解更多功能
            </a>
          </div>
        </div>
      </Container>
    </AnchorSection>
  );
}
