import type {Database} from '@/types/database';
import {createClient} from '@supabase/supabase-js';

// 智能环境检测
function getSupabaseConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocal = process.env.SUPABASE_ENV === 'local';
  
  // 本地开发优先级：SUPABASE_ENV=local > NODE_ENV=development
  if (isLocal || (isDevelopment && !process.env.VERCEL)) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1') 
        ? process.env.NEXT_PUBLIC_SUPABASE_URL 
        : 'http://127.0.0.1:54321',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('supabase-demo')
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.includes('supabase-demo')
        ? process.env.SUPABASE_SERVICE_ROLE_KEY
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
    };
  }
  
  // 生产环境配置
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}

const config = getSupabaseConfig();

// Client for public operations (browser)
export const supabase = createClient<Database>(config.url, config.anonKey);

// Service client for server-side operations
export const supabaseServiceClient = config.serviceKey
  ? createClient<Database>(config.url, config.serviceKey)
  : supabase; // Fallback to anon client if service key not available

// 环境信息（调试用）
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Environment:', {
    url: config.url,
    isLocal: config.url.includes('127.0.0.1'),
    hasServiceKey: !!config.serviceKey
  });
}

export type {Database};
