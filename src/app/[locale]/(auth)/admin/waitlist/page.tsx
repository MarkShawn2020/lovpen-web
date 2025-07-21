import { WaitlistAdminDashboard } from '@/components/admin/WaitlistAdminDashboard';

export default function AdminWaitlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          等待列表管理
        </h1>
        <p className="text-gray-600">
          管理和审核用户的试用申请
        </p>
      </div>
      
      <WaitlistAdminDashboard />
    </div>
  );
}

export const metadata = {
  title: '等待列表管理 - LovPen Admin',
  description: '管理和审核用户的试用申请',
};
