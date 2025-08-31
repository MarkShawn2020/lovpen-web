import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Container} from '@/components/layout/Container';
import {AnchorSection} from '@/components/layout/AnchorSection';
import Image from 'next/image';
import {Card, CardContent} from '@/components/lovpen-ui/card';
import {Quote} from 'lucide-react';

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
    title: '用户评价',
    description: '听听用户对 Lovpen 的评价',
  };
}

const testimonials = [
  {
    id: 1,
    name: 'ZENETH 樂彤',
    title: '亞洲人工智能初創大賽負責人',
    content: '作為活動主辦方我們希望見到 Lovpen 透過人工智能大模型，打造全新AI Agent 幫助更多初創企業管理自媒體矩陣！',
    avatar: '/assets/users/樂彤.jpg',
  },
  {
    id: 2,
    name: '拎壶不冲',
    title: '技术爱好者',
    content: '我是一个看书很多的半吊子技术人员，经常发现一些文学/哲学/美学/人类学/商科内容跟技术之间的奇妙关联。大多数想法都随风而逝，有点儿意思的才会记在obsidian，要特别有趣的才发在即刻，长篇大论的才会写个人的公众号。obsidian->jike->wechat的漏斗率大约每层都是百分之一。现在LovPen说"我给你把漏斗倒过来吧"，我只有一句回复"请问哪里买得到？"',
    avatar: '/assets/users/拎壶不冲.jpg',
  },
  {
    id: 3,
    name: 'Leo Zhoski',
    title: '自由职业',
    content: '我想把想法转化成做内容创作，但是排版、生成风格一致的文字很浪费时间，所以很少在社交平台上表达出来，Lovpen也许能很好地解决我的问题，非常期待尽早用上！',
    avatar: '/assets/users/leo.jpg',
  },
  {
    id: 4,
    name: 'Edison',
    title: '资深投资人',
    content: '我的自媒体生涯就靠Lovpen了！',
    avatar: '/assets/users/edison.jpg',
  },
  {
    id: 5,
    name: 'Isabelle',
    title: '外资投行数据分析师',
    content: '我真的特别看好Lovpen，我喜欢对产品真正有激情的founder！',
    avatar: '/assets/users/Isabelle.jpg',
  },
];

export default async function Testimonials(props: ITestimonialsProps) {
  const {locale} = await props.params;
  setRequestLocale(locale);

  return (
    <AnchorSection id="testimonials" className="w-full py-16 lg:py-24 bg-brand-mesh relative overflow-hidden">
      <Container>
        <div className="text-center mb-12">
          <h2 className="u-display-m mb-4 text-brand-gradient">用户评价</h2>
          <p className="u-paragraph-l text-text-main">
            听听真实用户对 Lovpen 的评价
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="card-brand-soft border-brand-primary/10 hover:border-brand-primary/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-brand-primary/20 mb-4 group-hover:text-brand-primary/40 transition-colors" />
                
                <p className="u-paragraph-s text-text-main mb-6 leading-relaxed">
                  "
{testimonial.content}
"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-brand-primary/10">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-soft">
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
                      <div className="w-full h-full flex items-center justify-center bg-brand-gradient text-white font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-main">{testimonial.name}</h4>
                    <p className="text-sm text-text-faded">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="u-paragraph-m text-text-faded">
            加入数千位创作者，开启您的内容创作新旅程
          </p>
        </div>
      </Container>
    </AnchorSection>
  );
}
