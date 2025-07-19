'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import type { FileItem } from './file-button';

type FilePreviewProps = {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${Math.round(bytes / (1024 * 1024))}MB`;
};

// 文本文件预览组件
const TextFilePreview = ({ file }: { file: FileItem }) => {
  const [content, setContent] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadTextContent = async () => {
      try {
        setLoading(true);
        const text = await file.file.text();
        setContent(text);
      } catch (err) {
        setError('无法读取文件内容');
      } finally {
        setLoading(false);
      }
    };

    loadTextContent();
  }, [file]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-600">正在加载文件内容...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] overflow-auto">
      <pre className="p-4 text-sm whitespace-pre-wrap font-mono">
        {content}
      </pre>
    </div>
  );
};

const FilePreview = ({ file, isOpen, onClose }: FilePreviewProps) => {
  if (!file) {
    return null;
  }

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderPreviewContent = () => {
    const fileType = file.type;

    // 图片预览
    if (fileType.startsWith('image/')) {
      return (
        <div className="max-w-full max-h-[60vh] overflow-auto">
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      );
    }

    // 视频预览
    if (fileType.startsWith('video/')) {
      return (
        <div className="max-w-full max-h-[60vh]">
          <video 
            src={file.url} 
            controls
            className="max-w-full h-auto rounded-lg"
          >
            <track kind="captions" />
            您的浏览器不支持视频播放。
          </video>
        </div>
      );
    }

    // 音频预览
    if (fileType.startsWith('audio/')) {
      return (
        <div className="w-full">
          <audio 
            src={file.url} 
            controls
            className="w-full"
          >
            <track kind="captions" />
            您的浏览器不支持音频播放。
          </audio>
        </div>
      );
    }

    // 文本文件预览
    if (fileType.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      return <TextFilePreview file={file} />;
    }

    // PDF 预览
    if (fileType === 'application/pdf') {
      return (
        <div className="w-full h-[60vh]">
          <iframe
            src={file.url}
            className="w-full h-full rounded-lg"
            title={file.name}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      );
    }

    // 其他文件类型
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-gray-600 mb-2">无法预览此文件类型</p>
        <p className="text-sm text-gray-500">
          文件名: 
{' '}
{file.name}
        </p>
        <p className="text-sm text-gray-500">
          大小: 
{' '}
{formatFileSize(file.size)}
        </p>
        <p className="text-sm text-gray-500">
          类型: 
{' '}
{file.type}
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate mr-4">{file.name}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-auto">
          {renderPreviewContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { FilePreview };
