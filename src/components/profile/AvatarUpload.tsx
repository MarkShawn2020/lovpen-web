'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fastAPIAuthService } from '@/services/fastapi-auth-v2';

type AvatarUploadProps = {
  currentAvatarUrl?: string | null;
  onUpload: (url: string) => void;
  disabled?: boolean;
};

export function AvatarUpload({ currentAvatarUrl, onUpload, disabled }: AvatarUploadProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // 上传文件到服务器
      const uploadResult = await fastAPIAuthService.uploadAvatarFile(file);
      
      // 更新用户头像
      await fastAPIAuthService.updateAvatar({
        avatar_file_id: uploadResult.file_id,
        avatar_url: uploadResult.url,
      });

      onUpload(uploadResult.url);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
 return; 
}

    // 重置错误状态
    setError(null);

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('文件类型不支持，请上传 JPEG、PNG、GIF 或 WebP 格式的图片');
      return;
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('文件大小不能超过 5MB');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传文件
    uploadFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    try {
      setUploading(true);
      setError(null);

      // 移除头像
      await fastAPIAuthService.updateAvatar({
        avatar_url: null,
        avatar_file_id: null,
      });

      onUpload('');
      setPreview(null);
    } catch (error) {
      console.error('Remove avatar error:', error);
      setError(error instanceof Error ? error.message : '移除头像失败');
    } finally {
      setUploading(false);
    }
  };

  const displayAvatarUrl = preview || currentAvatarUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {/* 头像显示 */}
        <Avatar className="h-20 w-20">
          {displayAvatarUrl
? (
            <AvatarImage src={displayAvatarUrl} alt="头像" />
          )
: (
            <AvatarFallback className="text-lg">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>

        {/* 操作按钮 */}
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={disabled || uploading}
          >
            {uploading
? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                上传中...
              </>
            )
: (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {displayAvatarUrl ? '更换头像' : '上传头像'}
              </>
            )}
          </Button>

          {displayAvatarUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || uploading}
            >
              <X className="mr-2 h-4 w-4" />
              移除头像
            </Button>
          )}
        </div>
      </div>

      {/* 文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 帮助文本 */}
      <p className="text-sm text-gray-500">
        支持 JPEG、PNG、GIF、WebP 格式，文件大小不超过 5MB
      </p>
    </div>
  );
}
