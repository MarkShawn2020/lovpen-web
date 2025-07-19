// LovPen 创作流程步骤
import {cn} from "@/lib/utils";
import * as React from "react";

type StepData = {
  title: string;
  description: string;
  features: string[];
}

type StepsProps = {
  stepData: {
    step1: StepData;
    step2: StepData;
    step3: StepData;
    step4: StepData;
    step5: StepData;
  };
}

// LovPen 创作流程展示组件
const Steps = ({ stepData }: StepsProps) => {
  const steps = [
    {
      step: 1,
      title: stepData.step1.title,
      description: stepData.step1.description,
      icon: '💭',
      color: 'bg-blue-100 border-blue-200',
      features: stepData.step1.features,
    },
    {
      step: 2,
      title: stepData.step2.title,
      description: stepData.step2.description,
      icon: '🧠',
      color: 'bg-purple-100 border-purple-200',
      features: stepData.step2.features,
    },
    {
      step: 3,
      title: stepData.step3.title,
      description: stepData.step3.description,
      icon: '✨',
      color: 'bg-green-100 border-green-200',
      features: stepData.step3.features,
    },
    {
      step: 4,
      title: stepData.step4.title,
      description: stepData.step4.description,
      icon: '🚀',
      color: 'bg-orange-100 border-orange-200',
      features: stepData.step4.features,
    },
    {
      step: 5,
      title: stepData.step5.title,
      description: stepData.step5.description,
      icon: '📊',
      color: 'bg-rose-100 border-rose-200',
      features: stepData.step5.features,
    },
  ];

  return (
  <div className="max-w-7xl mx-auto">
    {/* 流程步骤 */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
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
                className="lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-6 sm:h-8 bg-gradient-to-b from-primary to-swatch-cactus opacity-40 z-0"
              >
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-3 border-t-swatch-cactus border-l-1 border-r-1 border-l-transparent border-r-transparent opacity-60"
                />
              </div>
            </>
          )}

          {/* 步骤卡片 */}
          <div className={cn(
            'relative bg-white border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg z-10 group',
            'rounded-lg sm:rounded-xl lg:rounded-2xl px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-8',
            step.color,
          )}
          >
            {/* 桌面端序号 - 右上角始终强调 */}
            <div
              className="hidden lg:flex absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full items-center justify-center text-sm font-medium shadow-sm z-20"
            >
              {step.step}
            </div>

            {/* 移动端序号 - 右上角显示 */}
            <div
              className="lg:hidden absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium z-20 shadow-sm"
            >
              {step.step}
            </div>

            {/* 主要内容 - 紧凑设计 */}
            <div className="lg:text-center">
              {/* 桌面端布局 */}
              <div className="hidden lg:block text-center">
                <div className="text-4xl mb-2">{step.icon}</div>
                <h3 className="font-bold text-lg text-text-main mb-1">{step.title}</h3>
                <p className="text-sm text-text-faded mb-3">{step.description}</p>
                <div className="flex flex-col space-y-1">
                  {step.features.map((feature, featureIndex) => (
                    <div
                      key={`${step.step}-feature-${feature}-${featureIndex}`}
                      className="text-xs text-text-main bg-white/60 rounded-full px-3 py-1 inline-block mr-1 mb-1"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* 移动端布局 - 垂直堆叠 */}
              <div className="lg:hidden">
                {/* 顶部 - 图标和标题 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">{step.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-text-main mb-1">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-text-faded leading-tight">{step.description}</p>
                  </div>
                </div>

                {/* 底部 - 特性标签 */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {step.features.map((feature, featureIndex) => (
                    <div
                      key={`${step.step}-feature-${feature}-${featureIndex}`}
                      className="text-xs text-text-main bg-white/60 rounded-full px-2.5 py-1 text-center whitespace-nowrap"
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
  </div>
  );
};

export {Steps};
