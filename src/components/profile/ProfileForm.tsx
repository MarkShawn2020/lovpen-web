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
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Briefcase, Building2, Calendar, CheckCircle, Github, Globe, Linkedin, Loader2, Mail, MapPin, Phone, Twitter, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormData, profileSchema } from '@/validations/auth';
import { AvatarUpload } from './AvatarUpload';
import { fastAPIAuthService } from '@/services/fastapi-auth-v2';
import type {ProfileCompletion} from '@/services/fastapi-auth-v2';

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion | null>(null);

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
      bio: '',
      website: '',
      location: '',
      birthday: '',
      gender: '',
      occupation: '',
      company: '',
      github_username: '',
      twitter_username: '',
      linkedin_url: '',
    },
  });

  const watchedAvatarUrl = user?.avatar_url;

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
        occupation: user.occupation || '',
        company: user.company || '',
        github_username: user.github_username || '',
        twitter_username: user.twitter_username || '',
        linkedin_url: user.linkedin_url || '',
      });
    }
  }, [user, reset]);

  // 获取资料完整度
  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const completion = await fastAPIAuthService.getProfileCompletion();
        setProfileCompletion(completion);
      } catch (error) {
        console.error('Failed to fetch profile completion:', error);
      }
    };

    if (user) {
      fetchProfileCompletion();
    }
  }, [user]);

  // 提交表单
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // 过滤空值
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== null)
      );

      await updateProfile(updateData);
      setSuccess('个人资料更新成功');

      // 重新获取资料完整度
      const completion = await fastAPIAuthService.getProfileCompletion();
      setProfileCompletion(completion);
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = () => {
    // 头像上传通过独立的API处理，这里只需要显示成功消息
    setSuccess('头像更新成功');
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

      {/* 资料完整度 */}
      {profileCompletion && (
        <Card>
          <CardHeader>
            <CardTitle>资料完整度</CardTitle>
            <CardDescription>
              完善您的个人资料以获得更好的体验
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>完整度</span>
                <span>
{Math.round(profileCompletion.completion_percentage)}
%
                </span>
              </div>
              <Progress value={profileCompletion.completion_percentage} className="h-2" />
            </div>
            {profileCompletion.suggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">建议完善：</Label>
                <ul className="text-sm text-gray-600 space-y-1">
                  {profileCompletion.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 头像和基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              基本信息
            </CardTitle>
            <CardDescription>
              管理您的基本个人信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像 */}
            <div className="space-y-2">
              <Label>头像</Label>
              <AvatarUpload
                currentAvatarUrl={watchedAvatarUrl}
                onUpload={handleAvatarUpload}
                disabled={isSubmitting || loading}
              />
            </div>

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

        {/* 职业信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              职业信息
            </CardTitle>
            <CardDescription>
              您的工作和职业相关信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">职业</Label>
                <Input
                  id="occupation"
                  placeholder="请输入您的职业"
                  {...register('occupation')}
                  disabled={isSubmitting || loading}
                />
                {errors.occupation && (
                  <p className="text-sm text-red-500">{errors.occupation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  公司
                </Label>
                <Input
                  id="company"
                  placeholder="请输入您的公司"
                  {...register('company')}
                  disabled={isSubmitting || loading}
                />
                {errors.company && (
                  <p className="text-sm text-red-500">{errors.company.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 在线资料 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              在线资料
            </CardTitle>
            <CardDescription>
              您的网站和社交媒体信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            </div>

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
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_username" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 账户信息 */}
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
            <CardDescription>
              您的账户基本信息（只读）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
