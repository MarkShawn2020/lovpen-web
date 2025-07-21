'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/lovpen-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { UploadModal } from './UploadModal';
import type { FileItem } from '@/services/file-client-v2';

type CategorizedUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (items: FileItem[]) => void;
}

type UploadCategory = 'files' | 'thirdparty' | 'lovpen';

type UploadOption = {
  icon: string;
  title: string;
  description: string;
  action: () => void | Promise<void>;
  disabled?: boolean;
  tooltip?: string;
};

type CategoryBase = {
  id: string;
  title: string;
  subtitle: string;
  options: UploadOption[];
};

type CategoryWithEmoji = CategoryBase & {
  icon: string;
  iconType?: never;
};

type CategoryWithLogo = CategoryBase & {
  icon?: never;
  iconType: 'logo';
};

type Category = CategoryWithEmoji | CategoryWithLogo;

export function CategorizedUploadModal({ isOpen, onClose, onUploadComplete }: CategorizedUploadModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<UploadCategory | null>(null);
  const [isLocalFolderSupported, setIsLocalFolderSupported] = useState(false);

  React.useEffect(() => {
    const supported = 'showDirectoryPicker' in window && typeof window.showDirectoryPicker === 'function';
    setIsLocalFolderSupported(supported);
  }, []);

  const handleLocalFolder = async () => {
    if (!isLocalFolderSupported) {
      console.warn('您的浏览器不支持本地文件夹访问功能，请使用 Chrome 88+ 或 Edge 88+');
      return;
    }

    try {
      const directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'read'
      });
      
      // This would need to be handled by the parent component
      console.log('Selected directory:', directoryHandle.name);
      console.log(`已选择文件夹: ${directoryHandle.name}`);
      onClose();
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to access local folder:', error);
        console.error('访问本地文件夹失败，请检查权限设置');
      }
    }
  };

  const categories: Category[] = [
    {
      id: 'files' as const,
      icon: '📁',
      title: '上传文件',
      subtitle: '上传文档、图片等文件',
      options: [
        {
          icon: '📄',
          title: '选择文件',
          description: '上传单个或多个文件',
          action: () => setSelectedCategory('files'),
          disabled: false
        },
        {
          icon: '📂',
          title: '映射本地文件夹',
          description: '映射本地文件夹进行实时同步',
          action: handleLocalFolder,
          disabled: !isLocalFolderSupported,
          tooltip: !isLocalFolderSupported ? '需要 Chrome 88+ 或 Edge 88+' : undefined
        }
      ]
    },
    {
      id: 'lovpen' as const,
      iconType: 'logo' as const,
      title: 'Lovpen 系列',
      subtitle: '导入 Lovpen 产品数据',
      options: [
        {
          icon: '📱',
          title: 'Lovpen-Clip',
          description: '导入剪贴板历史记录',
          action: () => console.log('Lovpen-Clip 导入功能开发中'),
          disabled: false
        },
        {
          icon: '💭',
          title: 'Lovpen-Flomo',
          description: '导入 Flomo 风格的记录',
          action: () => console.log('Lovpen-Flomo 导入功能开发中'),
          disabled: false
        },
        {
          icon: '💬',
          title: 'Lovpen-Wechat',
          description: '导入微信聊天记录',
          action: () => console.log('Lovpen-Wechat 导入功能开发中'),
          disabled: false
        },
        {
          icon: '🌟',
          title: 'Lovpen-Jike',
          description: '导入即刻动态内容',
          action: () => console.log('Lovpen-Jike 导入功能开发中'),
          disabled: false
        },
        {
          icon: '📔',
          title: 'Lovpen-Notes',
          description: '导入笔记和文档',
          action: () => console.log('Lovpen-Notes 导入功能开发中'),
          disabled: false
        },
        {
          icon: '🔖',
          title: 'Lovpen-Bookmarks',
          description: '导入书签和收藏',
          action: () => console.log('Lovpen-Bookmarks 导入功能开发中'),
          disabled: false
        }
      ]
    },
    {
      id: 'thirdparty' as const,
      icon: '🔗',
      title: '第三方平台',
      subtitle: '从其他平台导入内容',
      options: [
        {
          icon: '🗒️',
          title: 'Obsidian',
          description: '导入 Obsidian 笔记库',
          action: () => console.log('Obsidian 导入功能开发中'),
          disabled: false
        },
        {
          icon: '📋',
          title: '飞书',
          description: '导入飞书文档和知识库',
          action: () => console.log('飞书导入功能开发中'),
          disabled: false
        },
        {
          icon: '📝',
          title: 'Notion',
          description: '导入 Notion 页面和数据库',
          action: () => console.log('Notion 导入功能开发中'),
          disabled: false
        },
        {
          icon: '📖',
          title: 'Logseq',
          description: '导入 Logseq 知识图谱',
          action: () => console.log('Logseq 导入功能开发中'),
          disabled: false
        },
        {
          icon: '🌐',
          title: 'Roam Research',
          description: '导入 Roam Research 图谱',
          action: () => console.log('Roam Research 导入功能开发中'),
          disabled: false
        },
        {
          icon: '💡',
          title: 'RemNote',
          description: '导入 RemNote 笔记',
          action: () => console.log('RemNote 导入功能开发中'),
          disabled: false
        }
      ]
    }
  ];

  const handleCategoryBack = () => {
    setSelectedCategory(null);
  };

  const handleFileUploadComplete = (items: FileItem[]) => {
    setSelectedCategory(null);
    onUploadComplete(items);
  };

  if (selectedCategory === 'files') {
    return (
      <UploadModal
        isOpen={isOpen}
        onClose={handleCategoryBack}
        onUploadComplete={handleFileUploadComplete}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ➕ 添加内容到知识库
          </DialogTitle>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          {categories.map(category => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-3">
                  {category.iconType === 'logo'
? (
                    <Image 
                      src="/lovpen-logo-2/LovPen-pure-logo_currentColor.svg" 
                      alt="Lovpen Logo" 
                      width={20} 
                      height={20}
                      className="shrink-0 text-primary"
                    />
                  )
: (
                    <span className="text-lg">{category.icon}</span>
                  )}
                  <div className="text-left">
                    <div className="font-medium text-text-main">{category.title}</div>
                    <div className="text-sm text-text-faded">{category.subtitle}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid gap-3">
                  {category.options.map((option: UploadOption, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-full text-left p-4 rounded-lg border border-border-default/20 hover:border-primary/30 hover:bg-background-ivory-light transition-all ${
                        option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={option.disabled ? undefined : option.action}
                      disabled={option.disabled}
                      title={option.tooltip}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{option.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-text-main mb-1">
                            {option.title}
                          </div>
                          <div className="text-xs text-text-faded leading-relaxed">
                            {option.description}
                          </div>
                          {option.disabled && option.tooltip && (
                            <div className="text-xs text-orange-600 mt-1">
                              {option.tooltip}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex justify-end pt-4 border-t border-border-default/20">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
