'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { withAuthNotRequired } from '@/components/auth/withAuth';

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </Suspense>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            已有账户？
{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAuthNotRequired(RegisterPage);
