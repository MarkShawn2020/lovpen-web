'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/lovpen-ui/button';
import type {FileItem} from '@/services/file-client-v2';
import {fileClientV2} from '@/services/file-client-v2';
import {fastAPIAuthService} from '@/services/fastapi-auth-v2';
import type {AuthState} from '@/services/fastapi-auth-v2';
import {UploadModal} from './UploadModal';

type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  modified?: Date;
  children?: FileNode[];
  isExpanded?: boolean;
  contentType?: string;
  platform?: string;
  tags?: string[];
  processingStatus?: string;
};

type KnowledgeBaseProps = {
  onFileSelect?: (file: FileNode) => void;
  onFolderExpand?: (folder: FileNode) => void;
};

export function KnowledgeBase({onFileSelect, onFolderExpand}: KnowledgeBaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    loading: true,
    error: null,
  });

  // 获取平台显示名称
  const getPlatformDisplayName = (platform: string): string => {
    const platformNames: Record<string, string> = {
      'manual': '📝 手动上传',
      'notion': '📋 Notion',
      'flomo': '🔖 Flomo',
      'wechat-mp': '💬 微信公众号',
      'wechat-chat': '💬 微信聊天',
      'feishu': '🚀 飞书',
      'obsidian': '🔮 Obsidian',
      'unknown': '❓ 未知来源',
    };
    return platformNames[platform] || platform;
  };

  // 获取类型显示名称
  const getTypeDisplayName = (type: string): string => {
    const typeNames: Record<string, string> = {
      text: '📝 文本',
      document: '📄 文档',
      image: '🖼️ 图片',
      video: '🎥 视频',
      audio: '🎵 音频',
      unknown: '❓ 未知类型',
    };
    return typeNames[type] || type;
  };

  // 将 FileItem 转换为树形结构
  const convertToTreeStructure = (items: FileItem[]): FileNode[] => {
    const rootFolders: FileNode[] = [];

    // 按平台分组
    const platformGroups = items.reduce((acc, item) => {
      const platform = item.source_platform || 'unknown';
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(item);
      return acc;
    }, {} as Record<string, FileItem[]>);

    // 创建平台文件夹
    Object.entries(platformGroups).forEach(([platform, platformFiles]) => {
      const platformFolder: FileNode = {
        id: `platform-${platform}`,
        name: getPlatformDisplayName(platform),
        type: 'folder',
        path: `/${platform}`,
        isExpanded: platform === 'manual', // 默认展开手动上传的文件
        children: [],
      };

      // 按内容类型分组
      const typeGroups = platformFiles.reduce((acc, item) => {
        const type = item.content_type || 'unknown';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
        return acc;
      }, {} as Record<string, FileItem[]>);

      // 创建类型文件夹
      Object.entries(typeGroups).forEach(([type, typeFiles]) => {
        const typeFolder: FileNode = {
          id: `type-${platform}-${type}`,
          name: getTypeDisplayName(type),
          type: 'folder',
          path: `/${platform}/${type}`,
          isExpanded: false,
          children: [],
        };

        // 添加文件
        typeFiles.forEach((file) => {
          const fileNode: FileNode = {
            id: file.id,
            name: file.title || `File ${file.id.slice(0, 8)}`,
            type: 'file',
            path: `/${platform}/${type}/${file.id}`,
            size: file.metadata?.fileSize || 0,
            modified: new Date(file.updated_at),
            contentType: file.content_type,
            platform: file.source_platform,
            tags: file.tags,
            processingStatus: file.processing_status,
          };
          typeFolder.children!.push(fileNode);
        });

        if (typeFolder.children!.length > 0) {
          platformFolder.children!.push(typeFolder);
        }
      });

      if (platformFolder.children!.length > 0) {
        rootFolders.push(platformFolder);
      }
    });

    return rootFolders;
  };

  // 获取文件数据
  const fetchFiles = async () => {
    if (!authState.user) {
      setError('请先登录以访问知识库');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fileClientV2.getFiles({
        limit: 100,
        offset: 0,
      });
      setFiles(response.items);

      // 转换为树形结构
      const treeData = convertToTreeStructure(response.items);
      setKnowledgeBase(treeData);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
      
      // 如果是认证错误，显示登录提示
      if (errorMessage.includes('authenticated') || errorMessage.includes('401')) {
        setError('认证已过期，请重新登录');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // 搜索文件
  const searchFiles = async (query: string) => {
    if (!query.trim()) {
      // 不要在这里调用fetchFiles，会导致重复调用
      return;
    }

    if (!authState.user) {
      setError('请先登录以访问知识库');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fileClientV2.searchFiles({
        query,
        limit: 100,
        offset: 0,
      });
      setFiles(response.items);

      // 转换为树形结构
      const treeData = convertToTreeStructure(response.items);
      setKnowledgeBase(treeData);
    } catch (err) {
      console.error('Search failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      
      // 如果是认证错误，显示登录提示
      if (errorMessage.includes('authenticated') || errorMessage.includes('401')) {
        setError('认证已过期，请重新登录');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // 初始化认证服务
  useEffect(() => {
    const initialize = async () => {
      try {
        await fastAPIAuthService.initialize();
      } catch (error) {
        console.error('Failed to initialize auth service:', error);
      }
    };

    initialize();

    // 订阅认证状态变化
    const unsubscribe = fastAPIAuthService.subscribe(setAuthState);
    return () => {
      unsubscribe();
    };
  }, []);

  // 初始加载
  useEffect(() => {
    if (!isInitialized && !authState.loading) {
      if (authState.user) {
        fetchFiles();
      }
      setIsInitialized(true);
    }
  }, [isInitialized, authState.loading, authState.user]);

  // 搜索防抖
  useEffect(() => {
    // 跳过初始化时的空搜索词，避免重复调用
    if (!isInitialized) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        searchFiles(searchTerm);
      } else {
        // 当searchTerm为空时，重新获取所有文件
        fetchFiles();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, isInitialized]);

  // 删除文件
  const deleteFile = async (fileId: string) => {
    if (!authState.user) {
      setError('请先登录以访问知识库');
      return;
    }

    try {
      await fileClientV2.deleteFile(fileId);
      // 重新获取文件列表
      fetchFiles();
    } catch (error) {
      console.error('Failed to delete file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      
      // 如果是认证错误，显示登录提示
      if (errorMessage.includes('authenticated') || errorMessage.includes('401')) {
        setError('认证已过期，请重新登录');
      } else {
        setError(errorMessage);
      }
    }
  };

  // 切换文件夹展开状态
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

  // 处理文件/文件夹点击
  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file.id);
      onFileSelect?.(file);
    } else {
      toggleFolder(file.id);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes}B`;
    }
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)}KB`;
    }
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取文件/文件夹图标
  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return node.isExpanded ? '📂' : '📁';
    }

    // 根据内容类型返回图标
    const contentType = node.contentType || '';
    if (contentType.startsWith('image/')) {
      return '🖼️';
    }
    if (contentType.startsWith('video/')) {
      return '🎥';
    }
    if (contentType.startsWith('audio/')) {
      return '🎵';
    }
    if (contentType.includes('pdf')) {
      return '📕';
    }
    if (contentType.includes('document')) {
      return '📘';
    }
    if (contentType.includes('text')) {
      return '📝';
    }

    // 根据文件扩展名返回图标
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

  // 渲染文件树
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
              {node.type === 'file' && (
                <div className="text-xs text-text-faded">
                  {node.size && formatFileSize(node.size)}
                  {node.size && node.modified && ' • '}
                  {node.modified && formatDate(node.modified)}
                  {node.processingStatus && (
                    <span className={`ml-2 px-1 rounded text-xs ${
                      node.processingStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : node.processingStatus === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : node.processingStatus === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                    >
                      {node.processingStatus}
                    </span>
                  )}
                </div>
              )}
              {node.type === 'file' && node.tags && node.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {node.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {node.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +
                      {node.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            {node.type === 'folder' && (
              <span className="text-xs text-text-faded">
                {node.children?.length || 0}
              </span>
            )}
            {node.type === 'file' && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
                  title="删除文件"
                  onClick={(e) => {
                    e.stopPropagation();
                    // eslint-disable-next-line no-alert
                    if (window.confirm('确定删除这个文件吗？')) {
                      deleteFile(node.id);
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
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

  // 过滤节点（递归搜索）
  const filterNodes = (nodes: FileNode[], term: string): FileNode[] => {
    if (!term.trim()) {
      return nodes;
    }

    return nodes.reduce((filtered, node) => {
      if (node.name.toLowerCase().includes(term.toLowerCase())) {
        filtered.push(node);
      } else if (node.children) {
        const filteredChildren = filterNodes(node.children, term);
        if (filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren,
            isExpanded: true, // 展开包含匹配结果的文件夹
          });
        }
      }
      return filtered;
    }, [] as FileNode[]);
  };

  const filteredNodes = filterNodes(knowledgeBase, searchTerm);

  // 显示登录界面
  if (authState.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl mb-4">🔄</div>
        <p className="text-text-faded">正在加载...</p>
      </div>
    );
  }

  if (!authState.user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-xl font-medium text-text-main mb-2">需要登录</h3>
        <p className="text-text-faded mb-4">请先登录以访问知识库</p>
        <Button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="px-6 py-2"
        >
          前往登录
        </Button>
      </div>
    );
  }

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
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUploadModalOpen(true);
                }}
              >
                ➕ 新建
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = '/space';
                }}
              >
                📁 浏览
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
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-border-default/20">
          <div className="flex flex-wrap u-gap-s">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={(e) => {
                e.stopPropagation();
                const today = new Date().toISOString().split('T')[0];
                const todayFiles = files.filter(file =>
                  file.created_at?.startsWith(today || '') ?? false
                );
                const treeData = convertToTreeStructure(todayFiles);
                setKnowledgeBase(treeData);
              }}
            >
              📅 今日
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={(e) => {
                e.stopPropagation();
                const recentFiles = files
                  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                  .slice(0, 20);
                const treeData = convertToTreeStructure(recentFiles);
                setKnowledgeBase(treeData);
              }}
            >
              🕒 最近
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={(e) => {
                e.stopPropagation();
                fetchFiles();
              }}
            >
              🔄 刷新
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
              {files.length > 0 && (
                <span className="text-xs text-text-faded">
                  (
                  {files.length}
                  {' '}
                  个文件)
                </span>
              )}
            </h4>
            <div className="flex items-center u-gap-s">
              <button
                type="button"
                className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
                title="刷新"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchFiles();
                }}
              >
                🔄
              </button>
              <button
                type="button"
                className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
                title="前往完整文件浏览器"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = '/space';
                }}
              >
                📋
              </button>
            </div>
          </div>
        </div>

        <div className="h-full overflow-auto">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
              ❌
              {' '}
              {error}
              <button
                type="button"
                className="ml-2 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchFiles();
                }}
              >
                重试
              </button>
            </div>
          )}

          {loading
            ? (
              <div className="flex items-center justify-center h-32 text-text-faded">
                <div className="text-center">
                  <div className="text-2xl mb-2">⏳</div>
                  <p className="text-sm">加载中...</p>
                </div>
              </div>
            )
            : filteredNodes.length === 0
              ? (
                <div className="flex items-center justify-center h-32 text-text-faded">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📁</div>
                    <p className="text-sm">
                      {searchTerm ? '🔍 未找到匹配的文件' : files.length === 0 ? '📚 知识库为空' : '📁 无匹配结果'}
                    </p>
                    {!searchTerm && files.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsUploadModalOpen(true);
                        }}
                      >
                        ➕ 上传文件
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

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
        }}
        onUploadComplete={(_newItems) => {
          // 刷新文件列表
          fetchFiles();
          setIsUploadModalOpen(false);
        }}
      />

      {/* Storage Info */}
      <div className="bg-background-main rounded-lg border border-border-default/20 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-faded flex items-center u-gap-s">
            💾 存储使用
          </span>
          <span className="text-sm text-text-main">
            {files.length}
            {' '}
            个文件
          </span>
        </div>
        <div className="text-xs text-text-faded">
          {files.length > 0
            ? (
              <>
                最近更新:
                {' '}
                {new Date(Math.max(...files.map(f => new Date(f.updated_at).getTime()))).toLocaleString()}
              </>
            )
            : (
              '暂无文件'
            )}
        </div>
      </div>
    </div>
  );
}
