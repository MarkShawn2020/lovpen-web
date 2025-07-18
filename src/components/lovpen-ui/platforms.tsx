import * as React from "react";
import {cn} from "@/lib/utils";
import {forceCollide, forceSimulation, forceX, forceY, SimulationNodeDatum} from 'd3-force';

export type Platform = {
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  contentComplexity: number; // 0-100: 文本 → 图文 → 视频
  seriousness: number; // 0-100: 娱乐化 → 专业化
};
const platforms: Platform[] = [
  // 专业文本平台
  {
    name: '知乎',
    icon: '🎓',
    description: '学术风格，知识分享',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
    contentComplexity: 25,
    seriousness: 85,
  },
  {
    name: 'Medium',
    icon: '📝',
    description: '深度思考，优质内容',
    color: 'text-gray-600',
    bgColor: 'from-gray-50 to-gray-100 border-gray-200/50',
    contentComplexity: 20,
    seriousness: 90,
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    description: '商务社交，职场洞察',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100 border-indigo-200/50',
    contentComplexity: 30,
    seriousness: 95,
  },
  {
    name: 'CSDN',
    icon: '💻',
    description: '技术博客，开发者社区',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-red-100 border-red-200/50',
    contentComplexity: 25,
    seriousness: 90,
  },
  {
    name: '掘金',
    icon: '⚒️',
    description: '技术分享，前沿资讯',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
    contentComplexity: 30,
    seriousness: 85,
  },
  
  // 专业图文平台
  {
    name: '微信公众号',
    icon: '📱',
    description: '专业排版，完美呈现',
    color: 'text-emerald-600',
    bgColor: 'from-emerald-50 to-emerald-100 border-emerald-200/50',
    contentComplexity: 55,
    seriousness: 75,
  },
  {
    name: '今日头条',
    icon: '📰',
    description: '大众传媒，热点追踪',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-red-100 border-red-200/50',
    contentComplexity: 50,
    seriousness: 70,
  },
  {
    name: '百家号',
    icon: '📄',
    description: '智能推荐，内容分发',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
    contentComplexity: 45,
    seriousness: 65,
  },
  {
    name: '企鹅号',
    icon: '🐧',
    description: '腾讯生态，流量扶持',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100 border-cyan-200/50',
    contentComplexity: 50,
    seriousness: 60,
  },
  {
    name: '大鱼号',
    icon: '🐠',
    description: '阿里生态，商业变现',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-orange-100 border-orange-200/50',
    contentComplexity: 48,
    seriousness: 65,
  },
  
  // 专业视频平台
  {
    name: 'YouTube',
    icon: '🎬',
    description: '全球视频，创意无限',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-red-100 border-red-200/50',
    contentComplexity: 85,
    seriousness: 70,
  },
  {
    name: 'Bilibili',
    icon: '📺',
    description: '年轻社区，创意表达',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100 border-cyan-200/50',
    contentComplexity: 80,
    seriousness: 60,
  },
  
  // 娱乐文本平台
  {
    name: '简书',
    icon: '🖋️',
    description: '优质创作，文字社区',
    color: 'text-green-600',
    bgColor: 'from-green-50 to-green-100 border-green-200/50',
    contentComplexity: 20,
    seriousness: 55,
  },
  {
    name: '豆瓣',
    icon: '📚',
    description: '文艺青年，品味生活',
    color: 'text-green-600',
    bgColor: 'from-green-50 to-green-100 border-green-200/50',
    contentComplexity: 25,
    seriousness: 50,
  },
  {
    name: 'Twitter/X',
    icon: '🐦',
    description: '国际传播，实时动态',
    color: 'text-sky-600',
    bgColor: 'from-sky-50 to-sky-100 border-sky-200/50',
    contentComplexity: 15,
    seriousness: 45,
  },
  {
    name: '微博',
    icon: '🔥',
    description: '热点传播，社交话题',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-orange-100 border-orange-200/50',
    contentComplexity: 20,
    seriousness: 35,
  },
  {
    name: '即刻',
    icon: '⚡',
    description: '即时分享，兴趣社区',
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-yellow-100 border-yellow-200/50',
    contentComplexity: 15,
    seriousness: 30,
  },
  
  // 娱乐图文平台
  {
    name: '小红书',
    icon: '🌸',
    description: '生活美学，精致展示',
    color: 'text-pink-600',
    bgColor: 'from-pink-50 to-pink-100 border-pink-200/50',
    contentComplexity: 65,
    seriousness: 35,
  },
  {
    name: 'Instagram',
    icon: '📸',
    description: '视觉故事，美感分享',
    color: 'text-purple-600',
    bgColor: 'from-purple-50 to-purple-100 border-purple-200/50',
    contentComplexity: 70,
    seriousness: 40,
  },
  {
    name: 'Facebook',
    icon: '👥',
    description: '社交网络，连接世界',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-blue-100 border-blue-200/50',
    contentComplexity: 60,
    seriousness: 45,
  },
  
  // 娱乐视频平台
  {
    name: '抖音',
    icon: '🎵',
    description: '短视频，爆款制造',
    color: 'text-slate-700',
    bgColor: 'from-slate-50 to-slate-100 border-slate-200/50',
    contentComplexity: 90,
    seriousness: 25,
  },
  {
    name: '快手',
    icon: '⚡',
    description: '真实记录，生活分享',
    color: 'text-yellow-600',
    bgColor: 'from-yellow-50 to-yellow-100 border-yellow-200/50',
    contentComplexity: 85,
    seriousness: 30,
  },
  {
    name: 'TikTok',
    icon: '🎭',
    description: '创意短视频，全球流行',
    color: 'text-pink-600',
    bgColor: 'from-pink-50 to-pink-100 border-pink-200/50',
    contentComplexity: 95,
    seriousness: 20,
  },
  
  // 社区交流平台
  {
    name: 'Reddit',
    icon: '🗣️',
    description: '社区讨论，深度交流',
    color: 'text-orange-600',
    bgColor: 'from-orange-50 to-orange-100 border-orange-200/50',
    contentComplexity: 35,
    seriousness: 65,
  },
  {
    name: 'Discord',
    icon: '🎮',
    description: '社群聊天，兴趣交流',
    color: 'text-indigo-600',
    bgColor: 'from-indigo-50 to-indigo-100 border-indigo-200/50',
    contentComplexity: 40,
    seriousness: 40,
  },
  {
    name: 'Telegram',
    icon: '✈️',
    description: '私密通讯，频道传播',
    color: 'text-sky-600',
    bgColor: 'from-sky-50 to-sky-100 border-sky-200/50',
    contentComplexity: 45,
    seriousness: 55,
  },
  
  // 专业工具平台
  {
    name: 'Substack',
    icon: '💌',
    description: '邮件订阅，深度写作',
    color: 'text-amber-600',
    bgColor: 'from-amber-50 to-amber-100 border-amber-200/50',
    contentComplexity: 35,
    seriousness: 80,
  },
  {
    name: 'Notion',
    icon: '📋',
    description: '知识管理，协作文档',
    color: 'text-gray-600',
    bgColor: 'from-gray-50 to-gray-100 border-gray-200/50',
    contentComplexity: 40,
    seriousness: 85,
  },
];

// 平台卡片组件
const PlatformCard = ({platform, style, scaleFactor, onHover, onLeave}: { 
  platform: Platform; 
  style?: React.CSSProperties; 
  scaleFactor: number;
  onHover: (platform: Platform) => void;
  onLeave: () => void;
}) => {
  const cardSize = Math.max(40, 64 * scaleFactor); // 最小尺寸40px，按比例缩放
  const iconSize = Math.max(16, 24 * scaleFactor); // 图标尺寸
  
  return (
    <div 
      className={cn(
        'absolute transform -translate-x-1/2 -translate-y-1/2',
        'rounded-full',
        'transition-all duration-300 hover:scale-125 hover:z-30',
        'group cursor-pointer flex items-center justify-center',
        'bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm',
        'hover:shadow-lg hover:bg-white/95',
      )}
      style={{
        ...style,
        width: `${cardSize}px`,
        height: `${cardSize}px`,
      }}
      onMouseEnter={() => onHover(platform)}
      onMouseLeave={onLeave}
    >
      {/* 图标 */}
      <div 
        className="transform group-hover:scale-110 transition-all duration-300"
        style={{ fontSize: `${iconSize}px` }}
      >
        {platform.icon}
      </div>
    </div>
  );
};

type PlatformNode = {
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
} & Platform & SimulationNodeDatum

export const Platforms = () => {
  const chartWidth = 800;
  const chartHeight = 600;
  const padding = 100;
  const [nodes, setNodes] = React.useState<PlatformNode[]>([]);
  const [containerDimensions, setContainerDimensions] = React.useState({ width: chartWidth, height: chartHeight });
  const [hoveredPlatform, setHoveredPlatform] = React.useState<Platform | null>(null);
  const simulationRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // 监听容器尺寸变化
  React.useEffect(() => {
    if (!containerRef.current) {
 return; 
}
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // 考虑容器的padding (p-8 = 32px * 2 = 64px)
        const totalPadding = 64; // p-8
        const availableWidth = Math.max(400, rect.width - totalPadding);
        // 限制最大宽度为与其他组件相同的 max-w-7xl (1280px)
        const maxWidth = Math.min(1280, availableWidth);
        const width = Math.max(400, maxWidth);
        const height = Math.max(300, width * 0.75); // 保持4:3比例
        setContainerDimensions({ width, height });
      }
    };
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    updateDimensions(); // 初始化
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  React.useEffect(() => {
    // 使用动态尺寸初始化节点位置
    const currentWidth = containerDimensions.width;
    const currentHeight = containerDimensions.height;
    const scaleFactor = Math.min(currentWidth / chartWidth, currentHeight / chartHeight);
    const scaledPadding = padding * scaleFactor;
    const collisionRadius = Math.max(20, 35 * scaleFactor); // 最小碰撞半径20px
    
    const initialNodes: PlatformNode[] = platforms.map(platform => ({
      ...platform,
      x: scaledPadding + (platform.contentComplexity / 100) * (currentWidth - 2 * scaledPadding),
      y: currentHeight - scaledPadding - (platform.seriousness / 100) * (currentHeight - 2 * scaledPadding),
      fx: undefined,
      fy: undefined,
    }));
    
    // 创建力导向仿真
    const simulation = forceSimulation(initialNodes)
      .force('x', forceX((d: any) => scaledPadding + (d.contentComplexity / 100) * (currentWidth - 2 * scaledPadding)).strength(0.3))
      .force('y', forceY((d: any) => currentHeight - scaledPadding - (d.seriousness / 100) * (currentHeight - 2 * scaledPadding)).strength(0.3))
      .force('collide', forceCollide().radius(collisionRadius).strength(0.8))
      .alphaDecay(0.02)
      .on('tick', () => {
        setNodes([...simulation.nodes()]);
      });
    
    simulationRef.current = simulation;
    
    return () => {
      simulation.stop();
    };
  }, [containerDimensions]);
  
  const scaleFactor = Math.min(containerDimensions.width / chartWidth, containerDimensions.height / chartHeight);
  const scaledPadding = padding * scaleFactor;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative" ref={containerRef}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 rounded-3xl -z-10" />
        
        {/* 象限图表 */}
        <div className="relative z-10 flex flex-col items-center">
          {/* 图表容器 */}
          <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10 w-full">
            {/* SVG 图表 */}
            <svg 
              viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
              className="w-full h-auto overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 背景象限 */}
              <defs>
                <linearGradient id="quadrant1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="quadrant2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="quadrant3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fde68a" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="quadrant4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* 象限背景 */}
              <rect x={scaledPadding} y={scaledPadding} width={(containerDimensions.width - 2 * scaledPadding) / 2} height={(containerDimensions.height - 2 * scaledPadding) / 2} fill="url(#quadrant1)" rx="8" />
              <rect x={scaledPadding + (containerDimensions.width - 2 * scaledPadding) / 2} y={scaledPadding} width={(containerDimensions.width - 2 * scaledPadding) / 2} height={(containerDimensions.height - 2 * scaledPadding) / 2} fill="url(#quadrant2)" rx="8" />
              <rect x={scaledPadding} y={scaledPadding + (containerDimensions.height - 2 * scaledPadding) / 2} width={(containerDimensions.width - 2 * scaledPadding) / 2} height={(containerDimensions.height - 2 * scaledPadding) / 2} fill="url(#quadrant3)" rx="8" />
              <rect x={scaledPadding + (containerDimensions.width - 2 * scaledPadding) / 2} y={scaledPadding + (containerDimensions.height - 2 * scaledPadding) / 2} width={(containerDimensions.width - 2 * scaledPadding) / 2} height={(containerDimensions.height - 2 * scaledPadding) / 2} fill="url(#quadrant4)" rx="8" />
              
              {/* 网格线 */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect x={scaledPadding} y={scaledPadding} width={containerDimensions.width - 2 * scaledPadding} height={containerDimensions.height - 2 * scaledPadding} fill="url(#grid)" />
              
              {/* 坐标轴 */}
              <line x1={scaledPadding} y1={containerDimensions.height - scaledPadding} x2={containerDimensions.width - scaledPadding} y2={containerDimensions.height - scaledPadding} stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1={scaledPadding} y1={containerDimensions.height - scaledPadding} x2={scaledPadding} y2={scaledPadding} stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* 箭头标记 */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                </marker>
              </defs>
              
              {/* 中心分割线 */}
              <line x1={scaledPadding + (containerDimensions.width - 2 * scaledPadding) / 2} y1={scaledPadding} x2={scaledPadding + (containerDimensions.width - 2 * scaledPadding) / 2} y2={containerDimensions.height - scaledPadding} stroke="#9ca3af" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
              <line x1={scaledPadding} y1={scaledPadding + (containerDimensions.height - 2 * scaledPadding) / 2} x2={containerDimensions.width - scaledPadding} y2={scaledPadding + (containerDimensions.height - 2 * scaledPadding) / 2} stroke="#9ca3af" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
            </svg>
            
            {/* 平台卡片 */}
            {nodes.map((platform, _index) => {
              return (
                <PlatformCard
                  key={platform.name}
                  platform={platform}
                  scaleFactor={scaleFactor}
                  onHover={setHoveredPlatform}
                  onLeave={() => setHoveredPlatform(null)}
                  style={{
                    left: `${platform.x || 0}px`,
                    top: `${platform.y || 0}px`,
                    transition: 'all 0.1s ease-out',
                  }}
                />
              );
            })}
            
            {/* 图表标题 - 坐标系正中上方 */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center transition-all duration-300">
              {hoveredPlatform
? (
                <div className="flex flex-col items-center">
                  <span className={cn('font-bold text-lg', hoveredPlatform.color)}>
                    {hoveredPlatform.name}
                  </span>
                  <span className="text-sm text-text-faded mt-1">
                    {hoveredPlatform.description}
                  </span>
                </div>
              )
: (
                <div className="text-sm font-medium text-text-main opacity-50">
                  平台分布图
                </div>
              )}
            </div>
            
            {/* 坐标轴标签 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-text-main">
              内容复杂度 →
            </div>
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-text-main">
              专业程度 →
            </div>
            
            {/* 象限标签 */}
            <div className="absolute top-6 left-6 text-xs font-medium text-blue-600 bg-blue-50/80 px-2 py-1 rounded">
              专业文本
            </div>
            <div className="absolute top-6 right-6 text-xs font-medium text-green-600 bg-green-50/80 px-2 py-1 rounded">
              专业多媒体
            </div>
            <div className="absolute bottom-6 left-6 text-xs font-medium text-yellow-600 bg-yellow-50/80 px-2 py-1 rounded">
              娱乐文本
            </div>
            <div className="absolute bottom-6 right-6 text-xs font-medium text-pink-600 bg-pink-50/80 px-2 py-1 rounded">
              娱乐多媒体
            </div>
          </div>
        </div>

        {/* 更多平台提示 */}
        <div className="mt-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-swatch-cactus rounded-full animate-pulse" />
            <p className="text-text-faded text-sm font-medium">
              支持28+主流平台，智能分析选择最佳发布策略
            </p>
            <div className="w-2 h-2 bg-gradient-to-r from-swatch-cactus to-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
        </div>
      </div>
    </div>
  );
};
