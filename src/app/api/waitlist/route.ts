import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const waitlistRequestSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z.string().optional(),
  company: z.string().optional(),
  useCase: z.string().optional(),
  source: z.string().default('unknown'),
  userId: z.string().optional(),
  isAuthenticated: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== Waitlist API called ===');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const validatedData = waitlistRequestSchema.parse(body);
    console.log('Validated data:', validatedData);

    // 临时将数据存储到内存中（开发测试用）
    // TODO: 连接数据库后替换为实际存储
    console.log('Saving waitlist entry:', {
      email: validatedData.email,
      name: validatedData.name,
      company: validatedData.company,
      useCase: validatedData.useCase,
      source: validatedData.source,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: '申请提交成功！我们会在产品准备就绪时通知您。',
      data: {
        id: crypto.randomUUID(),
        email: validatedData.email,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Waitlist submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入数据格式有误', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '服务器内部错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Waitlist API is working',
    timestamp: new Date().toISOString(),
  });
}
