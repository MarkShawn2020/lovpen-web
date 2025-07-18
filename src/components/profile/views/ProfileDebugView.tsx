'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug } from 'lucide-react';
import { ProfileDebug } from '../ProfileDebug';

export function ProfileDebugView() {
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            调试信息
          </CardTitle>
          <CardDescription>
            开发者调试信息和系统诊断
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              调试信息仅在开发环境下可用。当前环境：
              <Badge variant="outline" className="ml-2">
                {process.env.NODE_ENV || 'production'}
              </Badge>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            开发者调试
          </CardTitle>
          <CardDescription>
            用于开发和测试的调试信息，帮助诊断认证和连接问题
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>开发者模式已启用</strong></p>
                  <p className="text-sm">
                    以下信息仅在开发环境中显示，包含敏感的系统状态和连接信息。
                    在生产环境中，此页面将不可用。
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">当前环境:</span>
              <Badge variant="secondary">
                {process.env.NODE_ENV}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render the original ProfileDebug component */}
      <ProfileDebug />
    </div>
  );
}
