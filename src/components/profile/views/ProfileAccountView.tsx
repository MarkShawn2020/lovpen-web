'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Copy, 
  CreditCard, 
  Eye,
  EyeOff,
  Info,
  Settings,
  Shield,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function ProfileAccountView() {
  const { user } = useAuth();
  const [showUserId, setShowUserId] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '未知';
    }
  };

  const getAccountStatus = () => {
    if (!user) {
 return { label: '未知', variant: 'secondary' as const, icon: Info }; 
}
    
    if (user.disabled) {
      return { 
        label: '已禁用', 
        variant: 'destructive' as const, 
        icon: AlertTriangle,
        description: '您的账户已被禁用，请联系管理员'
      };
    }
    
    return { 
      label: '正常', 
      variant: 'default' as const, 
      icon: CheckCircle,
      description: '您的账户状态正常'
    };
  };

  const accountStatus = getAccountStatus();
  const StatusIcon = accountStatus.icon;

  if (!user) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-text-faded">加载账户信息中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            账户状态
          </CardTitle>
          <CardDescription>
            您的账户当前状态和安全信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusIcon className="h-5 w-5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">状态:</span>
                <Badge variant={accountStatus.variant}>
                  {accountStatus.label}
                </Badge>
              </div>
              {accountStatus.description && (
                <p className="text-sm text-text-faded mt-1">
                  {accountStatus.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-text-faded" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">权限级别:</span>
                <Badge variant={user.is_admin ? 'secondary' : 'outline'}>
                  {user.is_admin ? '管理员' : '普通用户'}
                </Badge>
              </div>
              <p className="text-sm text-text-faded mt-1">
                {user.is_admin ? '拥有系统管理权限' : '标准用户权限'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            账户详情
          </CardTitle>
          <CardDescription>
            您的账户基本信息（只读）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded flex items-center gap-2">
                <User className="h-4 w-4" />
                用户名
              </Label>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono bg-background-ivory-medium px-2 py-1 rounded">
                  {user.username}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(user.username, 'username')}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {copiedField === 'username' && (
                  <span className="text-xs text-green-600">已复制</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                积分余额
              </Label>
              <p className="text-lg font-semibold text-primary">
                {user.credits?.toLocaleString()}
{' '}
积分
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded flex items-center gap-2">
                用户ID
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserId(!showUserId)}
                  className="h-4 w-4 p-0 ml-2"
                >
                  {showUserId ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </Label>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono bg-background-ivory-medium px-2 py-1 rounded">
                  {showUserId ? user.id : '••••••••'}
                </p>
                {showUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.id.toString(), 'id')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
                {copiedField === 'id' && (
                  <span className="text-xs text-green-600">已复制</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                注册时间
              </Label>
              <p className="text-sm">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            安全提醒
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>账户安全提示：</strong></p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  <li>请定期检查您的账户状态和活动记录</li>
                  <li>不要将您的用户ID和个人信息分享给陌生人</li>
                  <li>如发现账户异常，请及时联系管理员</li>
                  <li>建议定期更新您的个人资料信息</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>账户操作</CardTitle>
          <CardDescription>
            管理您的账户设置和数据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" disabled>
              <Settings className="mr-2 h-4 w-4" />
              修改密码
              <span className="ml-2 text-xs text-text-faded">即将开放</span>
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Shield className="mr-2 h-4 w-4" />
              安全设置
              <span className="ml-2 text-xs text-text-faded">即将开放</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
