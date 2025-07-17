'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Archive,
  FileText,
  Filter,
  Image,
  Music,
  RefreshCw,
  Search,
  Sparkles,
  Video,
  X
} from 'lucide-react';
import { fileClient } from '@/services/file-client';
import type {FileItem} from '@/services/file-client';

type SearchFilters = {
  contentTypes: string[];
  platforms: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
  tags: string[];
}

export default function SearchPage() {
  const t = useTranslations('files');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'basic' | 'ai'>('basic');
  const [filters, setFilters] = useState<SearchFilters>({
    contentTypes: [],
    platforms: [],
    dateRange: {},
    tags: [],
  });

  // 内容类型选项
  const contentTypes = [
    { value: 'text', label: t('contentType.text'), icon: FileText },
    { value: 'document', label: t('contentType.document'), icon: FileText },
    { value: 'image', label: t('contentType.image'), icon: Image },
    { value: 'video', label: t('contentType.video'), icon: Video },
    { value: 'audio', label: t('contentType.audio'), icon: Music },
  ];

  // 平台选项
  const platforms = [
    { value: 'manual', label: t('platform.manual') },
    { value: 'notion', label: t('platform.notion') },
    { value: 'flomo', label: t('platform.flomo') },
    { value: 'wechat', label: t('platform.wechat') },
    { value: 'feishu', label: t('platform.feishu') },
  ];

  // 执行搜索
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      let response;

      if (searchMode === 'ai') {
        // AI 搜索
        response = await fileClient.aiSearch({
          query: searchQuery,
          limit: 50,
          enable_highlighting: true,
          include_reasoning: true,
          filters: {
            content_types: filters.contentTypes.length > 0 ? filters.contentTypes : undefined,
            platforms: filters.platforms.length > 0 ? filters.platforms : undefined,
            date_range: filters.dateRange.start || filters.dateRange.end ? filters.dateRange : undefined,
          },
        });
      } else {
        // 基础搜索
        response = await fileClient.searchFiles({
          query: searchQuery,
          limit: 50,
          item_type: filters.contentTypes[0],
          platform: filters.platforms[0],
        });
      }

      setSearchResults(response.items);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 添加过滤器
  const addFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: type === 'dateRange' ? value : [...(prev[type] as string[]), value]
    }));
  };

  // 移除过滤器
  const removeFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).filter(item => item !== value)
    }));
  };

  // 清空所有过滤器
  const clearFilters = () => {
    setFilters({
      contentTypes: [],
      platforms: [],
      dateRange: {},
      tags: [],
    });
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

  // 搜索处理
  const handleSearch = () => {
    performSearch(query);

    // 更新 URL
    const params = new URLSearchParams();
    if (query) {
 params.set('q', query);
}
    if (searchMode === 'ai') {
 params.set('mode', 'ai');
}
    router.push(`/dashboard/files/search?${params.toString()}`);
  };

  // 初始化搜索
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    const initialMode = searchParams.get('mode');

    if (initialQuery) {
      setQuery(initialQuery);
      setSearchMode(initialMode === 'ai' ? 'ai' : 'basic');
      performSearch(initialQuery);
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('searchFiles')}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          {t('back')}
        </Button>
      </div>

      {/* 搜索框 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索模式切换 */}
            <div className="flex gap-2">
              <Button
                variant={searchMode === 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchMode('basic')}
              >
                <Search className="w-4 h-4 mr-2" />
                {t('basicSearch')}
              </Button>
              <Button
                variant={searchMode === 'ai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSearchMode('ai')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('aiSearch')}
              </Button>
            </div>

            {/* 搜索输入 */}
            <div className="flex gap-2">
              <Input
                placeholder={
                  searchMode === 'ai'
                    ? t('aiSearchPlaceholder')
                    : t('searchPlaceholder')
                }
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading
? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )
: (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* 过滤器 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Label>{t('filters')}</Label>
                {(filters.contentTypes.length > 0 || filters.platforms.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    {t('clearFilters')}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 内容类型 */}
                <div>
                  <Label className="text-sm">Content Type</Label>
                  <Select onValueChange={value => addFilter('contentTypes', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectContentType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 平台 */}
                <div>
                  <Label className="text-sm">Platform</Label>
                  <Select onValueChange={value => addFilter('platforms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectPlatform')} />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 日期范围 */}
                <div>
                  <Label className="text-sm">{t('dateRange')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={filters.dateRange.start || ''}
                      onChange={e => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                    />
                    <Input
                      type="date"
                      value={filters.dateRange.end || ''}
                      onChange={e => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* 活跃过滤器 */}
              {(filters.contentTypes.length > 0 || filters.platforms.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {filters.contentTypes.map(type => (
                    <Badge key={type} variant="secondary" className="gap-1">
                      {contentTypes.find(ct => ct.value === type)?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4"
                        onClick={() => removeFilter('contentTypes', type)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                  {filters.platforms.map(platform => (
                    <Badge key={platform} variant="secondary" className="gap-1">
                      {platforms.find(p => p.value === platform)?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4"
                        onClick={() => removeFilter('platforms', platform)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索结果 */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t('searchResults', { count: searchResults.length })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map(file => (
                <div key={file.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    {getFileIcon(file.content_type)}
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">
                        {file.title || `File ${file.id.slice(0, 8)}`}
                      </h3>

                      {file.content && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {file.content}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Badge variant="outline">{file.source_platform}</Badge>
                        <span>•</span>
                        <span>{file.content_type}</span>
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleDateString()}</span>
                      </div>

                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {file.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 空状态 */}
      {!loading && query && searchResults.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noResults')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('noResultsDescription')}
            </p>
            <Button variant="outline" onClick={clearFilters}>
              {t('clearFilters')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 搜索提示 */}
      {!query && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('searchTitle')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('searchDescription')}
            </p>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
<strong>{t('basicSearchTips')}</strong>
{' '}
file names, content keywords
              </p>
              <p>
<strong>{t('aiSearchTips')}</strong>
{' '}
"Find my presentation about sales" or "Show me images from last month"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
