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
import { AlertCircle, Briefcase, Building2, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const professionalInfoSchema = z.object({
  occupation: z.string().optional(),
  company: z.string().optional(),
});

type ProfessionalInfoData = z.infer<typeof professionalInfoSchema>;

export function ProfileProfessionalView() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfessionalInfoData>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      occupation: '',
      company: '',
    },
  });

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      reset({
        occupation: user.occupation || '',
        company: user.company || '',
      });
    }
  }, [user, reset]);

  // 提交表单
  const onSubmit = async (data: ProfessionalInfoData) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      // 过滤空值
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '' && value !== null)
      );

      await updateProfile(updateData);
      setSuccess('职业信息更新成功');
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : '更新失败，请重试');
    } finally {
      setLoading(false);
    }
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              职业信息
            </CardTitle>
            <CardDescription>
              管理您的工作和职业相关信息，帮助他人更好地了解您的专业背景
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="occupation" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  职业/职位
                </Label>
                <Input
                  id="occupation"
                  placeholder="例如：软件工程师、产品经理、设计师"
                  {...register('occupation')}
                  disabled={isSubmitting || loading}
                />
                {errors.occupation && (
                  <p className="text-sm text-red-500">{errors.occupation.message}</p>
                )}
                <p className="text-xs text-text-faded">
                  请输入您当前的职业或职位名称
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  公司/组织
                </Label>
                <Input
                  id="company"
                  placeholder="例如：Google、阿里巴巴、自由职业"
                  {...register('company')}
                  disabled={isSubmitting || loading}
                />
                {errors.company && (
                  <p className="text-sm text-red-500">{errors.company.message}</p>
                )}
                <p className="text-xs text-text-faded">
                  请输入您目前工作的公司或组织名称
                </p>
              </div>
            </div>

            {/* Career Tips */}
            <div className="bg-background-ivory-medium rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-main mb-2">💡 职业信息建议</h4>
              <ul className="text-sm text-text-faded space-y-1">
                <li>• 填写准确的职业信息有助于建立专业形象</li>
                <li>• 可以帮助系统为您推荐更相关的内容</li>
                <li>• 便于与同行建立联系和交流</li>
              </ul>
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
              '保存职业信息'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
