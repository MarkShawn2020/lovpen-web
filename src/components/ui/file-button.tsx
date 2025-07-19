'use client';

import * as React from 'react';
import { Eye, File, FileText, Image, Music, Video, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FileItem = {
  id: string;
  name: string;
  file: File;
  url?: string;
  type: string;
  size: number;
  // Optional metadata for file tree items
  _isTreeItem?: boolean;
  _treeData?: any;
}

type FileButtonProps = {
  file: FileItem;
  onRemove?: (id: string) => void;
  onPreview?: (file: FileItem) => void;
  className?: string;
  showRemove?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getFileIcon = (fileType: string, fileName: string) => {
  if (fileType.startsWith('image/')) {
    return <Image className="w-4 h-4" />;
  }
  if (fileType.startsWith('video/')) {
    return <Video className="w-4 h-4" />;
  }
  if (fileType.startsWith('audio/')) {
    return <Music className="w-4 h-4" />;
  }
  if (fileType.includes('text') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return <FileText className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${Math.round(bytes / (1024 * 1024))}MB`;
};

export function FileButton({ 
  file, 
  onRemove, 
  onPreview, 
  className,
  showRemove = true,
  size = 'md'
}: FileButtonProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-md border transition-colors group",
      file._isTreeItem 
        ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
        : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
      sizeClasses[size],
      className
    )}
    >
      {/* File icon */}
      <div className={iconSizes[size]}>
        {getFileIcon(file.type, file.name)}
      </div>
      
      {/* File info - clickable for preview */}
      <button
        type="button"
        className="flex-1 min-w-0 cursor-pointer bg-transparent border-none p-0 text-left"
        onClick={() => onPreview?.(file)}
      >
        <span className="font-medium truncate block max-w-32">
          {file.name}
        </span>
        <span className={cn(
          "text-xs",
          file._isTreeItem ? "text-green-600" : "text-blue-500"
        )}
        >
          {formatFileSize(file.size)}
          {file._isTreeItem && (
            <span className="ml-1" title="来自文件树">📋</span>
          )}
        </span>
      </button>

      {/* Preview button */}
      {onPreview && (
        <button
          type="button"
          onClick={() => onPreview(file)}
          className={cn(
            "opacity-0 group-hover:opacity-100 hover:bg-blue-200 rounded p-1 transition-all",
            iconSizes[size]
          )}
          title="预览文件"
        >
          <Eye className={iconSizes[size]} />
        </button>
      )}

      {/* Remove button */}
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className={cn(
            "opacity-0 group-hover:opacity-100 hover:bg-red-200 text-red-600 rounded p-1 transition-all",
            iconSizes[size]
          )}
          title="移除文件"
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
}
