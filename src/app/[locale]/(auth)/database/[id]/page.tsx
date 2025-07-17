'use client';

import {use, useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle,
  Download,
  Edit,
  FileText,
  Globe,
  Image,
  Loader,
  Music,
  Save,
  Share,
  Tag,
  Trash2,
  Video,
  X
} from 'lucide-react';
import type {FileItem} from '@/services/file-client';
import {fileClient} from '@/services/file-client';
import {cn} from '@/lib/utils';

type FileDetailPageProps = {
  params: Promise<{ id: string }>;
}

export default function FileDetailPage({params}: FileDetailPageProps) {
  const {id} = use(params);
  const t = useTranslations('files');
  const router = useRouter();

  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 获取文件详情
  const fetchFile = async () => {
    try {
      setLoading(true);
      setError(null);
      const fileData = await fileClient.getFile(id);
      setFile(fileData);
      setEditForm({
        title: fileData.title || '',
        content: fileData.content || '',
        tags: fileData.tags || [],
      });
    } catch (error) {
      console.error('Failed to fetch file:', error);
      setError(error instanceof Error ? error.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  // 保存文件
  const saveFile = async () => {
    if (!file) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updatedFile = await fileClient.updateFile(file.id, {
        title: editForm.title,
        content: editForm.content,
        tags: editForm.tags,
      });

      setFile(updatedFile);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save file:', error);
      setError(error instanceof Error ? error.message : 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  // 删除文件
  const deleteFile = async () => {
    if (!file) {
      return;
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await fileClient.deleteFile(file.id);
      router.push('/dashboard/files');
    } catch (error) {
      console.error('Failed to delete file:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete file');
    }
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !editForm.tags.includes(newTag.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 获取文件图标
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <Image className="w-6 h-6"/>;
    }
    if (contentType.startsWith('video/')) {
      return <Video className="w-6 h-6"/>;
    }
    if (contentType.startsWith('audio/')) {
      return <Music className="w-6 h-6"/>;
    }
    if (contentType.includes('pdf') || contentType.includes('document')) {
      return <FileText className="w-6 h-6"/>;
    }
    return <Archive className="w-6 h-6"/>;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化文件大小
  const _formatFileSize = (bytes?: number) => {
    if (!bytes) {
      return 'Unknown';
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / 1024 ** i * 100) / 100} ${sizes[i]}`;
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4"/>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4"/>
          <AlertDescription>{t('fileNotFound')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {getFileIcon(file.content_type)}
          <div>
            <h1 className="text-2xl font-bold">
              {file.title || `File ${file.id.slice(0, 8)}`}
            </h1>
            <p className="text-gray-500">
              {t('lastModified')}
              :
              {new Date(file.updated_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            {t('back')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2"/>
            {t('download')}
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2"/>
            {t('share')}
          </Button>
          {editing
            ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={saveFile} disabled={saving}>
                  {saving
                    ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin"/>
                    )
                    : (
                      <Save className="w-4 h-4 mr-2"/>
                    )}
                  {t('save')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2"/>
                  {t('cancel')}
                </Button>
              </div>
            )
            : (
              <Button size="sm" onClick={() => setEditing(true)}>
                <Edit className="w-4 h-4 mr-2"/>
                {t('edit')}
              </Button>
            )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4"/>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 文件内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 标题 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('fileTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              {editing
                ? (
                  <Input
                    value={editForm.title}
                    onChange={e => setEditForm(prev => ({...prev, title: e.target.value}))}
                    placeholder={t('enterTitle')}
                  />
                )
                : (
                  <p className="text-gray-900">
                    {file.title || t('untitled')}
                  </p>
                )}
            </CardContent>
          </Card>

          {/* 内容 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('content')}</CardTitle>
            </CardHeader>
            <CardContent>
              {editing
                ? (
                  <Textarea
                    value={editForm.content}
                    onChange={e => setEditForm(prev => ({...prev, content: e.target.value}))}
                    placeholder={t('enterContent')}
                    rows={10}
                  />
                )
                : (
                  <div className="prose max-w-none">
                    {file.content
                      ? (
                        <pre className="whitespace-pre-wrap text-sm">
                      {file.content}
                        </pre>
                      )
                      : (
                        <p className="text-gray-500 italic">
                          {t('noContent')}
                        </p>
                      )}
                  </div>
                )}
            </CardContent>
          </Card>

          {/* 标签 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('tags')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editForm.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      {editing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 w-4"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3"/>
                        </Button>
                      )}
                    </Badge>
                  ))}
                  {editForm.tags.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      {t('noTags')}
                    </p>
                  )}
                </div>

                {editing && (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      placeholder={t('addTag')}
                      onKeyPress={e => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} disabled={!newTag.trim()}>
                      {t('add')}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 文件信息 */}
        <div className="space-y-6">
          {/* 状态 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={cn('text-xs', getStatusColor(file.processing_status))}>
                  {file.processing_status}
                </Badge>
                {file.processing_status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-green-500"/>
                )}
                {file.processing_status === 'failed' && (
                  <AlertCircle className="w-4 h-4 text-red-500"/>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 文件信息 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('fileInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500"/>
                <div>
                  <p className="text-sm font-medium">Platform</p>
                  <p className="text-sm text-gray-600">{file.source_platform}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500"/>
                <div>
                  <p className="text-sm font-medium">Content Type</p>
                  <p className="text-sm text-gray-600">{file.content_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500"/>
                <div>
                  <p className="text-sm font-medium">{t('created')}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(file.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500"/>
                <div>
                  <p className="text-sm font-medium">{t('updated')}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(file.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {file.source_id && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500"/>
                  <div>
                    <p className="text-sm font-medium">{t('sourceId')}</p>
                    <p className="text-sm text-gray-600 font-mono">{file.source_id}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 元数据 */}
          {file.metadata && Object.keys(file.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('metadata')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(file.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm font-medium">
{key}
                        :
                      </span>
                      <span className="text-sm text-gray-600">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 危险操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">{t('dangerZone')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={deleteFile}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2"/>
                {t('deleteFile')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
