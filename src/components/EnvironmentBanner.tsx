'use client';

import { useEffect, useState } from 'react';

export function EnvironmentBanner() {
  const [environment, setEnvironment] = useState<{
    isDevelopment: boolean;
    isLocal: boolean;
    supabaseUrl: string;
  } | null>(null);

  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const isLocal = supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost');

    setEnvironment({
      isDevelopment,
      isLocal,
      supabaseUrl
    });
  }, []);

  if (!environment?.isDevelopment) {
 return null; 
}

  return (
    <div className={`fixed bottom-4 left-4 z-50 px-3 py-2 rounded-lg text-xs font-mono ${
      environment.isLocal 
        ? 'bg-green-100 text-green-800 border border-green-300' 
        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          environment.isLocal ? 'bg-green-500' : 'bg-yellow-500'
        }`}
        />
        <span>
          {environment.isLocal ? '🏠 Local Supabase' : '☁️ Production Supabase'}
        </span>
      </div>
      <div className="text-xs opacity-70 mt-1">
        {environment.supabaseUrl}
      </div>
    </div>
  );
}
