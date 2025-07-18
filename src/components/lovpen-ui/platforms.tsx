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
];
// 平台卡片组件
const PlatformCard = ({platform}: { platform: Platform }) => (
  <div className={cn(
    'p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg',
    platform.bgColor,
  )}
  >
    <div className="text-center">
      <div className="text-4xl mb-3">{platform.icon}</div>
      <h3 className={cn('font-semibold text-lg mb-2', platform.color)}>
        {platform.name}
      </h3>
      <p className="text-sm text-text-faded">
        {platform.description}
      </p>
    </div>
  </div>
);
export const Platforms = () => {
  return (
    <div className={''}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map(platform => (
          <PlatformCard key={platform.name} platform={platform}/>
        ))}
      </div>

      {/* 更多平台提示 */}
      <div className="mt-8 text-center">
        <p className="text-text-faded text-sm">
          支持20+主流平台，更多平台持续添加中...
        </p>
      </div>
    </div>
  )
}
