'use client';

import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useAuth } from '@/contexts/AuthContext';
import { setWaitlistAppliedAtom, waitlistStatusAtom } from '@/stores/waitlist';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';

type WaitlistModalProps = {
  children: React.ReactNode;
  source?: string; // 追踪来源，如 'hero', 'pricing', 'about'
}

export function WaitlistModal({ children, source = 'unknown' }: WaitlistModalProps) {
  const { isAuthenticated, user } = useAuth();
  const waitlistStatus = useAtomValue(waitlistStatusAtom);
  const [, setWaitlistApplied] = useAtom(setWaitlistAppliedAtom);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState(() => ({
    email: user?.email || '',
    name: user?.full_name || '',
    company: '',
    useCase: '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source,
          isAuthenticated,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        // 保存申请状态到本地存储
        setWaitlistApplied({ email: formData.email });
        setIsSuccess(true);
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      // eslint-disable-next-line no-alert
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetModal = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setIsSubmitting(false);
  };

  // 如果用户已经申请过，显示已申请状态
  const hasAlreadyApplied = waitlistStatus.hasApplied;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            {hasAlreadyApplied 
              ? '✅ 已申请试用'
              : isSuccess 
                ? '🎉 申请成功!' 
                : '申请试用 LovPen'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {hasAlreadyApplied
              ? `您已使用邮箱 ${waitlistStatus.email} 申请试用，我们会在产品准备就绪时通知您。`
              : isSuccess
                ? '感谢您的关注！我们会在产品准备就绪时第一时间通知您。'
                : '我们正在完善产品功能，请留下您的信息，我们会在开放使用时优先邀请您体验。'}
          </DialogDescription>
        </DialogHeader>

        {hasAlreadyApplied
          ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-sm text-gray-600 text-center">
              申请时间：
{waitlistStatus.appliedAt && new Date(waitlistStatus.appliedAt).toLocaleDateString('zh-CN')}
            </p>
            <Button onClick={resetModal} className="w-full">
              继续浏览
            </Button>
          </div>
          )
          : isSuccess
            ? (
            <div className="flex flex-col items-center space-y-4 py-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-sm text-gray-600 text-center">
                {formData.email && `确认邮件已发送至 ${formData.email}`}
              </p>
              <Button onClick={resetModal} className="w-full">
                继续浏览
              </Button>
            </div>
            )
            : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址 *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required
                disabled={isAuthenticated} // 已登录用户不可修改邮箱
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                placeholder="您的姓名"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">公司/机构（可选）</Label>
              <Input
                id="company"
                placeholder="您的公司或机构"
                value={formData.company}
                onChange={e => handleInputChange('company', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">预期使用场景（可选）</Label>
              <Textarea
                id="useCase"
                placeholder="您计划如何使用 LovPen？例如：写作博客、制作公众号内容、企业营销等"
                value={formData.useCase}
                onChange={e => handleInputChange('useCase', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.email}
                className="flex-1"
              >
                {isSubmitting ? '提交中...' : '申请试用'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
