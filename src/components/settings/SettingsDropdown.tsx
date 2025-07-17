'use client';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UserSettings = {
  // Global Creation Settings
  defaultTemplate: 'blog' | 'news' | 'tutorial' | 'review' | 'custom';
  targetAudience: 'general' | 'professional' | 'academic' | 'casual';
  autoImageGeneration: boolean;
  seoOptimization: boolean;
  scheduledPublishing: boolean;

  // Platform Default Settings
  defaultWritingStyle: 'professional' | 'casual' | 'thoughtful' | 'warm';
  defaultImageCompression: 'high' | 'medium' | 'low';
  defaultLinkHandling: 'preserve' | 'convert-to-text' | 'footnote';

  // AI Assistant Settings
  aiModel: 'gpt-4' | 'gpt-3.5' | 'claude';
  responseLength: 'short' | 'medium' | 'long';
  creativity: 'conservative' | 'balanced' | 'creative';

  // UI Preferences
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  compactMode: boolean;
};

type SettingsDropdownProps = {
  userSettings: UserSettings;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
};

export function SettingsDropdown({
  userSettings,
  onSettingsChange,
  userAvatar,
  userName = '用户',
  userEmail = 'user@example.com',
}: SettingsDropdownProps) {
  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    onSettingsChange({[key]: value});
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName}/>
            <AvatarFallback className="bg-primary/10 text-primary">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-[80vh] overflow-y-auto" align="end" forceMount>
        {/* User Info */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userAvatar} alt={userName}/>
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-main truncate">
                {userName}
              </p>
              <p className="text-xs text-text-faded truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        {/* Quick Actions */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-text-faded uppercase tracking-wider px-2 py-1">
            快速操作
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <span className="mr-2">👤</span>
            个人资料
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">📊</span>
            使用统计
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">🔄</span>
            数据同步
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator/>

        {/* Creation Preferences */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-text-faded uppercase tracking-wider px-2 py-1">
            创作偏好
          </DropdownMenuLabel>

          {/* Content Template */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">📝</span>
              默认模板
              <span className="ml-auto text-xs text-text-faded capitalize">
                {userSettings.defaultTemplate}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.defaultTemplate}
                onValueChange={value => handleSettingChange('defaultTemplate', value)}
              >
                <DropdownMenuRadioItem value="blog">博客文章</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="news">新闻报道</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tutorial">教程指南</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="review">评测评论</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="custom">自定义</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Target Audience */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">🎯</span>
              目标受众
              <span className="ml-auto text-xs text-text-faded capitalize">
                {userSettings.targetAudience}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.targetAudience}
                onValueChange={value => handleSettingChange('targetAudience', value)}
              >
                <DropdownMenuRadioItem value="general">大众读者</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="professional">专业人士</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="academic">学术人员</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="casual">休闲读者</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Writing Style */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">✍️</span>
              写作风格
              <span className="ml-auto text-xs text-text-faded capitalize">
                {userSettings.defaultWritingStyle}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.defaultWritingStyle}
                onValueChange={value => handleSettingChange('defaultWritingStyle', value)}
              >
                <DropdownMenuRadioItem value="professional">专业正式</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="casual">轻松随意</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="thoughtful">深度思考</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="warm">温暖亲切</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator/>

        {/* Publishing Settings */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-text-faded uppercase tracking-wider px-2 py-1">
            发布设置
          </DropdownMenuLabel>

          <DropdownMenuCheckboxItem
            checked={userSettings.autoImageGeneration}
            onCheckedChange={checked => handleSettingChange('autoImageGeneration', checked)}
          >
            <span className="mr-2">🖼️</span>
            自动生成配图
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={userSettings.seoOptimization}
            onCheckedChange={checked => handleSettingChange('seoOptimization', checked)}
          >
            <span className="mr-2">🔍</span>
            SEO 优化
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={userSettings.scheduledPublishing}
            onCheckedChange={checked => handleSettingChange('scheduledPublishing', checked)}
          >
            <span className="mr-2">⏰</span>
            定时发布
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator/>

        {/* AI Assistant Settings */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-text-faded uppercase tracking-wider px-2 py-1">
            AI 助手
          </DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">🤖</span>
              AI 模型
              <span className="ml-auto text-xs text-text-faded uppercase">
                {userSettings.aiModel}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.aiModel}
                onValueChange={value => handleSettingChange('aiModel', value)}
              >
                <DropdownMenuRadioItem value="gpt-4">GPT-4</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="gpt-3.5">GPT-3.5</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="claude">Claude</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">📏</span>
              回复长度
              <span className="ml-auto text-xs text-text-faded capitalize">
                {userSettings.responseLength}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.responseLength}
                onValueChange={value => handleSettingChange('responseLength', value)}
              >
                <DropdownMenuRadioItem value="short">简短</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">中等</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="long">详细</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">🎨</span>
              创意程度
              <span className="ml-auto text-xs text-text-faded capitalize">
                {userSettings.creativity}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.creativity}
                onValueChange={value => handleSettingChange('creativity', value)}
              >
                <DropdownMenuRadioItem value="conservative">保守</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="balanced">平衡</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="creative">创新</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator/>

        {/* UI Preferences */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-text-faded uppercase tracking-wider px-2 py-1">
            界面设置
          </DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">🎨</span>
              主题
              <span className="ml-auto text-xs text-text-faded capitalize">
                {userSettings.theme}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.theme}
                onValueChange={value => handleSettingChange('theme', value)}
              >
                <DropdownMenuRadioItem value="light">浅色</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">深色</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="auto">跟随系统</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="mr-2">🌐</span>
              语言
              <span className="ml-auto text-xs text-text-faded">
                {userSettings.language === 'zh-CN' ? '中文' : 'English'}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={userSettings.language}
                onValueChange={value => handleSettingChange('language', value)}
              >
                <DropdownMenuRadioItem value="zh-CN">中文</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en-US">English</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuCheckboxItem
            checked={userSettings.compactMode}
            onCheckedChange={checked => handleSettingChange('compactMode', checked)}
          >
            <span className="mr-2">📱</span>
            紧凑模式
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator/>

        {/* Account Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span className="mr-2">⚙️</span>
            高级设置
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">📄</span>
            导出数据
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">❓</span>
            帮助支持
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator/>

        <DropdownMenuItem className="text-red-600">
          <span className="mr-2">🚪</span>
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
