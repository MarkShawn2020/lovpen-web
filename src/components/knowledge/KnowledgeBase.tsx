'use client';

import { useEffect, useMemo, useState} from 'react';
import {Button} from '@/components/lovpen-ui/button';
import type {FileItem} from '@/services/file-client-v2';
import {fastAPIAuthService} from '@/services/fastapi-auth-v2';
import type {AuthState} from '@/services/fastapi-auth-v2';
import {UploadModal} from './UploadModal';
import {useFolderTemplates} from '@/hooks/useFolderTemplates';
import type {FolderNode} from '@/hooks/useFolderTemplates';
import {useDeleteFile, useFiles, useSearchFiles} from '@/hooks/useFileQueries';

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

// 纯函数：基于模板创建文件夹结构
const createTemplateFolders = (templates: FolderNode[]): FileNode[] => {
  return templates.map(template => ({
    id: template.id,
    name: template.name,
    type: 'folder' as const,
    path: template.path,
    isExpanded: template.isExpanded || false,
    children: template.children ? createTemplateFolders(template.children) : [],
  }));
};

// 纯函数：将文件添加到指定文件夹
const addFileToFolder = (folders: FileNode[], file: FileNode, targetPath: string): boolean => {
  for (const folder of folders) {
    if (folder.path === targetPath) {
      folder.children = folder.children || [];
      folder.children.push(file);
      return true;
    }
    if (folder.children && folder.path && targetPath.startsWith(folder.path)) {
      if (addFileToFolder(folder.children, file, targetPath)) {
        return true;
      }
    }
  }
  return false;
};

// 纯函数：将 FileItem 转换为树形结构
const convertFilesToTree = (
  files: FileItem[], 
  folderTree: FolderNode[], 
  recommendFolder: (file: any) => any
): FileNode[] => {
  if (files.length === 0) {
 return []; 
}
  
  const templateFolders = createTemplateFolders(folderTree);
  
  files.forEach((file) => {
    const recommendedFolder = recommendFolder({
      source_platform: file.source_platform,
      content_type: file.content_type,
      title: file.title,
    });
    
    const fileNode: FileNode = {
      id: file.id,
      name: file.title || `File ${file.id.slice(0, 8)}`,
      type: 'file',
      path: `${recommendedFolder?.path || '/Library/Others'}/${file.id}`,
      size: file.metadata?.fileSize || 0,
      modified: new Date(file.updated_at),
      contentType: file.content_type,
      platform: file.source_platform,
      tags: file.tags,
      processingStatus: file.processing_status,
    };
    
    addFileToFolder(templateFolders, fileNode, recommendedFolder?.path || '/Library/Others');
  });
  
  return templateFolders;
};

export function KnowledgeBase({onFileSelect, onFolderExpand}: KnowledgeBaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [localFileNodes, setLocalFileNodes] = useState<FileNode[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    loading: true,
    error: null,
  });
  const [localFolders, setLocalFolders] = useState<FileNode[]>([]);
  const [isLocalFolderSupported, setIsLocalFolderSupported] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [filteredCloudFiles, setFilteredCloudFiles] = useState<FileItem[] | null>(null);
  
  // 使用文件夹模板系统
  const {
    folderTree,
    updateFileCount,
    recommendFolder,
    toggleFolder: toggleTemplateFolder,
  } = useFolderTemplates();

  // React Query hooks for data management
  const {
    data: filesData,
    isLoading: isFilesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useFiles({
    enabled: !!authState.user && !searchTerm.trim(),
  });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchFiles({
    query: searchTerm,
    enabled: !!authState.user && !!searchTerm.trim(),
  });

  const deleteFileMutation = useDeleteFile();

  // 合并数据和加载状态 - 使用useMemo稳定引用
  const files = useMemo(() => {
    const result = searchTerm.trim() ? (searchData?.items || []) : (filesData?.items || []);
    return result;
  }, [searchTerm, searchData?.items, filesData?.items]);
  
  const isLoading = searchTerm.trim() ? isSearchLoading : isFilesLoading;
  const error = searchTerm.trim() ? searchError : filesError;

  // 检查 File System Access API 支持
  useEffect(() => {
    const supported = 'showDirectoryPicker' in window
      && typeof window.showDirectoryPicker === 'function';
    setIsLocalFolderSupported(supported);
  }, []);

  // 处理文件删除
  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFileMutation.mutateAsync(fileId);
    } catch (error) {
      console.error('Failed to delete file:', error);
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

  // 使用纯函数计算云端文件树，避免循环依赖
  const cloudFileTree = useMemo(() => {
    const filesToUse = filteredCloudFiles || files;
    return convertFilesToTree(filesToUse, folderTree, recommendFolder);
  }, [filteredCloudFiles, files, folderTree, recommendFolder]);

  // 单独的useEffect用于更新文件计数
  useEffect(() => {
    if (files.length > 0) {
      updateFileCount(files);
    }
  }, [files, updateFileCount]);

  // 直接计算最终的知识库树，不使用useEffect避免循环
  const finalKnowledgeBase = useMemo(() => {
    // 获取本地文件夹（从当前 knowledgeBase 中过滤）
    const currentLocalFolders = localFileNodes;
    // 合并本地文件夹和云端文件树
    return [...currentLocalFolders, ...cloudFileTree];
  }, [localFileNodes, cloudFileTree]);

  // 选择本地文件夹
  // 递归读取本地文件夹结构
  const readDirectoryRecursively = async (directoryHandle: any, basePath: string): Promise<FileNode> => {
    const children: FileNode[] = [];
    
    for await (const [name, handle] of directoryHandle.entries()) {
      const path = `${basePath}${name}`;
      
      if (handle.kind === 'file') {
        const file = await handle.getFile();
        children.push({
          id: `local-${path}`,
          name,
          type: 'file',
          path,
          size: file.size,
          modified: new Date(file.lastModified),
          contentType: file.type || 'application/octet-stream',
          platform: 'local',
          tags: ['local'],
          // @ts-ignore - 保存文件句柄用于后续读取内容
          _fileHandle: handle
        });
      } else if (handle.kind === 'directory') {
        const subFolder = await readDirectoryRecursively(handle, `${path}/`);
        children.push(subFolder);
      }
    }
    
    return {
      id: `local-${basePath}`,
      name: basePath === '/' ? directoryHandle.name : basePath.split('/').filter(Boolean).pop() || directoryHandle.name,
      type: 'folder',
      path: basePath,
      children: children.sort((a, b) => {
        // 文件夹在前，文件在后
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      }),
      isExpanded: false,
      platform: 'local',
      tags: ['local'],
      // @ts-ignore - 保存目录句柄
      _directoryHandle: directoryHandle
    };
  };

  const handleLocalFolderSelect = async () => {
    if (!isLocalFolderSupported) {
      console.error('您的浏览器不支持本地文件夹访问功能，请使用 Chrome 88+ 或 Edge 88+');
      setLocalError('您的浏览器不支持本地文件夹访问功能，请使用 Chrome 88+ 或 Edge 88+');
      return;
    }

    try {
      const directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'read'
      });
      
      const localFileTree = await readDirectoryRecursively(directoryHandle, '/');
      setLocalFolders([localFileTree]);
      
      // 将本地文件夹添加到本地文件节点
      setLocalFileNodes(prev => [localFileTree, ...prev]);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to access local folder:', error);
        setLocalError('访问本地文件夹失败，请检查权限设置');
      }
    }
  };

  // 切换文件夹展开状态
  const toggleFolder = (nodeId: string) => {
    // 更新模板文件夹状态（云端文件夹）
    toggleTemplateFolder(nodeId);
    
    // 更新本地文件夹状态
    const updateLocalNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId && node.type === 'folder') {
          const updatedNode = {...node, isExpanded: !node.isExpanded};
          onFolderExpand?.(updatedNode);
          return updatedNode;
        }
        if (node.children) {
          return {...node, children: updateLocalNodes(node.children)};
        }
        return node;
      });
    };

    setLocalFileNodes(updateLocalNodes);
  };

  // 读取本地文件内容
  const readLocalFileContent = async (fileNode: FileNode): Promise<string> => {
    try {
      // @ts-ignore
      const fileHandle = fileNode._fileHandle;
      if (!fileHandle) {
        throw new Error('未找到文件句柄');
      }
      
      const file = await fileHandle.getFile();
      const text = await file.text();
      return text;
    } catch (error) {
      console.error('Failed to read local file:', error);
      throw new Error('读取本地文件失败');
    }
  };

  // 处理文件/文件夹点击
  const handleFileClick = async (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file.id);
      
      // 如果是本地文件，尝试读取内容
      if (file.platform === 'local') {
        try {
          const content = await readLocalFileContent(file);
          // 将内容添加到文件节点中
          const fileWithContent = {
            ...file,
            content
          };
          onFileSelect?.(fileWithContent);
        } catch (error) {
          console.error('Failed to read local file content:', error);
          onFileSelect?.(file);
        }
      } else {
        onFileSelect?.(file);
      }
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
      // 本地文件夹使用不同图标
      if (node.platform === 'local') {
        return node.isExpanded ? '🗂️' : '🗁';
      }
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

  // 拖拽相关事件处理
  const handleDragStart = (e: React.DragEvent, node: FileNode) => {
    if (node.type === 'file') {
      // 设置拖拽数据
      const dragData = {
        type: 'file-tree-item',
        node: {
          id: node.id,
          name: node.name,
          contentType: node.contentType || 'application/octet-stream',
          size: node.size || 0,
          path: node.path,
          platform: node.platform
        }
      };
      
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = 'copy';
      
      // 设置拖拽图像
      e.dataTransfer.setDragImage(e.currentTarget as HTMLElement, 0, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // 拖拽结束时的处理
    e.preventDefault();
  };

  // 渲染文件树
  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      const isSelected = selectedFile === node.id;
      const paddingLeft = depth * 16 + 12;
      const isDraggableFile = node.type === 'file';

      return (
        <div key={node.id}>
          <div
            className={`flex items-center p-2 cursor-pointer transition-colors hover:bg-background-ivory-medium ${
              isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''
            } ${isDraggableFile ? 'hover:shadow-sm' : ''}`}
            style={{paddingLeft}}
            onClick={() => handleFileClick(node)}
            role="button"
            tabIndex={0}
            draggable={isDraggableFile}
            onDragStart={e => handleDragStart(e, node)}
            onDragEnd={handleDragEnd}
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
                    <span 
                      key={index} 
                      className={`text-xs px-1 rounded ${
                        tag === 'local' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag === 'local' ? '💻 本地' : tag}
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
                      handleDeleteFile(node.id);
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

  // 使用搜索功能，如果有搜索词则使用模板搜索，否则使用最终知识库
  const filteredNodes = searchTerm.trim() 
    ? filterNodes(finalKnowledgeBase, searchTerm)
    : finalKnowledgeBase;

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
                setFilteredCloudFiles(todayFiles);
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
                setFilteredCloudFiles(recentFiles);
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
                setFilteredCloudFiles(null);
                refetchFiles();
              }}
            >
              🔄 刷新
            </Button>
            {isLocalFolderSupported && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocalFolderSelect();
                }}
                title="选择本地文件夹进行映射"
              >
                📂 本地文件夹
              </Button>
            )}
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
                  setFilteredCloudFiles(null);
                  refetchFiles();
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
              {error instanceof Error ? error.message : String(error)}
              <button
                type="button"
                className="ml-2 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilteredCloudFiles(null);
                  refetchFiles();
                }}
              >
                重试
              </button>
            </div>
          )}

          {isLoading
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
          setFilteredCloudFiles(null);
          refetchFiles();
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
