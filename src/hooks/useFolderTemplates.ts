/**
 * 文件夹模板管理 Hook
 * 提供文件夹模板的获取、创建、管理功能
 */

import { useCallback, useEffect, useState } from 'react';
import { getFolderById, getFolderTree, getRecommendedFolder } from '@/constants/folderTemplates';
import type { FolderTemplate } from '@/constants/folderTemplates';
import type { FileItem } from '@/services/file-client-v2';

export type FolderNode = {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  isSystem: boolean;
  sortOrder: number;
  children?: FolderNode[];
  isExpanded?: boolean;
  fileCount?: number;
};

export function useFolderTemplates() {
  const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 将模板转换为节点
  const convertTemplatesToNodes = useCallback((templates: FolderTemplate[]): FolderNode[] => {
    return templates.map(template => ({
      id: template.id,
      name: template.name,
      icon: template.icon,
      description: template.description,
      path: template.path,
      isSystem: template.isSystem,
      sortOrder: template.sortOrder,
      isExpanded: template.id === 'library', // 默认展开Library
      children: template.children ? convertTemplatesToNodes(template.children) : undefined,
      fileCount: 0,
    }));
  }, []);

  // 初始化文件夹树
  const initializeFolderTree = useCallback(() => {
    try {
      const templates = getFolderTree();
      const tree = convertTemplatesToNodes(templates);
      setFolderTree(tree);
    } catch (err) {
      console.error('Failed to initialize folder tree:', err);
      setError('初始化文件夹失败');
    }
  }, [convertTemplatesToNodes]);

  // 更新文件夹的文件数量
  const updateFileCount = useCallback((files: FileItem[]) => {
    const updateNodeCounts = (nodes: FolderNode[]): FolderNode[] => {
      return nodes.map((node) => {
        // 计算该文件夹下的文件数量
        const count = files.filter((file) => {
          // 根据文件的source_platform或路径判断是否属于该文件夹
          if (file.source_platform) {
            const template = getFolderById(node.id);
            if (template?.autoClassify?.platforms?.includes(file.source_platform)) {
              return true;
            }
          }
          return false;
        }).length;

        return {
          ...node,
          fileCount: count,
          children: node.children ? updateNodeCounts(node.children) : undefined,
        };
      });
    };

    setFolderTree(prev => updateNodeCounts(prev));
  }, []);

  // 切换文件夹展开状态
  const toggleFolder = useCallback((folderId: string) => {
    const updateNodeExpansion = (nodes: FolderNode[]): FolderNode[] => {
      return nodes.map((node) => {
        if (node.id === folderId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: updateNodeExpansion(node.children) };
        }
        return node;
      });
    };

    setFolderTree(prev => updateNodeExpansion(prev));
  }, []);

  // 展开所有文件夹
  const expandAll = useCallback(() => {
    const expandNodes = (nodes: FolderNode[]): FolderNode[] => {
      return nodes.map(node => ({
        ...node,
        isExpanded: true,
        children: node.children ? expandNodes(node.children) : undefined,
      }));
    };

    setFolderTree(prev => expandNodes(prev));
  }, []);

  // 折叠所有文件夹
  const collapseAll = useCallback(() => {
    const collapseNodes = (nodes: FolderNode[]): FolderNode[] => {
      return nodes.map(node => ({
        ...node,
        isExpanded: false,
        children: node.children ? collapseNodes(node.children) : undefined,
      }));
    };

    setFolderTree(prev => collapseNodes(prev));
  }, []);

  // 根据文件信息推荐文件夹
  const recommendFolder = useCallback((file: {
    source_platform?: string;
    content_type?: string;
    title?: string;
    filename?: string;
  }) => {
    const fileName = file.title || file.filename || '';
    return getRecommendedFolder({
      platform: file.source_platform,
      contentType: file.content_type,
      fileName,
    });
  }, []);

  // 获取文件夹路径
  const getFolderPath = useCallback((folderId: string): string => {
    const folder = getFolderById(folderId);
    return folder?.path || '/';
  }, []);

  // 检查是否为系统文件夹
  const isSystemFolder = useCallback((folderId: string): boolean => {
    const folder = getFolderById(folderId);
    return folder?.isSystem || false;
  }, []);

  // 获取文件夹面包屑路径
  const getBreadcrumbs = useCallback((folderId: string): FolderNode[] => {
    const breadcrumbs: FolderNode[] = [];
    
    const findPath = (nodes: FolderNode[], targetId: string, path: FolderNode[]): boolean => {
      for (const node of nodes) {
        const currentPath = [...path, node];
        
        if (node.id === targetId) {
          breadcrumbs.push(...currentPath);
          return true;
        }
        
        if (node.children && findPath(node.children, targetId, currentPath)) {
          return true;
        }
      }
      return false;
    };

    findPath(folderTree, folderId, []);
    return breadcrumbs;
  }, [folderTree]);

  // 搜索文件夹
  const searchFolders = useCallback((query: string): FolderNode[] => {
    if (!query.trim()) {
      return folderTree;
    }

    const searchNodes = (nodes: FolderNode[]): FolderNode[] => {
      const results: FolderNode[] = [];
      
      for (const node of nodes) {
        const matches = node.name.toLowerCase().includes(query.toLowerCase())
          || node.description.toLowerCase().includes(query.toLowerCase());
        
        if (matches) {
          results.push({ ...node, isExpanded: true });
        } else if (node.children) {
          const childResults = searchNodes(node.children);
          if (childResults.length > 0) {
            results.push({
              ...node,
              isExpanded: true,
              children: childResults,
            });
          }
        }
      }
      
      return results;
    };

    return searchNodes(folderTree);
  }, [folderTree]);

  // 初始化
  useEffect(() => {
    initializeFolderTree();
  }, [initializeFolderTree]);

  return {
    // 状态
    folderTree,
    error,
    
    // 操作方法
    toggleFolder,
    expandAll,
    collapseAll,
    updateFileCount,
    recommendFolder,
    getFolderPath,
    isSystemFolder,
    getBreadcrumbs,
    searchFolders,
    
    // 工具方法
    refresh: initializeFolderTree,
  };
}
