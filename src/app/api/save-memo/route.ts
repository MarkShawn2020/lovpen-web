import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

export async function POST(request: NextRequest) {
  try {
    const { content, fileName } = await request.json();

    // 临时存储在项目根目录的 temp-memos 文件夹中
    const memoDir = join(process.cwd(), 'temp-memos');

    // 确保目录存在
    if (!existsSync(memoDir)) {
      await mkdir(memoDir, { recursive: true });
    }

    // 创建文件路径
    const filePath = join(memoDir, fileName);

    // 写入文件
    await writeFile(filePath, content, 'utf8');

    return NextResponse.json({
      success: true,
      fileName,
      path: filePath,
      message: '备忘录已保存'
    });
  } catch (error) {
    console.error('保存备忘录失败:', error);
    return NextResponse.json(
      { error: '保存备忘录失败' },
      { status: 500 }
    );
  }
}
