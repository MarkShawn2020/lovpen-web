'use client';

import { FileInput } from '@/components/ui/file-input';
import type { FileItem } from '@/components/ui/file-input';

export default function FileInputDemoPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">文件输入组件演示</h1>
          <p className="text-gray-600 mb-8">
            拖拽文件到输入框中，文件将显示为可交互的按钮。点击文件名预览，点击 ✕ 删除文件。
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">基础文件输入</h2>
            <FileInputDemo />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">限制文件类型（仅图片）</h2>
            <FileInputDemo acceptedFileTypes={['image/']} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">隐藏文件列表</h2>
            <FileInputDemo showFileList={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultAcceptedFileTypes = ['*'];

function FileInputDemo({ 
  acceptedFileTypes = defaultAcceptedFileTypes, 
  showFileList = true 
}: { 
  acceptedFileTypes?: string[];
  showFileList?: boolean;
}) {
  const handleChange = (value: string, files: FileItem[]) => {
    console.log('Content:', value);
    console.log('Files:', files);
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <FileInput
        placeholder="在此输入文本或拖拽文件..."
        onChange={handleChange}
        acceptedFileTypes={acceptedFileTypes}
        maxFileSize={5 * 1024 * 1024} // 5MB
        showFileList={showFileList}
      />
    </div>
  );
}
