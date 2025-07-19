'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FileButton } from './file-button';
import type {FileItem} from './file-button';
import { FilePreview } from './file-preview';

type RichFileInputProps = {
  placeholder?: string;
  className?: string;
  onChange?: (content: string, files: FileItem[]) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  value?: string;
}

type EditorContent = {
  type: 'text' | 'file';
  id: string;
  content?: string;
  file?: FileItem;
}

export function RichFileInput({
  placeholder = '输入内容或拖拽文件...',
  className,
  onChange,
  acceptedFileTypes,
  maxFileSize = 10 * 1024 * 1024,
  value = ''
}: RichFileInputProps) {
  const defaultAcceptedFileTypes = ['*'];
  const resolvedAcceptedFileTypes = acceptedFileTypes || defaultAcceptedFileTypes;
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [elements, setElements] = React.useState<EditorContent[]>([
    { type: 'text', id: 'initial', content: value }
  ]);
  const [previewFile, setPreviewFile] = React.useState<FileItem | null>(null);
  const [focusedElementId, setFocusedElementId] = React.useState<string>('initial');
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  // Notify parent of changes
  const notifyChange = React.useCallback(() => {
    const textContent = elements
      .filter(el => el.type === 'text')
      .map(el => el.content)
      .join('');
    
    const files = elements
      .filter(el => el.type === 'file')
      .map(el => el.file!)
      .filter(Boolean);

    onChange?.(textContent, files);
  }, [elements, onChange]);

  // Add file at cursor position
  const addFileAtCursor = (file: File) => {
    const error = validateFile(file);
    if (error) {
      console.error(error);
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

    setElements((prev) => {
      const focusedIndex = prev.findIndex(el => el.id === focusedElementId);
      if (focusedIndex === -1) {
 return prev; 
}

      const focusedElement = prev[focusedIndex];
      if (!focusedElement || focusedElement.type !== 'text') {
 return prev; 
}

      const beforeCursor = focusedElement.content?.slice(0, cursorPosition) || '';
      const afterCursor = focusedElement.content?.slice(cursorPosition) || '';

      const newElements = [...prev];
      
      // Split the text element and insert file
      newElements.splice(
        focusedIndex, 
        1,
        { type: 'text', id: `text-${Date.now()}-1`, content: beforeCursor },
        { type: 'file', id: fileItem.id, file: fileItem },
        { type: 'text', id: `text-${Date.now()}-2`, content: afterCursor }
      );

      return newElements;
    });

    notifyChange();
  };

  // Remove file
  const removeFile = (fileId: string) => {
    setElements((prev) => {
      const newElements = prev.filter(el => el.id !== fileId);
      
      // Merge adjacent text elements
      const merged: EditorContent[] = [];
      for (let i = 0; i < newElements.length; i++) {
        const current = newElements[i];
        const previous = merged[merged.length - 1];
        
        if (current && current.type === 'text' && previous?.type === 'text') {
          // Merge with previous text element
          previous.content = (previous.content || '') + (current.content || '');
        } else if (current) {
          merged.push(current);
        }
      }

      return merged.length > 0 ? merged : [{ type: 'text', id: 'initial', content: '' }];
    });

    // Clean up object URL
    const element = elements.find(el => el.id === fileId);
    if (element?.file?.url) {
      URL.revokeObjectURL(element.file.url);
    }

    notifyChange();
  };

  // Handle text change
  const handleTextChange = (elementId: string, newContent: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, content: newContent }
        : el
    ));
    notifyChange();
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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(addFileAtCursor);
  };

  // Focus tracking
  const handleTextInputFocus = (elementId: string, element: HTMLTextAreaElement) => {
    setFocusedElementId(elementId);
    setCursorPosition(element.selectionStart);
  };

  const handleTextInputSelectionChange = (element: HTMLTextAreaElement) => {
    setCursorPosition(element.selectionStart);
  };

  // Clean up URLs on unmount
  React.useEffect(() => {
    return () => {
      elements.forEach((el) => {
        if (el.file?.url) {
          URL.revokeObjectURL(el.file.url);
        }
      });
    };
  }, [elements]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className={cn(
          "min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          isDragging && "border-primary bg-primary/5",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          {elements.map((element, index) => {
            if (element.type === 'text') {
              return (
                <textarea
                  key={element.id}
                  value={element.content || ''}
                  onChange={e => handleTextChange(element.id, e.target.value)}
                  onFocus={e => handleTextInputFocus(element.id, e.target)}
                  onSelect={e => handleTextInputSelectionChange(e.target as HTMLTextAreaElement)}
                  placeholder={index === 0 && elements.length === 1 ? placeholder : ''}
                  className="w-full resize-none border-0 bg-transparent p-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                  style={{ 
                    minHeight: element.content || index === 0 ? 'auto' : '1.5rem',
                    height: 'auto'
                  }}
                  rows={1}
                  onInput={(e) => {
                    // Auto-resize textarea
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              );
            } else if (element.type === 'file' && element.file) {
              return (
                <div key={element.id} className="inline-block">
                  <FileButton
                    file={element.file}
                    onRemove={removeFile}
                    onPreview={handleFilePreview}
                    size="sm"
                  />
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center">
            <span className="text-primary font-medium">拖拽文件到此处插入</span>
          </div>
        )}
      </div>

      {/* File preview modal */}
      <FilePreview
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
