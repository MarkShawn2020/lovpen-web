import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const feedbackSchema = z.object({
  subject: z.string().min(1, '请输入主题'),
  message: z.string().min(10, '请输入至少10个字符的反馈内容'),
  userId: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    const validation = feedbackSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '请求数据无效', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { subject, message, userId, username, email } = validation.data;

    // 发送邮件的逻辑
    await sendFeedbackEmail({
      subject,
      message,
      userId,
      username,
      email,
    });

    return NextResponse.json({ success: true, message: '反馈提交成功' });
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      {
        error: '提交反馈失败',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// 发送反馈邮件的函数
async function sendFeedbackEmail({ subject, message, userId, username, email }: {
  subject: string;
  message: string;
  userId?: string;
  username?: string;
  email?: string;
}) {
  // 获取环境变量
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lovpen.com';
  const smtpHost = process.env.SMTP_HOST;
  const _smtpPort = process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // 如果没有配置邮件服务，则记录到控制台
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('============ 新的反馈提交 ============');
    console.log('用户ID:', userId || '未知');
    console.log('用户名:', username || '未知');
    console.log('用户邮箱:', email || '未知');
    console.log('反馈主题:', subject);
    console.log('反馈内容:', message);
    console.log('提交时间:', new Date().toLocaleString('zh-CN'));
    console.log('========================================');
    
    // 在未来实现邮件功能时，可以保存到数据库或其他方式
    return;
  }

  // 这里可以添加实际的邮件发送逻辑
  // 例如使用 nodemailer 或其他邮件服务
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransporter({...});
  // await transporter.sendMail({...});
  
  // 暂时记录到控制台
  console.log('发送邮件:', {
    to: adminEmail,
    from: email || 'noreply@lovpen.com',
    subject: `[产品反馈] ${subject}`,
    html: `
      <h2>产品反馈</h2>
      <p><strong>用户ID:</strong> ${userId || '未知'}</p>
      <p><strong>用户名:</strong> ${username || '未知'}</p>
      <p><strong>用户邮箱:</strong> ${email || '未知'}</p>
      <p><strong>反馈主题:</strong> ${subject}</p>
      <p><strong>反馈内容:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <p><strong>提交时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
    `
  });
}
