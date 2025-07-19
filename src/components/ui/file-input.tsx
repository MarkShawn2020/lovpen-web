'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FileButton } from './file-button';
import type {FileItem} from './file-button';
import { FilePreview } from './file-preview';

type FileInputProps = {
  value?: string;
  onChange?: (value: string, files: FileItem[]) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  showFileList?: boolean;
} & Omit<React.ComponentProps<'textarea'>, 'value' | 'onChange'>

export function FileInput({ 
  className, 
  value = '', 
  onChange,
  acceptedFileTypes,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  showFileList = true,
  ...props 
}: FileInputProps) {
  const defaultAcceptedFileTypes = ['*'];
  const resolvedAcceptedFileTypes = acceptedFileTypes || defaultAcceptedFileTypes;
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [textValue, setTextValue] = React.useState(value);
  const [previewFile, setPreviewFile] = React.useState<FileItem | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Handle text changes
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    onChange?.(newValue, files);
  };

  // File validation
  const validateFile = (file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize) {
      return `文件大小超过限制 (${Math.round(maxFileSize / 1024 / 1024)}MB)`;
    }
    
    if (resolvedAcceptedFileTypes.length > 0 && !resolvedAcceptedFileTypes.includes('*')) {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const isAccepted = resolvedAcceptedFileTypes.some(type => 
        type === '*' 
        || type.includes(fileExt || '') 
        || file.type.includes(type)
      );
      if (!isAccepted) {
        return `不支持的文件类型: ${file.name}`;
      }
    }
    
    return null;
  };

  // Add file from File object
  const addFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      console.error(error);
      return;
    }

    // Check if file already exists
    if (files.some(f => f.name === file.name && f.size === file.size)) {
      console.warn('文件已存在');
      return;
    }

    const fileItem: FileItem = {
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size
    };

    const newFiles = [...files, fileItem];
    setFiles(newFiles);
    onChange?.(textValue, newFiles);
  };

  // Add file from file tree item
  const addFileTreeItem = (treeNodeData: any) => {
    // Check if file already exists
    if (files.some(f => f.id === treeNodeData.node.id)) {
      console.warn('文件已存在');
      return;
    }

    // Create a virtual File object for file tree items
    const virtualFile = new File([], treeNodeData.node.name, {
      type: treeNodeData.node.contentType
    });

    const fileItem: FileItem = {
      id: treeNodeData.node.id,
      name: treeNodeData.node.name,
      file: virtualFile,
      type: treeNodeData.node.contentType,
      size: treeNodeData.node.size,
      // Add metadata to distinguish from real files
      _isTreeItem: true,
      _treeData: treeNodeData.node
    };

    const newFiles = [...files, fileItem];
    setFiles(newFiles);
    onChange?.(textValue, newFiles);
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    onChange?.(textValue, newFiles);

    // Clean up object URL
    const removedFile = files.find(f => f.id === fileId);
    if (removedFile?.url) {
      URL.revokeObjectURL(removedFile.url);
    }
  };

  // Preview file
  const handleFilePreview = (file: FileItem) => {
    setPreviewFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set isDragging to false if we're leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Check for file tree item data first
    const jsonData = e.dataTransfer.getData('application/json');
    if (jsonData) {
      try {
        const dragData = JSON.parse(jsonData);
        if (dragData.type === 'file-tree-item') {
          addFileTreeItem(dragData);
          return;
        }
      } catch (error) {
        console.error('Failed to parse drag data:', error);
      }
    }

    // Handle regular file drops
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(addFile);
  };

  // Clean up URLs on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={textValue}
          onChange={handleTextareaChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-slot="textarea"
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isDragging && "border-primary bg-primary/5",
            className
          )}
          {...props}
        />
        
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center">
            <span className="text-primary font-medium">拖拽文件到此处添加</span>
          </div>
        )}
      </div>

      {/* File list */}
      {showFileList && files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
附件 (
{files.length}
)
          </div>
          <div className="flex flex-wrap gap-2">
            {files.map(file => (
              <FileButton
                key={file.id}
                file={file}
                onRemove={removeFile}
                onPreview={handleFilePreview}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* File preview modal */}
      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}

export type { FileItem };
