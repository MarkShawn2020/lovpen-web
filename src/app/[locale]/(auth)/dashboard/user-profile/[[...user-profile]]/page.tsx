'use client';

// 客户端组件移除服务端导入
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAuth} from '@/contexts/AuthContext';
import {withAuthRequired} from '@/components/auth/withAuth';
import {useState} from 'react';

function UserProfilePage() {
  const {user, logout} = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">用户资料</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={user.username}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  value={user.email || '未设置'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="fullName">姓名</Label>
                <Input
                  id="fullName"
                  value={user.full_name || '未设置'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">电话</Label>
                <Input
                  id="phone"
                  value={user.phone || '未设置'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="credits">积分</Label>
                <Input
                  id="credits"
                  value={user.credits.toString()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="createdAt">注册时间</Label>
                <Input
                  id="createdAt"
                  value={new Date(user.created_at).toLocaleDateString()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>账户操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                如需修改个人信息，请联系管理员。
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? '退出中...' : '退出登录'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuthRequired(UserProfilePage, '/login');
