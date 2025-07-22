'use client';

import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { waitlistStatusAtom } from '@/stores/waitlist';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';

type WaitlistStatusModalProps = {
  children: React.ReactNode;
}

export function WaitlistStatusModal({ children }: WaitlistStatusModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const waitlistStatus = useAtomValue(waitlistStatusAtom);

  const getTierInfo = (tier?: string) => {
    switch (tier) {
      case 'priority':
        return {
          name: '优先处理',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '🎉'
        };
      case 'regular':
        return {
          name: '常规处理',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: '✅'
        };
      case 'extended':
        return {
          name: '排队等待',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: '📝'
        };
      default:
        return {
          name: '处理中',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '⏳'
        };
    }
  };

  const tierInfo = getTierInfo(waitlistStatus.tier);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            申请状态
          </DialogTitle>
          <DialogDescription className="text-center">
            查看您的试用申请详情和排队状态
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 申请状态 */}
          <div className={`p-4 rounded-lg border ${tierInfo.bgColor} ${tierInfo.borderColor}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">{tierInfo.icon}</span>
              <span className={`font-semibold ${tierInfo.color}`}>
                {tierInfo.name}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              您的申请已成功提交，我们会按顺序处理所有申请
            </p>
          </div>

          {/* 详细信息 */}
          <div className="space-y-3">
            {/* 邮箱 */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">@</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">申请邮箱</p>
                <p className="text-sm text-gray-600">{waitlistStatus.email}</p>
              </div>
            </div>

            {/* 排队位置 */}
            {waitlistStatus.position && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">排队位置</p>
                  <p className="text-sm text-gray-600">
第
{waitlistStatus.position}
{' '}
位
                  </p>
                </div>
              </div>
            )}

            {/* 预计时间 */}
            {waitlistStatus.estimatedWeeks && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">预计等待</p>
                  <p className="text-sm text-gray-600">
{waitlistStatus.estimatedWeeks}
{' '}
周内
                  </p>
                </div>
              </div>
            )}

            {/* 申请时间 */}
            {waitlistStatus.appliedAt && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">申请时间</p>
                  <p className="text-sm text-gray-600">
                    {new Date(waitlistStatus.appliedAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 提示信息 */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 我们会在产品准备就绪时第一时间通过邮件通知您，请保持邮箱畅通。
            </p>
          </div>

          {/* 关闭按钮 */}
          <Button 
            onClick={() => setIsOpen(false)} 
            className="w-full"
          >
            知道了
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
