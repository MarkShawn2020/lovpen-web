// LovPen 创作流程步骤
import {cn} from "@/lib/utils";
import {Logo} from "@/components/lovpen-ui/logo";
import * as React from "react";

const steps = [
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
const Steps = () => (
  <div className="max-w-7xl mx-auto">
    {/* 流程步骤 */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
      {steps.map((step, index) => (
        <div key={step.step} className="relative">
          {/* 连接线 */}
          {index < steps.length - 1 && (
            <>
              {/* 桌面端横向连接线 */}
              <div
                className="hidden lg:block absolute top-12 left-full w-6 h-0.5 bg-gradient-to-r from-primary to-swatch-cactus opacity-40 z-0"
              >
                <div
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-3 border-l-swatch-cactus border-t-1 border-b-1 border-t-transparent border-b-transparent opacity-60"
                />
              </div>
              
              {/* 移动端垂直连接线 */}
              <div
                className="lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-primary to-swatch-cactus opacity-40 z-0"
              >
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-3 border-t-swatch-cactus border-l-1 border-r-1 border-l-transparent border-r-transparent opacity-60"
                />
              </div>
            </>
          )}

          {/* 步骤卡片 */}
          <div className={cn(
            'relative bg-white border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg z-10',
            'rounded-xl lg:rounded-2xl p-4 lg:p-6',
            step.color,
          )}
          >
            {/* 桌面端步骤编号 */}
            <div
              className="hidden lg:block absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
            >
              {step.step}
            </div>

            {/* 单列时的酷炫大号序号 */}
            <div
              className="lg:hidden absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/20 to-swatch-cactus/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary/30"
            >
              <div
                className="w-12 h-12 bg-gradient-to-br from-primary to-swatch-cactus rounded-full flex items-center justify-center text-white font-black text-lg shadow-xl"
              >
                {step.step}
              </div>
              {/* 脉动动画环 */}
              <div
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-swatch-cactus/20 rounded-full animate-pulse"
                style={{animationDelay: `${step.step * 0.2}s`, animationDuration: '2s'}}
              />
            </div>

            {/* 主要内容 */}
            <div className="text-center lg:text-center text-left lg:block flex items-center lg:items-start">
              <div className="text-3xl lg:text-4xl mb-0 lg:mb-3 mr-4 lg:mr-0 flex-shrink-0">{step.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-base lg:text-lg text-text-main mb-1 lg:mb-2">{step.title}</h3>
                <p className="text-xs lg:text-sm text-text-faded mb-2 lg:mb-4">{step.description}</p>

                {/* 特性列表 */}
                <div className="space-y-0 lg:space-y-1">
                  {step.features.map((feature, featureIndex) => (
                    <div
                      key={`${step.step}-feature-${feature}-${featureIndex}`}
                      className="text-xs text-text-main bg-white/60 rounded-full px-2 lg:px-3 py-1 inline-block mr-1 mb-1"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* LovPen 核心展示 */}
    <div className="text-center">
      <div className="relative inline-block">
        <div
          className="w-32 h-32 bg-gradient-to-br from-primary/20 to-swatch-cactus/20 rounded-full flex items-center justify-center border-4 border-primary/30 backdrop-blur-sm"
        >
          <div
            className="w-20 h-20 bg-gradient-to-br from-primary to-swatch-cactus rounded-full flex items-center justify-center text-white"
          >
            <Logo
              variant="pure"
              size="md"
              color="white"
            />
          </div>
        </div>
        {/* 脉动动画环 */}
        <div
          className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-swatch-cactus/10 rounded-full animate-pulse"
        />
        <div
          className="absolute -inset-8 bg-gradient-to-r from-primary/5 to-swatch-cactus/5 rounded-full animate-pulse"
          style={{animationDelay: '0.5s'}}
        />
      </div>
      <h3 className="text-2xl font-bold text-text-main mt-4 mb-2">LovPen 引擎</h3>
      <p className="text-text-faded max-w-md mx-auto">
        智能整合碎片化思考，生成专业级美丽图文，为20+平台量身定制值得信赖的优质内容
      </p>
    </div>
  </div>
);
export {Steps};
