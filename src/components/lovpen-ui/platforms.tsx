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
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  {
    name: '知乎',
    icon: '🎓',
    description: '学术风格，知识分享',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    name: '小红书',
    icon: '🌸',
    description: '生活美学，精致展示',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200',
  },
  {
    name: 'Twitter/X',
    icon: '🐦',
    description: '国际传播，实时动态',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 border-sky-200',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    description: '商务社交，职场洞察',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
  },
  {
    name: 'Medium',
    icon: '📝',
    description: '深度思考，优质内容',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
  },
  {
    name: 'Bilibili',
    icon: '📺',
    description: '年轻社区，创意表达',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '今日头条',
    icon: '📰',
    description: '大众传媒，热点追踪',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    name: '抖音',
    icon: '🎵',
    description: '短视频，爆款制造',
    color: 'text-black',
    bgColor: 'bg-slate-50 border-slate-200',
  },
  {
    name: '快手',
    icon: '⚡',
    description: '真实记录，生活分享',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '微博',
    icon: '🔥',
    description: '热点传播，社交话题',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  {
    name: '豆瓣',
    icon: '📚',
    description: '文艺青年，品味生活',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  {
    name: 'YouTube',
    icon: '🎬',
    description: '全球视频，创意无限',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    name: 'Instagram',
    icon: '📸',
    description: '视觉故事，美感分享',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
  },
  {
    name: 'TikTok',
    icon: '🎭',
    description: '创意短视频，全球流行',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200',
  },
  {
    name: 'Facebook',
    icon: '👥',
    description: '社交网络，连接世界',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    name: 'Reddit',
    icon: '🗣️',
    description: '社区讨论，深度交流',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  {
    name: 'Telegram',
    icon: '✈️',
    description: '私密通讯，频道传播',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 border-sky-200',
  },
  {
    name: 'Discord',
    icon: '🎮',
    description: '社群聊天，兴趣交流',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
  },
  {
    name: 'Substack',
    icon: '💌',
    description: '邮件订阅，深度写作',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  {
    name: 'Notion',
    icon: '📋',
    description: '知识管理，协作文档',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
  },
  {
    name: 'CSDN',
    icon: '💻',
    description: '技术博客，开发者社区',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    name: '掘金',
    icon: '⚒️',
    description: '技术分享，前沿资讯',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    name: '简书',
    icon: '🖋️',
    description: '优质创作，文字社区',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  {
    name: '即刻',
    icon: '⚡',
    description: '即时分享，兴趣社区',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '百家号',
    icon: '📄',
    description: '智能推荐，内容分发',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    name: '企鹅号',
    icon: '🐧',
    description: '腾讯生态，流量扶持',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '大鱼号',
    icon: '🐠',
    description: '阿里生态，商业变现',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
];
// 平台卡片组件
const PlatformCard = ({platform}: { platform: Platform }) => (
  <div className={cn(
    'p-4 rounded-xl border-2 transition-all duration-200 hover:scale-102 hover:shadow-md group',
    platform.bgColor,
  )}
  >
    <div className="text-center">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{platform.icon}</div>
      <h3 className={cn('font-semibold text-base mb-1', platform.color)}>
        {platform.name}
      </h3>
      <p className="text-xs text-text-faded line-clamp-2">
        {platform.description}
      </p>
    </div>
  </div>
);
export const Platforms = () => {
  return (
    <div className={''}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 lg:gap-4">
        {platforms.map(platform => (
          <PlatformCard key={platform.name} platform={platform}/>
        ))}
      </div>

      {/* 更多平台提示 */}
      <div className="mt-8 text-center">
        <p className="text-text-faded text-sm">
          支持28+主流平台，更多平台持续添加中...
        </p>
      </div>
    </div>
  )
}
