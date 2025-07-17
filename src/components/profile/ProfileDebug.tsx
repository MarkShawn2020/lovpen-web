'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fastAPIAuthService } from '@/services/fastapi-auth-v2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ProfileDebug() {
  const { user, tokens, loading, error, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState({
    baseUrl: '',
    hasTokens: false,
    tokensValid: false,
    apiReachable: false,
    userFetchError: null as string | null,
  });

  const checkDebugInfo = async () => {
    const info = {
      baseUrl: (fastAPIAuthService as any).baseUrl || 'Not set',
      hasTokens: !!fastAPIAuthService.getCurrentUser() || !!tokens,
      tokensValid: fastAPIAuthService.isTokenValid(),
      apiReachable: false,
      userFetchError: null as string | null,
    };

    // 测试 API 连接
    try {
      const response = await fetch(`${info.baseUrl}/docs`);
      info.apiReachable = response.ok;
    } catch {
      info.apiReachable = false;
    }

    // 如果有 tokens，尝试获取用户信息
    if (info.hasTokens && info.tokensValid) {
      try {
        await fastAPIAuthService.fetchCurrentUser();
      } catch (error) {
        info.userFetchError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    setDebugInfo(info);
  };

  useEffect(() => {
    checkDebugInfo();
  }, [user, tokens]);

  const handleRefresh = () => {
    checkDebugInfo();
  };

  const handleTestLogin = async () => {
    try {
      // 这里可以添加测试登录逻辑
      await fastAPIAuthService.initialize();
      checkDebugInfo();
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Profile Loading 调试信息
          </CardTitle>
          <CardDescription>
            检查认证状态和连接配置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">认证状态</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>用户已登录:</span>
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '是' : '否'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>用户信息:</span>
                  <span className={user ? 'text-green-600' : 'text-red-600'}>
                    {user ? `${user.username} (ID: ${user.id})` : '无'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Token状态:</span>
                  <span className={tokens ? 'text-green-600' : 'text-red-600'}>
                    {tokens ? '有效' : '无'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loading状态:</span>
                  <span>{loading ? '加载中' : '完成'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">连接状态</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>API Base URL:</span>
                  <span className="text-xs break-all">{debugInfo.baseUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span>API连接:</span>
                  <span className={debugInfo.apiReachable ? 'text-green-600' : 'text-red-600'}>
                    {debugInfo.apiReachable ? '正常' : '失败'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>有Token:</span>
                  <span className={debugInfo.hasTokens ? 'text-green-600' : 'text-red-600'}>
                    {debugInfo.hasTokens ? '是' : '否'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Token有效:</span>
                  <span className={debugInfo.tokensValid ? 'text-green-600' : 'text-red-600'}>
                    {debugInfo.tokensValid ? '是' : '否'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
认证错误:
{error}
              </AlertDescription>
            </Alert>
          )}

          {debugInfo.userFetchError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
获取用户信息失败:
{debugInfo.userFetchError}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              刷新状态
            </Button>
            <Button onClick={handleTestLogin} variant="outline" size="sm">
              重新初始化
            </Button>
          </div>

          {/* 解决方案建议 */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">可能的解决方案：</h4>
            <div className="text-sm space-y-2">
              {!debugInfo.apiReachable && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>API连接失败</strong>
：请确保 FastAPI 后端正在运行在
{debugInfo.baseUrl}
                  </AlertDescription>
                </Alert>
              )}
              
              {!debugInfo.hasTokens && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>未登录</strong>
：请先登录账户
                  </AlertDescription>
                </Alert>
              )}
              
              {debugInfo.hasTokens && !debugInfo.tokensValid && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Token过期</strong>
：请重新登录
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
