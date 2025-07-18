'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, CheckCircle, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarUpload } from '../AvatarUpload';
import { z } from 'zod';

const generalInfoSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')),
  phone: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
});

type GeneralInfoData = z.infer<typeof generalInfoSchema>;

export function ProfileGeneralView() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GeneralInfoData>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      birthday: '',
      gender: '',
    },
  });

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
      });
    }
  }, [user, reset]);

  // 提交表单
  const onSubmit = async (data: GeneralInfoData) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // 过滤空值
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== null)
      );

      await updateProfile(updateData);
      setSuccess('基本信息更新成功');
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = () => {
    setSuccess('头像更新成功');
  };

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
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              头像设置
            </CardTitle>
            <CardDescription>
              上传或更改您的个人头像
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              currentAvatarUrl={user?.avatar_url}
              onUpload={handleAvatarUpload}
              disabled={isSubmitting || loading}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              设置您的个人基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="birthday" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  生日
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  {...register('birthday')}
                  disabled={isSubmitting || loading}
                />
                {errors.birthday && (
                  <p className="text-sm text-red-500">{errors.birthday.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <Input
                  id="gender"
                  placeholder="请输入性别"
                  {...register('gender')}
                  disabled={isSubmitting || loading}
                />
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  所在地
                </Label>
                <Input
                  id="location"
                  placeholder="请输入您的所在地"
                  {...register('location')}
                  disabled={isSubmitting || loading}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <Textarea
                id="bio"
                placeholder="介绍一下您自己..."
                rows={4}
                {...register('bio')}
                disabled={isSubmitting || loading}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
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
              '保存信息'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
