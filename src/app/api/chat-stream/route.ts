import {NextRequest} from 'next/server';
import {AIModel, aiProvider} from '@/lib/AIProvider';
import {Env} from '@/lib/Env';

export async function POST(request: NextRequest) {
  try {
    const {userMessage, chatHistory, intentAnalysis, modelType} = await request.json();

    // 打印流式请求信息
    console.log('🌊 流式响应请求:');
    console.log('═'.repeat(50));
    console.log(`📬 用户消息: "${userMessage}"`);
    console.log(`🎯 意图: ${intentAnalysis.intent} (${intentAnalysis.confidence}%)`);
    console.log(`🤖 使用模型: ${modelType || aiProvider.getDefaultModel()}`);
    console.log('═'.repeat(50));

    // 根据意图构建合适的prompt
    const systemPrompt = buildSystemPrompt(intentAnalysis);
    const messages = buildMessages(systemPrompt, chatHistory, userMessage);

    // 创建可读流
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 调用OpenRouter流式API
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: getOpenRouterModel(modelType || aiProvider.getDefaultModel()),
              messages,
              stream: true,
              temperature: 0.7,
              max_tokens: 2000,
            }),
          });

          if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Response body is not readable');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          try {
            while (true) {
              const {done, value} = await reader.read();
              if (done) {
 break;
}

              // 解码新的数据块
              buffer += decoder.decode(value, {stream: true});

              // 处理完整的行
              while (true) {
                const lineEnd = buffer.indexOf('\n');
                if (lineEnd === -1) {
 break;
}

                const line = buffer.slice(0, lineEnd).trim();
                buffer = buffer.slice(lineEnd + 1);

                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    // 发送完成信号
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;

                    if (content) {
                      // 转发内容到客户端
                      controller.enqueue(
                        new TextEncoder().encode(`data: ${JSON.stringify({content})}\n\n`)
                      );
                    }
                  } catch {
                    // 忽略无效JSON
                  }
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        } catch (error) {
          console.error('流式处理错误:', error);

          // 发送错误信息
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({
              error: '生成响应时出现错误，请稍后重试。',
              details: errorMessage
            })}\n\n`)
          );
          controller.close();
        }
      },
    });

    // 返回SSE响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('流式API错误:', error);

    // 返回错误流
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify({
            error: '服务暂时不可用，请稍后重试。'
          })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}

function buildSystemPrompt(intentAnalysis: any): string {
  const basePrompt = '你是Lovpen助手小皮，一个友好、专业的AI助手。';

  switch (intentAnalysis.intent) {
    case 'memo':
      return `${basePrompt}用户想要记录备忘录，请确认已保存并提供简短的确认信息。`;

    case 'chat':
      return `${basePrompt}用户想要闲聊或获取娱乐内容。请提供自然、有趣的回复。如果用户要求笑话、故事等娱乐内容，请直接提供具体内容。保持轻松愉快的语调。`;

    case 'create':
      return `${basePrompt}用户需要创作帮助。请提供专业、有建设性的建议，询问必要的细节以便更好地帮助用户。`;

    case 'dangerous':
      return `${basePrompt}用户的请求涉及敏感内容。请礼貌地拒绝并解释原因，同时提供可以帮助的替代方案。`;

    case 'other':
    default:
      return `${basePrompt}请根据用户的具体需求提供有帮助的回复。`;
  }
}

function buildMessages(systemPrompt: string, chatHistory: any[], userMessage: string) {
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    }
  ];

  // 添加聊天历史（最近5条）
  const recentHistory = chatHistory.slice(-5);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content
    });
  }

  // 添加当前用户消息
  messages.push({
    role: 'user',
    content: userMessage
  });

  return messages;
}

function getOpenRouterModel(modelType: AIModel): string {
  switch (modelType) {
    case 'claude-3.5-sonnet-openrouter':
      return 'anthropic/claude-3.5-sonnet';
    case 'kimi-k2':
      return 'moonshotai/kimi-k2';
    case 'gpt-4-turbo':
      return 'openai/gpt-4-turbo';
    case 'gpt-4o':
      return 'openai/gpt-4o';
    default:
      return 'anthropic/claude-3.5-sonnet';
  }
}
