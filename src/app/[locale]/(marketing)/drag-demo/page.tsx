'use client';

import React from 'react';
import { KnowledgeBase } from '@/components/knowledge/KnowledgeBase';
import { FileInput } from '@/components/ui/file-input';
import type { FileItem } from '@/components/ui/file-input';

export default function DragDemoPage() {
  const [inputValue, setInputValue] = React.useState('');
  const [attachedFiles, setAttachedFiles] = React.useState<FileItem[]>([]);

  const handleInputChange = (value: string, files: FileItem[]) => {
    setInputValue(value);
    setAttachedFiles(files);
    console.log('Input content:', value);
    console.log('Attached files:', files);
  };

  const handleFileSelect = (file: any) => {
    console.log('Selected file from tree:', file);
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">文件拖拽演示</h1>
          <p className="text-gray-600 mb-8">
            从左侧的文件树中拖拽文件到右侧的输入框，文件将显示为可交互的按钮。
            <br />
            绿色按钮表示来自文件树的项目，蓝色按钮表示本地上传的文件。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* 左侧：文件树 */}
          <div className="border rounded-lg bg-white overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">📁 文件浏览器</h2>
              <p className="text-sm text-gray-600">拖拽文件到右侧输入框</p>
            </div>
            <div className="h-full overflow-auto">
              <KnowledgeBase 
                onFileSelect={handleFileSelect}
                onFolderExpand={folder => console.log('Folder expanded:', folder)}
              />
            </div>
          </div>

          {/* 右侧：输入框 */}
          <div className="border rounded-lg bg-white p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">✏️ 文本输入</h2>
              <p className="text-sm text-gray-600 mb-4">
                在此输入文本或拖拽文件。支持：
              </p>
              <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>从左侧文件树拖拽文件</li>
                <li>从系统中拖拽本地文件</li>
                <li>点击文件按钮预览内容</li>
                <li>点击 ✕ 按钮删除文件</li>
              </ul>
            </div>

            <FileInput
              placeholder="在此输入文本或拖拽文件..."
              value={inputValue}
              onChange={handleInputChange}
              className="min-h-32"
            />

            {/* 状态显示 */}
            {(inputValue || attachedFiles.length > 0) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">📊 当前状态</h3>
                
                {inputValue && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">文本内容：</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {inputValue.length}
{' '}
个字符
                    </span>
                  </div>
                )}

                {attachedFiles.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">附件：</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {attachedFiles.length}
{' '}
个文件
                    </span>
                    <ul className="text-xs text-gray-500 mt-1 space-y-1">
                      {attachedFiles.map(file => (
                        <li key={file.id} className="flex items-center gap-2">
                          <span>{file._isTreeItem ? '📋' : '📁'}</span>
                          <span>{file.name}</span>
                          <span className="text-gray-400">
                            (
{Math.round(file.size / 1024)}
{' '}
KB)
                          </span>
                          {file._isTreeItem && (
                            <span className="text-green-600 text-xs">来自文件树</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 文件树中只有文件可以拖拽，文件夹不支持拖拽</li>
            <li>• 拖拽时文件项会显示轻微的阴影效果</li>
            <li>• 来自文件树的文件显示为绿色按钮，带有 📋 图标</li>
            <li>• 本地上传的文件显示为蓝色按钮</li>
            <li>• 点击文件按钮可以预览文件内容（支持图片、文本等格式）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
