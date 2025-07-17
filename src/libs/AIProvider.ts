import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { Env } from './Env';

export type AIModel
  = | 'claude-3.5-sonnet-openrouter'
    | 'claude-3.5-sonnet-direct'
    | 'kimi-k2'
    | 'gpt-4-turbo'
    | 'gpt-4o';

export type AIProviderConfig = {
  model: AIModel;
  temperature?: number;
  maxTokens?: number;
}

export class AIProvider {
  private openrouter = createOpenAI({
    apiKey: Env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  private anthropic = Env.ANTHROPIC_API_KEY
? createAnthropic({
    apiKey: Env.ANTHROPIC_API_KEY,
  })
: null;

  public getModel(modelType: AIModel) {
    switch (modelType) {
      case 'claude-3.5-sonnet-openrouter':
        return this.openrouter('anthropic/claude-3.5-sonnet');

      case 'claude-3.5-sonnet-direct':
        if (!this.anthropic) {
          throw new Error('Anthropic API key not configured');
        }
        return this.anthropic('claude-3-5-sonnet-20241022');

      case 'kimi-k2':
        return this.openrouter('moonshotai/kimi-k2');

      case 'gpt-4-turbo':
        return this.openrouter('openai/gpt-4-turbo');

      case 'gpt-4o':
        return this.openrouter('openai/gpt-4o');

      default:
        // 默认使用 OpenRouter 的 Claude 3.5 Sonnet
        return this.openrouter('anthropic/claude-3.5-sonnet');
    }
  }

  public getAvailableModels(): AIModel[] {
    const models: AIModel[] = ['claude-3.5-sonnet-openrouter', 'kimi-k2', 'gpt-4-turbo', 'gpt-4o'];

    if (this.anthropic) {
      models.push('claude-3.5-sonnet-direct');
    }

    return models;
  }

  public getDefaultModel(): AIModel {
    return 'claude-3.5-sonnet-openrouter';
  }
}

export const aiProvider = new AIProvider();
