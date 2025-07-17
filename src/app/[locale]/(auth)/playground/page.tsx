'use client';

import type {Platform} from '@/types/sidebar';
import {useState} from 'react';
import {ChatSidebar} from '@/components/chat/ChatSidebar';
import {KnowledgeBase} from '@/components/knowledge/KnowledgeBase';
import {Container} from '@/components/layout/Container';
import {PreviewSection} from './preview-section';

export default function Create() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [previewPanels, setPreviewPanels] = useState([
    {id: 'preview-1', platform: 'wechat', title: '微信公众号预览', isSelected: false},
  ]);

  const platforms: Record<string, Platform> = {
    wechat: {
      name: '微信',
      fullName: '微信公众号',
      color: 'bg-green-500',
      constraints: {
        maxCharacters: 2000,
        supportedFormats: ['text', 'image', 'video'],
        imageRequirements: {maxSize: '20MB', formats: ['JPG', 'PNG']},
      },
    },
    zhihu: {
      name: '知乎',
      fullName: '知乎专栏',
      color: 'bg-blue-500',
      constraints: {
        maxCharacters: 5000,
        supportedFormats: ['text', 'image', 'code', 'formula'],
        imageRequirements: {maxSize: '5MB', formats: ['JPG', 'PNG', 'GIF']},
      },
    },
    xiaohongshu: {
      name: '小红书',
      fullName: '小红书笔记',
      color: 'bg-pink-500',
      constraints: {
        maxCharacters: 1000,
        supportedFormats: ['text', 'image', 'hashtag'],
        imageRequirements: {maxSize: '10MB', formats: ['JPG', 'PNG']},
      },
    },
    twitter: {
      name: 'Twitter',
      fullName: 'Twitter动态',
      color: 'bg-sky-500',
      constraints: {
        maxCharacters: 280,
        supportedFormats: ['text', 'image', 'video', 'link'],
        imageRequirements: {maxSize: '5MB', formats: ['JPG', 'PNG', 'GIF']},
      },
    },
  };

  const addPreviewPanel = (platform: string) => {
    const newId = `preview-${Date.now()}`;
    const platformInfo = platforms[platform];
    if (!platformInfo) {
      return;
    }

    const newPanel = {
      id: newId,
      platform,
      title: `${platformInfo.fullName}预览`,
      isSelected: false,
    };
    setPreviewPanels([...previewPanels, newPanel]);
  };

  const removePreviewPanel = (panelId: string) => {
    if (previewPanels.length > 1) {
      setPreviewPanels(previewPanels.filter(panel => panel.id !== panelId));
    }
  };

  const reorderPreviewPanels = (panels: Array<{
    id: string;
    platform: string;
    title: string;
    isSelected?: boolean;
  }>) => {
    setPreviewPanels(panels.map(panel => ({...panel, isSelected: panel.isSelected ?? false})));
  };

  // 处理面板选择
  const handlePanelSelect = (panelId: string, isCtrlClick = false) => {
    let newSelectedPanels: string[] = [];

    if (!isCtrlClick) {
      // 普通点击：清除其他选择，只选择当前面板
      newSelectedPanels = [panelId];
      setPreviewPanels(panels =>
        panels.map(panel => ({
          ...panel,
          isSelected: panel.id === panelId,
        })),
      );
    } else {
      // Ctrl+点击：切换当前面板选择状态
      const currentlySelected = previewPanels.filter(p => p.isSelected).map(p => p.id);
      const isCurrentlySelected = currentlySelected.includes(panelId);

      if (isCurrentlySelected) {
        newSelectedPanels = currentlySelected.filter(id => id !== panelId);
      } else {
        newSelectedPanels = [...currentlySelected, panelId];
      }

      setPreviewPanels(panels =>
        panels.map(panel => ({
          ...panel,
          isSelected: newSelectedPanels.includes(panel.id),
        })),
      );
    }

    // Update selected panels state
    // Note: selectPanels functionality removed as it's no longer needed
  };

  // 处理背景点击（清除选择）
  const handleBackgroundClick = () => {
    setPreviewPanels(panels =>
      panels.map(panel => ({...panel, isSelected: false})),
    );
    // Clear selection state
    // Note: selectPanels functionality removed as it's no longer needed
  };

  // Handle knowledge base file selection
  const handleFileSelect = (_file: any) => {
    // Here you would typically load the file content or trigger some action
    // File selection logic would be implemented here
  };

  // Handle chat message sending
  const handleMessageSend = (message: string, _type: 'text' | 'voice') => {
    // Simulate content generation based on chat message
    if (message.includes('生成') || message.includes('写')) {
      setTimeout(() => {
        setGeneratedContent(`# 基于对话生成的内容

根据你的要求「${message}」，我为你生成了以下内容：

## 主要观点

这是一个基于AI对话生成的示例内容，展示了如何将聊天交互转化为实际的文章内容。

## 详细说明

通过与AI助手的对话，用户可以：
- 表达创作需求和想法
- 获得实时的内容建议
- 快速生成结构化的文章

## 总结

这种对话式的内容创作方式让写作变得更加直观和高效。

---
*本文由 LovPen AI 助手协助生成*`);
      }, 1500);
    }
  };

  return (
    <Container fullHeight>
      <div className="u-flex-main h-full">
        {/* 知识库 */}
        <div className="w-full lg:w-1/4 min-w-0 h-full flex flex-col">
          <KnowledgeBase
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* 聊天面板 */}
        <div className="w-full lg:w-5/12 min-w-0 h-full flex flex-col">
          <ChatSidebar
            onMessageSend={handleMessageSend}
          />
        </div>

        {/* 预览区域 */}
        <div className="w-full lg:w-1/3 min-w-0 h-full flex flex-col">
          <PreviewSection
            previewPanels={previewPanels}
            platforms={platforms}
            generatedContent={generatedContent}
            addPreviewPanel={addPreviewPanel}
            removePreviewPanel={removePreviewPanel}
            reorderPreviewPanels={reorderPreviewPanels}
            onPanelSelect={handlePanelSelect}
            onBackgroundClick={handleBackgroundClick}
          />
        </div>
      </div>
    </Container>
  );
};
