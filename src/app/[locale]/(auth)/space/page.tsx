'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Archive,
  Download,
  Edit,
  FileText,
  Filter,
  Grid,
  Image,
  List,
  MoreVertical,
  Music,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Video
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fileClient } from '@/services/file-client';
import type {FileItem} from '@/services/file-client';
import { cn } from '@/lib/utils';

export default function FilesPage() {
  const t = useTranslations('files');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [filter] = useState<{
    type?: string;
    platform?: string;
  }>({});

  // 获取文件列表
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fileClient.getFiles({
        limit: 50,
        offset: 0,
        item_type: filter.type,
        platform: filter.platform,
      });
      setFiles(response.items);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索文件
  const searchFiles = async (query: string) => {
    if (!query.trim()) {
      fetchFiles();
      return;
    }

    try {
      setLoading(true);
      const response = await fileClient.searchFiles({
        query,
        limit: 50,
        offset: 0,
        item_type: filter.type,
        platform: filter.platform,
      });
      setFiles(response.items);
    } catch (error) {
      console.error('Failed to search files:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除文件
  const deleteFile = async (id: string) => {
    try {
      await fileClient.deleteFile(id);
      setFiles(files.filter(file => file.id !== id));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // 批量删除
  const deleteSelectedFiles = async () => {
    if (selectedFiles.size === 0) {
 return;
}

    try {
      await fileClient.batchDeleteByIds(Array.from(selectedFiles));
      setFiles(files.filter(file => !selectedFiles.has(file.id)));
      setSelectedFiles(new Set());
    } catch (error) {
      console.error('Failed to delete files:', error);
    }
  };

  // 获取文件图标
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
 return <Image className="w-4 h-4" />;
}
    if (contentType.startsWith('video/')) {
 return <Video className="w-4 h-4" />;
}
    if (contentType.startsWith('audio/')) {
 return <Music className="w-4 h-4" />;
}
    if (contentType.includes('pdf') || contentType.includes('document')) {
 return <FileText className="w-4 h-4" />;
}
    return <Archive className="w-4 h-4" />;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 切换文件选择
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  useEffect(() => {
    fetchFiles();
  }, [filter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchFiles(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          {t('upload')}
        </Button>
      </div>

      {/* 搜索和过滤器 */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          {t('filter')}
        </Button>

        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={fetchFiles}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* 批量操作 */}
      {selectedFiles.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t('selectedCount', { count: selectedFiles.size })}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={deleteSelectedFiles}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('delete')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 文件列表/网格 */}
      <div className="flex-1 overflow-auto">
        {loading
? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        )
: (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'playground-y-2'
          )}
          >
          {files.map(file => (
            <Card
              key={file.id}
              className={cn(
                'cursor-pointer hover:shadow-md transition-shadow',
                selectedFiles.has(file.id) && 'ring-2 ring-blue-500'
              )}
              onClick={() => toggleFileSelection(file.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.content_type)}
                    <CardTitle className="text-sm truncate">
                      {file.title || `File ${file.id.slice(0, 8)}`}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        {t('download')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        {t('edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {file.source_platform}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getStatusColor(file.processing_status))}
                    >
                      {file.processing_status}
                    </Badge>
                  </div>

                  {file.content && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {file.content}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                    <span>{file.content_type}</span>
                  </div>

                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {file.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +
{file.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && files.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noFiles')}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? t('noSearchResults')
                : t('noFilesDescription')}
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              {t('uploadFirst')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
