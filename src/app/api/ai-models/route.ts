import { NextResponse } from 'next/server';
import { aiProvider } from '@/lib/AIProvider';

export async function GET() {
  try {
    const availableModels = aiProvider.getAvailableModels();
    const defaultModel = aiProvider.getDefaultModel();

    const modelInfo = {
      default: defaultModel,
      available: availableModels,
      descriptions: {
        'claude-3.5-sonnet-openrouter': 'Claude 3.5 Sonnet (via OpenRouter) - 推荐',
        'claude-3.5-sonnet-direct': 'Claude 3.5 Sonnet (直接调用)',
        'kimi-k2': 'Kimi K2 (1T 参数模型)',
        'gpt-4-turbo': 'GPT-4 Turbo',
        'gpt-4o': 'GPT-4o'
      },
      pricing: {
        'claude-3.5-sonnet-openrouter': 'Input: $3/1M tokens, Output: $15/1M tokens',
        'kimi-k2': 'Input: $0.57/1M tokens, Output: $2.30/1M tokens',
        'gpt-4-turbo': 'Input: $10/1M tokens, Output: $30/1M tokens',
        'gpt-4o': 'Input: $2.50/1M tokens, Output: $10/1M tokens'
      }
    };

    return NextResponse.json(modelInfo);
  } catch (error) {
    console.error('Failed to get AI models:', error);
    return NextResponse.json(
      { error: 'Failed to get model information' },
      { status: 500 }
    );
  }
}
