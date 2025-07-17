'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KnowledgeBaseRoute() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new files page
    router.replace('/dashboard/files');
  }, [router]);

  return (
    <div className="p-6 flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
