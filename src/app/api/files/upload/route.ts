import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取FormData
    const formData = await request.formData();
    
    // 构建URL，包含title参数
    const url = new URL(`${FASTAPI_BASE_URL}/knowledge/items/upload`);
    const title = formData.get('title');
    if (title) {
      url.searchParams.set('title', title.toString());
    }

    // 直接转发FormData到FastAPI
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to upload file', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('File Upload API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
