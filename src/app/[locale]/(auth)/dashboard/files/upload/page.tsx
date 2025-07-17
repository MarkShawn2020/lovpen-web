'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Archive,
  CheckCircle,
  FileText,
  Image,
  Loader,
  Music,
  Upload,
  Video,
  X
} from 'lucide-react';
import { fileClient } from '@/services/file-client';
import { cn } from '@/lib/utils';

type UploadFile = {
  id: string;
  file: File;
  title?: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

export default function UploadPage() {
  const t = useTranslations('files');
  const router = useRouter();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 添加文件到列表
  const addFiles = useCallback((files: File[]) => {
    const newUploadFiles = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      title: file.name,
      status: 'pending' as const,
      progress: 0,
    }));

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
  }, []);

  // 拖拽处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, [addFiles]);

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  // 删除文件
  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  // 更新文件标题
  const updateFileTitle = (id: string, title: string) => {
    setUploadFiles(prev => prev.map(f =>
      f.id === id ? { ...f, title } : f
    ));
  };

  // 获取文件图标
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
 return <Image className="w-5 h-5" />;
}
    if (type.startsWith('video/')) {
 return <Video className="w-5 h-5" />;
}
    if (type.startsWith('audio/')) {
 return <Music className="w-5 h-5" />;
}
    if (type.includes('pdf') || type.includes('document')) {
 return <FileText className="w-5 h-5" />;
}
    return <Archive className="w-5 h-5" />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
 return '0 Bytes';
}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  // 上传文件
  const uploadFile = async (uploadFile: UploadFile) => {
    try {
      setUploadFiles(prev => prev.map(f =>
        f.id === uploadFile.id
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadFiles(prev => prev.map(f =>
          f.id === uploadFile.id && f.status === 'uploading'
            ? { ...f, progress: Math.min(f.progress + 10, 90) }
            : f
        ));
      }, 100);

      const result = await fileClient.uploadFile(uploadFile.file, uploadFile.title);

      clearInterval(progressInterval);

      setUploadFiles(prev => prev.map(f =>
        f.id === uploadFile.id
          ? { ...f, status: 'completed', progress: 100 }
          : f
      ));

      return result;
    } catch (error) {
      setUploadFiles(prev => prev.map(f =>
        f.id === uploadFile.id
          ? {
              ...f,
              status: 'failed',
              progress: 0,
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : f
      ));
      throw error;
    }
  };

  // 上传所有文件
  const uploadAllFiles = async () => {
    if (uploadFiles.length === 0) {
 return;
}

    setIsUploading(true);

    try {
      const pendingFiles = uploadFiles.filter(f => f.status === 'pending');

      // 并发上传文件
      const uploadPromises = pendingFiles.map(uploadFile);
      await Promise.allSettled(uploadPromises);

      // 检查是否所有文件都上传成功
      const allSuccess = uploadFiles.every(f => f.status === 'completed');

      if (allSuccess) {
        setTimeout(() => {
          router.push('/dashboard/files');
        }, 1000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const pendingFiles = uploadFiles.filter(f => f.status === 'pending');
  const completedFiles = uploadFiles.filter(f => f.status === 'completed');
  const failedFiles = uploadFiles.filter(f => f.status === 'failed');

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('uploadFiles')}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          {t('back')}
        </Button>
      </div>

      {/* 拖拽上传区域 */}
      <Card>
        <CardContent className="p-8">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
              "hover:border-gray-400"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t('dropFiles')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('supportedFormats')}
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.json,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.mov"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                {t('selectFiles')}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 文件列表 */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('selectedFiles')}</CardTitle>
              <Button
                onClick={uploadAllFiles}
                disabled={isUploading || pendingFiles.length === 0}
              >
                {isUploading
? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                )
: (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {t('uploadAll')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadFiles.map(uploadFile => (
                <div key={uploadFile.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getFileIcon(uploadFile.file.type)}
                      <div>
                        <p className="font-medium">{uploadFile.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadFile.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {uploadFile.status === 'failed' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {uploadFile.status === 'uploading' && (
                        <Loader className="w-5 h-5 animate-spin text-blue-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        disabled={uploadFile.status === 'uploading'}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {uploadFile.status === 'pending' && (
                    <div className="space-y-2">
                      <Label htmlFor={`title-${uploadFile.id}`}>
                        {t('fileTitle')}
                      </Label>
                      <Input
                        id={`title-${uploadFile.id}`}
                        value={uploadFile.title || ''}
                        onChange={e => updateFileTitle(uploadFile.id, e.target.value)}
                        placeholder={t('enterTitle')}
                      />
                    </div>
                  )}

                  {uploadFile.status === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('uploading')}</span>
                        <span>
{uploadFile.progress}
%
                        </span>
                      </div>
                      <Progress value={uploadFile.progress} />
                    </div>
                  )}

                  {uploadFile.status === 'failed' && uploadFile.error && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{uploadFile.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 上传统计 */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{uploadFiles.length}</Badge>
                <span>{t('totalFiles')}</span>
              </div>
              {completedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {completedFiles.length}
                  </Badge>
                  <span>{t('completed')}</span>
                </div>
              )}
              {failedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {failedFiles.length}
                  </Badge>
                  <span>{t('failed')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
