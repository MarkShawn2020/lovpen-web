import React from 'react';
import { cn } from '@/utils/Helpers';

type Platform = {
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
};

type PlatformShowcaseProps = {
  className?: string;
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

// LovPen 创作流程步骤
const lovpenCreationSteps = [
  {
    step: 1,
    title: '碎片化输入',
    description: '观点、报告、语音...',
    icon: '💭',
    color: 'bg-blue-100 border-blue-200',
    features: ['flomo式记录', '多格式支持', '随时随地'],
  },
  {
    step: 2,
    title: 'LovPen 分析',
    description: '知识库+文风+平台',
    icon: '🧠',
    color: 'bg-purple-100 border-purple-200',
    features: ['个人知识库', '文风学习', '平台适配'],
  },
  {
    step: 3,
    title: '美丽图文生成',
    description: '专业排版+精美配图',
    icon: '✨',
    color: 'bg-green-100 border-green-200',
    features: ['智能配图', '优雅排版', '品质保证'],
  },
  {
    step: 4,
    title: '一键分发',
    description: '多平台自动发布',
    icon: '🚀',
    color: 'bg-orange-100 border-orange-200',
    features: ['格式转换', '定时发布', '自动投放'],
  },
  {
    step: 5,
    title: '数据监控与优化',
    description: '全流程效果追踪',
    icon: '📊',
    color: 'bg-rose-100 border-rose-200',
    features: ['数据分析', '效果优化', '人工协作'],
  },
];

// LovPen 创作流程展示组件
const LovPenFlowDiagram = () => (
  <div className="max-w-7xl mx-auto">
    {/* 流程步骤 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
      {lovpenCreationSteps.map((step, index) => (
        <div key={step.step} className="relative">
          {/* 连接线 */}
          {index < lovpenCreationSteps.length - 1 && (
            <div className="hidden lg:block absolute top-12 left-full w-6 h-0.5 bg-gradient-to-r from-primary to-swatch-cactus opacity-40 z-0">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-3 border-l-swatch-cactus border-t-1 border-b-1 border-t-transparent border-b-transparent opacity-60"></div>
            </div>
          )}

          {/* 步骤卡片 */}
          <div className={cn(
            'relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg z-10',
            step.color,
          )}
          >
            {/* 步骤编号 */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
              {step.step}
            </div>

            {/* 主要内容 */}
            <div className="text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-lg text-text-main mb-2">{step.title}</h3>
              <p className="text-sm text-text-faded mb-4">{step.description}</p>

              {/* 特性列表 */}
              <div className="space-y-1">
                {step.features.map((feature, featureIndex) => (
                  <div key={`${step.step}-feature-${feature}-${featureIndex}`} className="text-xs text-text-main bg-white/60 rounded-full px-3 py-1 inline-block mr-1 mb-1">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* LovPen 核心展示 */}
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-swatch-cactus/20 rounded-full flex items-center justify-center border-4 border-primary/30 backdrop-blur-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-swatch-cactus rounded-full flex items-center justify-center text-white">
            <span className="text-3xl">❤️</span>
          </div>
        </div>
        {/* 脉动动画环 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-swatch-cactus/10 rounded-full animate-pulse"></div>
        <div className="absolute -inset-8 bg-gradient-to-r from-primary/5 to-swatch-cactus/5 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <h3 className="text-2xl font-bold text-text-main mt-4 mb-2">LovPen 引擎</h3>
      <p className="text-text-faded max-w-md mx-auto">
        智能整合碎片化思考，生成专业级美丽图文，为20+平台量身定制值得信赖的优质内容
      </p>
    </div>
  </div>
);

// 保留原来的 FlowDiagram 用于向后兼容
const FlowDiagram = LovPenFlowDiagram;

// 平台卡片组件
const PlatformCard = ({ platform }: { platform: Platform }) => (
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

const PlatformShowcase = ({ className }: PlatformShowcaseProps) => {
  return (
    <div className={cn('', className)}>
      {/* Flow Diagram */}
      <div className="mb-12">
        <FlowDiagram />
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map(platform => (
          <PlatformCard key={platform.name} platform={platform} />
        ))}
      </div>

      {/* 更多平台提示 */}
      <div className="mt-8 text-center">
        <p className="text-text-faded text-sm">
          支持20+主流平台，更多平台持续添加中...
        </p>
      </div>
    </div>
  );
};

PlatformShowcase.displayName = 'PlatformShowcase';

export { FlowDiagram, PlatformShowcase };
export type { Platform };
