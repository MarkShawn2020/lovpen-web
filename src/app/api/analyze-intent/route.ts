import {NextRequest, NextResponse} from 'next/server';
import {generateObject} from 'ai';
import {z} from 'zod';
import {AIModel, aiProvider} from '@/libs/AIProvider';

const intentSchema = z.object({
  intent: z.enum(['memo', 'chat', 'create', 'dangerous', 'other']),
  confidence: z.number().min(0).max(100),
  reason: z.string(),
  response: z.string(),
  action: z.object({
    type: z.enum(['save_memo', 'none']),
    params: z.record(z.any()).optional(),
  }).optional(),
  suggestions: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const {userMessage, chatHistory, modelType} = await request.json();

    const historyContext = chatHistory
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // 打印可读性高的消息历史
    console.log('📝 意图分析请求 - 消息历史:');
    console.log('═'.repeat(50));
    if (chatHistory.length === 0) {
      console.log('  (无历史记录)');
    } else {
      chatHistory.forEach((msg: any, index: number) => {
        console.log(`  ${index + 1}. [${msg.role}]: ${msg.content}`);
      });
    }
    console.log('═'.repeat(50));
    console.log(`📬 当前用户消息: "${userMessage}"`);
    console.log(`🤖 使用模型: ${modelType || aiProvider.getDefaultModel()}`);
    console.log('═'.repeat(50));

    // 默认使用 Claude 3.5 Sonnet 通过 OpenRouter
    const selectedModel: AIModel = modelType || aiProvider.getDefaultModel();
    const model = aiProvider.getModel(selectedModel);

    const result = await generateObject({
      model,
      schema: intentSchema,
      prompt: `作为Lovpen助手小皮，请分析用户的意图并生成合适的回复。基于以下对话历史和用户的最新消息：

对话历史：
${historyContext}

用户消息：${userMessage}

请完成两个任务：
1. 分析用户意图（从以下5个类别选择）
2. 生成自然、个性化的回复

**意图类别：**

1. **memo** - 备忘录/笔记记录
   示例："记住明天开会"、"备忘：买牛奶"
   → 对于memo类型，设置 action.type 为 "save_memo"，response 中告知已保存

2. **chat** - 闲聊娱乐互动
   包括：问候、娱乐请求("说笑话"、"讲故事")、情感交流、轻松对话
   → 生成自然友好的回复，如果是娱乐请求则提供具体内容

3. **create** - 专业创作任务
   包括：正式文档、工作邮件、学术内容、营销文案等
   → 询问详细需求，提供创作指导

4. **dangerous** - 敏感危险内容
   涉及隐私、违法、伤害等
   → 礼貌拒绝并说明原因

5. **other** - 其他类型
   技术问题、使用帮助等
   → 提供相应帮助或指导

**回复要求：**
- 语调自然亲切，符合小皮的AI助手身份
- 根据具体内容个性化回复，避免模板化
- 娱乐请求要提供具体内容（笑话、故事等）
- 专业请求要体现专业性
- 回复长度适中，不要过于冗长

**特殊处理：**
- memo类型：设置action为save_memo，告知用户已保存到memo目录
- 其他类型：action为none或不设置`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('Intent analysis failed:', error);

    // 提供更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = errorMessage.includes('network') || errorMessage.includes('timeout');

    return NextResponse.json(
      {
        intent: 'other',
        confidence: 50,
        reason: isNetworkError
          ? '网络连接问题，请稍后重试'
          : '分析失败，默认为其他类型',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      {status: 200}
    );
  }
}
