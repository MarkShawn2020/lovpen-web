'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/Button';

type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  modified?: Date;
  children?: FileNode[];
  isExpanded?: boolean;
};

type KnowledgeBaseProps = {
  onFileSelect?: (file: FileNode) => void;
  onFolderExpand?: (folder: FileNode) => void;
};

export function KnowledgeBase({onFileSelect, onFolderExpand}: KnowledgeBaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Mock knowledge base data - in real implementation, this would come from API
  const [knowledgeBase, setKnowledgeBase] = useState<FileNode[]>([
    {
      id: 'notes',
      name: 'Notes',
      type: 'folder',
      path: '/notes',
      isExpanded: true,
      children: [
        {
          id: 'daily-1',
          name: '2024-07-15.md',
          type: 'file',
          path: '/notes/2024-07-15.md',
          size: 1024,
          modified: new Date('2024-07-15'),
        },
        {
          id: 'daily-2',
          name: '2024-07-16.md',
          type: 'file',
          path: '/notes/2024-07-16.md',
          size: 2048,
          modified: new Date('2024-07-16'),
        },
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'folder',
      path: '/projects',
      isExpanded: false,
      children: [
        {
          id: 'project-a',
          name: 'AI研究',
          type: 'folder',
          path: '/projects/AI研究',
          children: [
            {
              id: 'ai-doc-1',
              name: '机器学习基础.md',
              type: 'file',
              path: '/projects/AI研究/机器学习基础.md',
              size: 5120,
              modified: new Date('2024-07-10'),
            },
          ],
        },
      ],
    },
    {
      id: 'resources',
      name: 'Resources',
      type: 'folder',
      path: '/resources',
      isExpanded: false,
      children: [
        {
          id: 'templates',
          name: 'Templates',
          type: 'folder',
          path: '/resources/templates',
          children: [
            {
              id: 'blog-template',
              name: '博客模板.md',
              type: 'file',
              path: '/resources/templates/博客模板.md',
              size: 1536,
              modified: new Date('2024-07-01'),
            },
          ],
        },
      ],
    },
  ]);

  const toggleFolder = (nodeId: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId && node.type === 'folder') {
          const updatedNode = {...node, isExpanded: !node.isExpanded};
          onFolderExpand?.(updatedNode);
          return updatedNode;
        }
        if (node.children) {
          return {...node, children: updateNodes(node.children)};
        }
        return node;
      });
    };

    setKnowledgeBase(updateNodes(knowledgeBase));
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file.id);
      onFileSelect?.(file);
    } else {
      toggleFolder(file.id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes}B`;
    }
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)}KB`;
    }
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return node.isExpanded ? '📂' : '📁';
    }

    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'md':
        return '📝';
      case 'txt':
        return '📄';
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📘';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      const isSelected = selectedFile === node.id;
      const paddingLeft = depth * 16 + 12;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center p-2 cursor-pointer transition-colors hover:bg-background-ivory-medium ${
              isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''
            }`}
            style={{paddingLeft}}
            onClick={() => handleFileClick(node)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFileClick(node);
              }
            }}
          >
            <span className="text-sm mr-2">{getFileIcon(node)}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-text-main text-sm truncate">
                {node.name}
              </div>
              {node.type === 'file' && node.size && node.modified && (
                <div className="text-xs text-text-faded">
                  {formatFileSize(node.size)}
                  {' '}
                  •
                  {formatDate(node.modified)}
                </div>
              )}
            </div>
            {node.type === 'folder' && (
              <span className="text-xs text-text-faded">
                {node.children?.length || 0}
              </span>
            )}
          </div>

          {node.type === 'folder' && node.isExpanded && node.children && (
            <div>
              {renderFileTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredNodes = knowledgeBase.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col u-gap-m h-full">
      {/* Knowledge Base Header */}
      <div className="bg-background-main rounded-lg border border-border-default/20 overflow-hidden">
        <div className="bg-background-ivory-medium px-4 py-3 border-b border-border-default/20">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-text-main text-sm flex items-center u-gap-s">
              📚 知识库
            </h3>
            <div className="flex items-center u-gap-s">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                ➕ 新建
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                📁 导入
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border-default/20">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 搜索文件和文件夹..."
              className="w-full px-3 py-2 border border-border-default/20 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-border-default/20">
          <div className="flex flex-wrap u-gap-s">
            <Button variant="outline" size="sm" className="text-xs h-7 px-2">
              📅 今日
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7 px-2">
              ⭐ 收藏
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-7 px-2">
              🕒 最近
            </Button>
          </div>
        </div>
      </div>

      {/* File Tree */}
      <div className="bg-background-main rounded-lg border border-border-default/20 flex-1 overflow-hidden">
        <div className="bg-background-ivory-medium px-4 py-2 border-b border-border-default/20">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-main text-sm flex items-center u-gap-s">
              📁 文件浏览器
            </h4>
            <div className="flex items-center u-gap-s">
              <button
                type="button"
                className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
                title="列表视图"
              >
                📋
              </button>
              <button
                type="button"
                className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
                title="网格视图"
              >
                ⊞
              </button>
            </div>
          </div>
        </div>

        <div className="h-full overflow-auto">
          {filteredNodes.length === 0
            ? (
                <div className="flex items-center justify-center h-32 text-text-faded">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📁</div>
                    <p className="text-sm">
                      {searchTerm ? '🔍 未找到匹配的文件' : '📚 知识库为空'}
                    </p>
                    {!searchTerm && (
                      <Button variant="outline" size="sm" className="mt-2 text-xs h-7 px-2">
                        ➕ 开始创建
                      </Button>
                    )}
                  </div>
                </div>
              )
            : (
                <div className="pb-4">
                  {renderFileTree(filteredNodes)}
                </div>
              )}
        </div>
      </div>

      {/* Storage Info */}
      <div className="bg-background-main rounded-lg border border-border-default/20 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-faded flex items-center u-gap-s">
            💾 存储使用
          </span>
          <span className="text-sm text-text-main">2.3GB / 10GB</span>
        </div>
        <div className="w-full bg-background-ivory-medium rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{width: '23%'}}></div>
        </div>
      </div>
    </div>
  );
}
