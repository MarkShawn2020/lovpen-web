'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, ExternalLink, Github, Globe, Linkedin, Loader2, Twitter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const onlineInfoSchema = z.object({
  website: z.string().url('请输入有效的网址').optional().or(z.literal('')),
  github_username: z.string().optional(),
  twitter_username: z.string().optional(),
  linkedin_url: z.string().url('请输入有效的LinkedIn网址').optional().or(z.literal('')),
});

type OnlineInfoData = z.infer<typeof onlineInfoSchema>;

export function ProfileOnlineView() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<OnlineInfoData>({
    resolver: zodResolver(onlineInfoSchema),
    defaultValues: {
      website: '',
      github_username: '',
      twitter_username: '',
      linkedin_url: '',
    },
  });

  const watchedValues = watch();

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      reset({
        website: user.website || '',
        github_username: user.github_username || '',
        twitter_username: user.twitter_username || '',
        linkedin_url: user.linkedin_url || '',
      });
    }
  }, [user, reset]);

  // 提交表单
  const onSubmit = async (data: OnlineInfoData) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // 过滤空值
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== null)
      );

      await updateProfile(updateData);
      setSuccess('在线资料更新成功');
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewLinks = () => {
    const links = [];
    
    if (watchedValues.website) {
      links.push({
        label: '个人网站',
        url: watchedValues.website,
        icon: Globe,
      });
    }
    
    if (watchedValues.github_username) {
      links.push({
        label: 'GitHub',
        url: `https://github.com/${watchedValues.github_username}`,
        icon: Github,
      });
    }
    
    if (watchedValues.twitter_username) {
      links.push({
        label: 'Twitter',
        url: `https://twitter.com/${watchedValues.twitter_username}`,
        icon: Twitter,
      });
    }
    
    if (watchedValues.linkedin_url) {
      links.push({
        label: 'LinkedIn',
        url: watchedValues.linkedin_url,
        icon: Linkedin,
      });
    }
    
    return links;
  };

  const previewLinks = getPreviewLinks();

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              在线资料
            </CardTitle>
            <CardDescription>
              配置您的网站和社交媒体链接，让他人更容易找到和联系您
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                个人网站
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                {...register('website')}
                disabled={isSubmitting || loading}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
              <p className="text-xs text-text-faded">
                请输入完整的网址，包含 http:// 或 https://
              </p>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github_username" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </Label>
                <Input
                  id="github_username"
                  placeholder="用户名"
                  {...register('github_username')}
                  disabled={isSubmitting || loading}
                />
                {errors.github_username && (
                  <p className="text-sm text-red-500">{errors.github_username.message}</p>
                )}
                <p className="text-xs text-text-faded">
                  只需输入用户名，不包含 @
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_username" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter/X
                </Label>
                <Input
                  id="twitter_username"
                  placeholder="用户名"
                  {...register('twitter_username')}
                  disabled={isSubmitting || loading}
                />
                {errors.twitter_username && (
                  <p className="text-sm text-red-500">{errors.twitter_username.message}</p>
                )}
                <p className="text-xs text-text-faded">
                  只需输入用户名，不包含 @
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  {...register('linkedin_url')}
                  disabled={isSubmitting || loading}
                />
                {errors.linkedin_url && (
                  <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>
                )}
                <p className="text-xs text-text-faded">
                  请输入完整的 LinkedIn 个人资料链接
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Links */}
        {previewLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>链接预览</CardTitle>
              <CardDescription>
                以下是您配置的在线资料链接预览
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previewLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <div
                      key={link.label}
                      className="flex items-center justify-between p-3 bg-background-ivory-medium rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4 text-text-faded" />
                        <span className="font-medium text-text-main">{link.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-faded truncate max-w-xs">
                          {link.url}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy Notice */}
        <div className="bg-background-ivory-medium rounded-lg p-4">
          <h4 className="text-sm font-medium text-text-main mb-2">🔒 隐私提醒</h4>
          <p className="text-sm text-text-faded">
            您的在线资料信息将对其他用户可见。请确保您愿意公开分享这些链接。
            您可以随时修改或删除这些信息。
          </p>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="min-w-[120px]"
          >
            {(isSubmitting || loading)
? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            )
: (
              '保存在线资料'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
