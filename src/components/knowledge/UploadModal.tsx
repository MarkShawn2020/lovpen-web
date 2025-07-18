'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '@/components/lovpen-ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Progress} from '@/components/ui/progress';
import type {FileItem} from '@/services/file-client-v2';
import {fileClientV2} from '@/services/file-client-v2';
import {fastAPIAuthService} from '@/services/fastapi-auth-v2';
import type {AuthState} from '@/services/fastapi-auth-v2';
import type {SupportedPlatform} from '@/types/knowledge-base';
import {PLATFORM_CONFIGS} from '@/types/knowledge-base';

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (items: FileItem[]) => void;
}

type FileUploadProgress = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  result?: FileItem;
}

export function UploadModal({isOpen, onClose, onUploadComplete}: UploadModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedPlatform>('manual');
  const [files, setFiles] = useState<FileUploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    loading: true,
    error: null,
  });

  const platformConfig = PLATFORM_CONFIGS[selectedPlatform];

  // 订阅认证状态
  useEffect(() => {
    const unsubscribe = fastAPIAuthService.subscribe(setAuthState);
    return () => {
      unsubscribe();
    };
  }, []);

  const resetModal = () => {
    setFiles([]);
    setIsDragging(false);
    setIsUploading(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUploading) {
      resetModal();
      onClose();
    }
  };

  const validateFile = (file: File): string | null => {
    // 检查文件类型
    const config = PLATFORM_CONFIGS[selectedPlatform];
    const supportedTypes = config.supportedContentTypes;

    // 简单的文件类型检测
    const fileType = file.type;
    let contentType: string | null = null;

    if (fileType.startsWith('text/')) {
      contentType = 'text';
    } else if (fileType.startsWith('image/')) {
      contentType = 'image';
    } else if (fileType.startsWith('audio/')) {
      contentType = 'audio';
    } else if (fileType.startsWith('video/')) {
      contentType = 'video';
    } else if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('word')) {
      contentType = 'document';
    } else {
      // 根据文件扩展名判断
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext) {
        if (['txt', 'md', 'markdown'].includes(ext)) {
          contentType = 'text';
        } else if (['pdf', 'doc', 'docx'].includes(ext)) {
          contentType = 'document';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
          contentType = 'image';
        } else if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext)) {
          contentType = 'audio';
        } else if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) {
          contentType = 'video';
        }
      }
    }

    if (!contentType || !supportedTypes.includes(contentType as any)) {
      return `此平台不支持 ${file.name} 文件类型`;
    }

    // 检查文件大小 (最大 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return `文件 ${file.name} 过大，最大支持 100MB`;
    }

    return null;
  };

  const handleFileSelect = (newFiles: File[]) => {
    const validFiles: FileUploadProgress[] = [];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        // 显示错误，但不阻止其他文件
        console.error(error);
        continue;
      }

      validFiles.push({
        file,
        progress: 0,
        status: 'pending',
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, [selectedPlatform]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const selectedFiles = Array.from(e.target.files || []);
    handleFileSelect(selectedFiles);
  };

  const removeFile = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isUploading) {
      return;
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (files.length === 0) {
      return;
    }

    if (!authState.user) {
      return;
    }

    setIsUploading(true);
    const uploadedItems: FileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileProgress = files[i];

      if (!fileProgress || fileProgress.status === 'completed') {
        continue;
      }

      try {
        // 更新状态为上传中
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? {...f, status: 'uploading' as const, progress: 0} : f
        ));

        // 上传文件
        const result = await fileClientV2.uploadFile(fileProgress.file);

        // 更新状态为完成
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? {...f, status: 'completed' as const, progress: 100, result} : f
        ));

        uploadedItems.push(result);
      } catch (error) {
        // 更新状态为失败
        setFiles(prev => prev.map((f, idx) =>
          idx === i
            ? {
              ...f,
              status: 'failed' as const,
              error: error instanceof Error ? error.message : '上传失败'
            }
            : f
        ));
      }
    }

    setIsUploading(false);

    if (uploadedItems.length > 0) {
      onUploadComplete(uploadedItems);
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

  const getStatusIcon = (status: FileUploadProgress['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'uploading':
        return '📤';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const availablePlatforms = Object.values(PLATFORM_CONFIGS).filter(config =>
    config.isAvailable && (config.authType === 'manual' || config.authType === 'file-upload')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ➕ 上传文件
          </DialogTitle>
        </DialogHeader>

        {!authState.user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <span>⚠️</span>
              <span className="text-sm">请先登录以上传文件</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* 平台选择 */}
          <div>
            <fieldset>
              <legend className="block text-sm font-medium mb-2">选择平台</legend>
              <div className="grid grid-cols-2 gap-2">
                {availablePlatforms.map(platform => (
                  <button
                    key={platform.id}
                    type="button"
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedPlatform === platform.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlatform(platform.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platform.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{platform.name}</div>
                        <div className="text-xs text-gray-500">{platform.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* 文件上传区域 */}
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium mb-2">选择文件</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-600 mb-2">
                拖拽文件到此处或
                {' '}
                <span className="text-primary cursor-pointer">点击选择</span>
              </p>
              <p className="text-xs text-gray-500">
                支持类型:
                {' '}
                {platformConfig.supportedContentTypes.join(', ')}
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileInputChange}
                accept={platformConfig.supportedContentTypes.map((type) => {
                  switch (type) {
                    case 'text':
                      return '.txt,.md';
                    case 'document':
                      return '.pdf,.doc,.docx';
                    case 'image':
                      return '.jpg,.jpeg,.png,.gif,.webp';
                    case 'audio':
                      return '.mp3,.wav,.m4a,.ogg';
                    case 'video':
                      return '.mp4,.avi,.mov,.mkv';
                    default:
                      return '';
                  }
                }).join(',')}
              />
            </div>
          </div>

          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {files.map((fileProgress, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">{getStatusIcon(fileProgress.status)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">
                          {fileProgress.file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(fileProgress.file.size)}
                        </span>
                      </div>

                      {fileProgress.status === 'uploading' && (
                        <Progress value={fileProgress.progress} className="mt-1"/>
                      )}

                      {fileProgress.error && (
                        <div className="text-xs text-red-600 mt-1">
                          {fileProgress.error}
                        </div>
                      )}
                    </div>

                    {!isUploading && fileProgress.status === 'pending' && (
                      <button
                        type="button"
                        onClick={e => removeFile(index, e)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel} 
            disabled={isUploading}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={uploadFiles}
            disabled={files.length === 0 || isUploading || !authState.user}
            className="flex items-center gap-2"
          >
            {isUploading
              ? (
                <>
                  <span className="animate-spin">⟳</span>
                  上传中...
                </>
              )
              : (
                <>
                  📤 上传 (
                  {files.length}
                  )
                </>
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
