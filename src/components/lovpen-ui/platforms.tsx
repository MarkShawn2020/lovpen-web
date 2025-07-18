import * as React from "react";
import {cn} from "@/lib/utils";

export type Platform = {
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
};
const platforms: Platform[] = [
  {
    name: '微信公众号',
    icon: '📱',
    description: '专业排版，完美呈现',
    color: 'text-emerald-600',
    bgColor: 'from-emerald-50 to-emerald-100 border-emerald-200/50',
  },
  {
    name: '知乎',
    icon: '🎓',
    description: '学术风格，知识分享',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
  },
  {
    name: '小红书',
    icon: '🌸',
    description: '生活美学，精致展示',
    color: 'text-pink-600',
    bgColor: 'from-pink-50 to-pink-100 border-pink-200/50',
  },
  {
    name: 'Twitter/X',
    icon: '🐦',
    description: '国际传播，实时动态',
    color: 'text-sky-600',
    bgColor: 'from-sky-50 to-sky-100 border-sky-200/50',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    description: '商务社交，职场洞察',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100 border-indigo-200/50',
  },
  {
    name: 'Medium',
    icon: '📝',
    description: '深度思考，优质内容',
    color: 'text-gray-600',
    bgColor: 'from-gray-50 to-gray-100 border-gray-200/50',
  },
  {
    name: 'Bilibili',
    icon: '📺',
    description: '年轻社区，创意表达',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100 border-cyan-200/50',
  },
  {
    name: '今日头条',
    icon: '📰',
    description: '大众传媒，热点追踪',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-red-100 border-red-200/50',
  },
  {
    name: '抖音',
    icon: '🎵',
    description: '短视频，爆款制造',
    color: 'text-slate-700',
    bgColor: 'from-slate-50 to-slate-100 border-slate-200/50',
  },
  {
    name: '快手',
    icon: '⚡',
    description: '真实记录，生活分享',
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-yellow-100 border-yellow-200/50',
  },
  {
    name: '微博',
    icon: '🔥',
    description: '热点传播，社交话题',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-orange-100 border-orange-200/50',
  },
  {
    name: '豆瓣',
    icon: '📚',
    description: '文艺青年，品味生活',
    color: 'text-green-600',
    bgColor: 'from-green-50 to-green-100 border-green-200/50',
  },
  {
    name: 'YouTube',
    icon: '🎬',
    description: '全球视频，创意无限',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-red-100 border-red-200/50',
  },
  {
    name: 'Instagram',
    icon: '📸',
    description: '视觉故事，美感分享',
    color: 'text-purple-600',
    bgColor: 'from-purple-50 to-purple-100 border-purple-200/50',
  },
  {
    name: 'TikTok',
    icon: '🎭',
    description: '创意短视频，全球流行',
    color: 'text-pink-600',
    bgColor: 'from-pink-50 to-pink-100 border-pink-200/50',
  },
  {
    name: 'Facebook',
    icon: '👥',
    description: '社交网络，连接世界',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
  },
  {
    name: 'Reddit',
    icon: '🗣️',
    description: '社区讨论，深度交流',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-orange-100 border-orange-200/50',
  },
  {
    name: 'Telegram',
    icon: '✈️',
    description: '私密通讯，频道传播',
    color: 'text-sky-600',
    bgColor: 'from-sky-50 to-sky-100 border-sky-200/50',
  },
  {
    name: 'Discord',
    icon: '🎮',
    description: '社群聊天，兴趣交流',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100 border-indigo-200/50',
  },
  {
    name: 'Substack',
    icon: '💌',
    description: '邮件订阅，深度写作',
    color: 'text-amber-600',
    bgColor: 'from-amber-50 to-amber-100 border-amber-200/50',
  },
  {
    name: 'Notion',
    icon: '📋',
    description: '知识管理，协作文档',
    color: 'text-gray-600',
    bgColor: 'from-gray-50 to-gray-100 border-gray-200/50',
  },
  {
    name: 'CSDN',
    icon: '💻',
    description: '技术博客，开发者社区',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-red-100 border-red-200/50',
  },
  {
    name: '掘金',
    icon: '⚒️',
    description: '技术分享，前沿资讯',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
  },
  {
    name: '简书',
    icon: '🖋️',
    description: '优质创作，文字社区',
    color: 'text-green-600',
    bgColor: 'from-green-50 to-green-100 border-green-200/50',
  },
  {
    name: '即刻',
    icon: '⚡',
    description: '即时分享，兴趣社区',
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-yellow-100 border-yellow-200/50',
  },
  {
    name: '百家号',
    icon: '📄',
    description: '智能推荐，内容分发',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
  },
  {
    name: '企鹅号',
    icon: '🐧',
    description: '腾讯生态，流量扶持',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100 border-cyan-200/50',
  },
  {
    name: '大鱼号',
    icon: '🐠',
    description: '阿里生态，商业变现',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-orange-100 border-orange-200/50',
  },
];
// 平台卡片组件
const PlatformCard = ({platform}: { platform: Platform }) => (
  <div className={cn(
    'relative p-5 rounded-2xl border border-solid backdrop-blur-sm bg-gradient-to-br',
    'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/5',
    'group cursor-pointer overflow-hidden',
    platform.bgColor,
  )}
  >
    {/* 悬停发光效果 */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* 内容区域 */}
    <div className="relative z-10 text-center">
      {/* 图标容器 */}
      <div className="relative mb-3">
        <div className="text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          {platform.icon}
        </div>
        {/* 图标发光效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-swatch-cactus/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* 平台名称 */}
      <h3 className={cn(
        'font-semibold text-sm mb-1.5 transition-colors duration-200',
        'group-hover:text-primary',
        platform.color
      )}
      >
        {platform.name}
      </h3>
      
      {/* 描述文字 */}
      <p className="text-xs text-text-faded/80 line-clamp-2 leading-relaxed">
        {platform.description}
      </p>
    </div>
    
    {/* 底部装饰线 */}
    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);
export const Platforms = () => {
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-swatch-cactus/5 rounded-3xl -z-10" />
      
      {/* 平台网格 */}
      <div className="relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 lg:gap-5">
          {platforms.map((platform, index) => (
            <div
              key={platform.name}
              className="animate-in fade-in-50 slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <PlatformCard platform={platform} />
            </div>
          ))}
        </div>
      </div>

      {/* 更多平台提示 */}
      <div className="mt-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
          <div className="w-2 h-2 bg-gradient-to-r from-primary to-swatch-cactus rounded-full animate-pulse" />
          <p className="text-text-faded text-sm font-medium">
            支持28+主流平台，更多平台持续添加中...
          </p>
          <div className="w-2 h-2 bg-gradient-to-r from-swatch-cactus to-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
        </div>
      </div>
    </div>
  )
}
