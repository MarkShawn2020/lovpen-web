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
import { AlertCircle, CheckCircle, Loader2, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormData, profileSchema } from '@/validations/auth';

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
    },
  });

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  // 提交表单
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // 过滤空值
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '')
      );

      await updateProfile(updateData);
      setSuccess('个人资料更新成功');
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              基本信息
            </CardTitle>
            <CardDescription>
              管理您的个人资料信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">姓名</Label>
                <Input
                  id="full_name"
                  placeholder="请输入您的姓名"
                  {...register('full_name')}
                  disabled={isSubmitting || loading}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  {...register('email')}
                  disabled={isSubmitting || loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  手机号
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入您的手机号"
                  {...register('phone')}
                  disabled={isSubmitting || loading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 账户信息 */}
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
            <CardDescription>
              您的账户基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600">用户名</Label>
                <p className="text-sm">{user.username}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600">用户ID</Label>
                <p className="text-sm">{user.id}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600">积分余额</Label>
                <p className="text-sm">{user.credits}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600">账户状态</Label>
                <p className="text-sm">
                  {user.disabled
? (
                    <span className="text-red-600">已禁用</span>
                  )
: (
                    <span className="text-green-600">正常</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600">管理员</Label>
                <p className="text-sm">
                  {user.is_admin
? (
                    <span className="text-blue-600">是</span>
                  )
: (
                    <span className="text-gray-600">否</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-600">创建时间</Label>
                <p className="text-sm">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              '保存资料'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
