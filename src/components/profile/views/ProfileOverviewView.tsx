'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Globe, Settings, TrendingUp, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fastAPIAuthService } from '@/services/fastapi-auth-v2';
import type { ProfileCompletion } from '@/services/fastapi-auth-v2';

export function ProfileOverviewView() {
  const { user } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion | null>(null);

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

  const getSectionStats = () => {
    if (!user) {
 return []; 
}
    
    return [
      {
        label: '基本信息',
        icon: User,
        filled: [user.full_name, user.email, user.phone, user.bio].filter(Boolean).length,
        total: 4,
      },
      {
        label: '职业信息',
        icon: Briefcase,
        filled: [user.occupation, user.company].filter(Boolean).length,
        total: 2,
      },
      {
        label: '在线资料',
        icon: Globe,
        filled: [user.website, user.github_username, user.twitter_username, user.linkedin_url].filter(Boolean).length,
        total: 4,
      },
    ];
  };

  const sectionStats = getSectionStats();

  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            资料概览
          </CardTitle>
          <CardDescription>
            您的个人资料概况和完整度统计
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user?.avatar_url
? (
                <AvatarImage src={user.avatar_url} alt="头像" />
              )
: (
                <AvatarFallback className="text-lg">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-main">
                {user?.full_name || user?.username || '未设置姓名'}
              </h3>
              <p className="text-sm text-text-faded">{user?.email || '未设置邮箱'}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={user?.disabled ? 'destructive' : 'default'}>
                  {user?.disabled ? '已禁用' : '正常'}
                </Badge>
                {user?.is_admin && (
                  <Badge variant="secondary">管理员</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          {profileCompletion && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">资料完整度</span>
                  <span className="font-semibold text-primary">
                    {Math.round(profileCompletion.completion_percentage)}
%
                  </span>
                </div>
                <Progress 
                  value={profileCompletion.completion_percentage} 
                  className="h-3"
                />
              </div>

              {profileCompletion.suggestions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">建议完善：</Label>
                  <ul className="text-sm text-text-faded space-y-1">
                    {profileCompletion.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>各部分完成情况</CardTitle>
          <CardDescription>
            查看各个设置部分的填写情况
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectionStats.map((section) => {
              const IconComponent = section.icon;
              const percentage = (section.filled / section.total) * 100;
              
              return (
                <div key={section.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-text-faded" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                    <span className="text-sm text-text-faded">
                      {section.filled}
{' '}
/
{section.total}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            账户信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded">用户名</Label>
              <p className="text-sm">{user?.username}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded">积分余额</Label>
              <p className="text-sm font-semibold text-primary">{user?.credits}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded">注册时间</Label>
              <p className="text-sm">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '未知'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-faded">用户ID</Label>
              <p className="text-sm font-mono">{user?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
