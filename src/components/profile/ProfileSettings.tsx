'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ProfileOverviewView } from './views/ProfileOverviewView';
import { ProfileGeneralView } from './views/ProfileGeneralView';
import { ProfileProfessionalView } from './views/ProfileProfessionalView';
import { ProfileOnlineView } from './views/ProfileOnlineView';
import { ProfileAccountView } from './views/ProfileAccountView';
import { ProfileDebugView } from './views/ProfileDebugView';

const PROFILE_SECTIONS = [
  {
    id: 'overview',
    label: '概览',
    icon: '📊',
    component: ProfileOverviewView,
    isDev: false,
  },
  {
    id: 'general',
    label: '通用',
    icon: '👤',
    component: ProfileGeneralView,
    isDev: false,
  },
  {
    id: 'professional',
    label: '职业信息',
    icon: '💼',
    component: ProfileProfessionalView,
    isDev: false,
  },
  {
    id: 'online',
    label: '在线资料',
    icon: '🌐',
    component: ProfileOnlineView,
    isDev: false,
  },
  {
    id: 'account',
    label: '账户信息',
    icon: '⚙️',
    component: ProfileAccountView,
    isDev: false,
  },
  {
    id: 'debug',
    label: '调试信息',
    icon: '🐛',
    component: ProfileDebugView,
    isDev: true,
  },
] as const;

type NavigationContentProps = {
  visibleSections: (typeof PROFILE_SECTIONS)[number][];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const NavigationContent = ({ visibleSections, activeSection, onSectionChange }: NavigationContentProps) => (
  <div className="flex flex-col h-full">
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-text-main mb-2">个人设置</h1>
      <p className="text-sm text-text-faded">管理您的个人资料和偏好设置</p>
    </div>
    
    <nav className="flex-1 px-3">
      <div className="space-y-1">
        {visibleSections.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full flex items-center px-3 py-2.5 text-left rounded-lg text-sm font-medium transition-colors',
              'hover:bg-primary/5',
              activeSection === section.id
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-text-main border-l-2 border-transparent'
            )}
          >
            <span className="mr-3 text-base">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
    
    <div className="p-4 border-t border-border-default/20">
      <p className="text-xs text-text-faded text-center">
        LovPen Profile Settings
      </p>
    </div>
  </div>
);

export function ProfileSettings() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDev = process.env.NODE_ENV === 'development';
  const visibleSections = PROFILE_SECTIONS.filter(section => !section.isDev || isDev);
  const currentSection = visibleSections.find(section => section.id === activeSection) || visibleSections[0]!;
  const ActiveComponent = currentSection.component;

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-full bg-background-main">
      {/* Desktop Left Sidebar - Apple Settings Style */}
      <div className="hidden lg:flex w-80 bg-background-main border-r border-border-default/20 flex-col">
        <NavigationContent 
          visibleSections={visibleSections} 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border-default/20 bg-background-main">
          <div className="flex items-center gap-3">
            <span className="text-xl">{currentSection.icon}</span>
            <h2 className="text-lg font-semibold text-text-main">{currentSection.label}</h2>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <NavigationContent 
                visibleSections={visibleSections} 
                activeSection={activeSection} 
                onSectionChange={handleSectionChange} 
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-border-default/20 bg-background-main">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentSection.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-text-main">{currentSection.label}</h2>
              <p className="text-sm text-text-faded">
                {getDescriptionForSection(currentSection.id)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-background-oat">
          <div className="p-4 lg:p-6">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

function getDescriptionForSection(sectionId: string): string {
  const descriptions = {
    overview: '查看您的资料完整度和基本统计信息',
    general: '管理您的基本个人信息和头像',
    professional: '设置您的职业和工作相关信息',
    online: '配置您的网站和社交媒体链接',
    account: '查看您的账户状态和基本信息',
    debug: '开发者调试信息和连接状态',
  };
  return descriptions[sectionId as keyof typeof descriptions] || '';
}
