# OpenRouter 意图分析实现

## 🎯 实现概述

基于 OpenRouter 的意图分析系统，支持多种 AI 模型，避免 API 代理问题，提供更稳定的服务。

## 🔧 技术栈

- **统一接口**: OpenRouter API
- **AI SDK**: Vercel AI SDK (@ai-sdk/openai)
- **支持模型**: Claude 3.5 Sonnet, Kimi K2, GPT-4 等
- **类型安全**: TypeScript + Zod Schema

## 📁 文件结构

```
src/
├── libs/
│   ├── AIProvider.ts          # AI 模型提供者
│   └── Env.ts                 # 环境变量配置
├── app/api/
│   ├── analyze-intent/        # 意图分析 API
│   └── ai-models/            # AI 模型信息 API
└── components/chat/
    └── ChatSidebar.tsx        # 聊天侧边栏组件
```

## 🚀 快速开始

### 1. 环境配置

```bash
# 复制环境变量文件
cp .env.example .env.local

# 设置 OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# 可选：设置 Anthropic API Key（直接调用）
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 2. 获取 API Key

访问 [OpenRouter Keys](https://openrouter.ai/keys) 获取 API Key。

### 3. 启动服务

```bash
npm run dev
```

## 🎮 API 使用

### 意图分析 API

```typescript
// POST /api/analyze-intent
{
  "userMessage": "记住明天要开会",
  "chatHistory": [],
  "modelType": "claude-3.5-sonnet-openrouter" // 可选
};

// Response
{
  "intent": "memo",
  "confidence": 95,
  "reason": "用户想要记录一个提醒事项",
  "suggestions": ["设置提醒", "添加到日历"]
}
```

### 模型信息 API

```typescript
// GET /api/ai-models
{
  "default": "claude-3.5-sonnet-openrouter",
  "available": ["claude-3.5-sonnet-openrouter", "kimi-k2", "gpt-4-turbo"],
  "descriptions": {
    "claude-3.5-sonnet-openrouter": "Claude 3.5 Sonnet (via OpenRouter) - 推荐",
    "kimi-k2": "Kimi K2 (1T 参数模型)"
  },
  "pricing": {
    "claude-3.5-sonnet-openrouter": "Input: $3/1M tokens, Output: $15/1M tokens",
    "kimi-k2": "Input: $0.57/1M tokens, Output: $2.30/1M tokens"
  }
};
```

## 🎯 支持的意图类型

| 意图类型 | 描述 | 示例 |
|---------|------|------|
| `memo` | 备忘录/笔记 | "记住明天要开会" |
| `chat` | 闲聊对话 | "你好，今天天气怎么样？" |
| `create` | 创作内容 | "帮我写一篇关于AI的文章" |
| `dangerous` | 敏感危险操作 | "如何破解密码？" |
| `other` | 其他类型 | "怎么使用这个功能？" |

## 🤖 支持的 AI 模型

### 推荐模型

| 模型 | 标识符 | 特点 | 价格 |
|------|--------|------|------|
| Claude 3.5 Sonnet | `claude-3.5-sonnet-openrouter` | 平衡性能与成本 | $3/$15 per 1M tokens |
| Kimi K2 | `kimi-k2` | 超长上下文 (128k tokens) | $0.57/$2.30 per 1M tokens |
| GPT-4 Turbo | `gpt-4-turbo` | 强大的推理能力 | $10/$30 per 1M tokens |

### 模型选择策略

```typescript
// 自动选择最佳模型
const aiProvider = new AIProvider();
const model = aiProvider.getModel('claude-3.5-sonnet-openrouter');

// 或者使用默认模型
const defaultModel = aiProvider.getModel(aiProvider.getDefaultModel());
```

## 🧪 测试

### 运行测试脚本

```bash
# 设置环境变量
export OPENROUTER_API_KEY=your_api_key_here

# 运行测试
node test-intent-analysis.js
```

测试脚本会自动：
- 获取可用模型列表
- 测试不同模型的意图分析准确性
- 提供详细的测试报告

## 💡 最佳实践

### 1. 模型选择

```typescript
// 成本敏感任务
const model = aiProvider.getModel('kimi-k2');

// 高精度任务
const model = aiProvider.getModel('claude-3.5-sonnet-openrouter');

// 代码相关任务
const model = aiProvider.getModel('gpt-4-turbo');
```

### 2. 错误处理

```typescript
try {
  const result = await generateObject({
    model: aiProvider.getModel('claude-3.5-sonnet-openrouter'),
    schema: intentSchema,
    prompt: 'Your prompt here'
  });
} catch (error) {
  // 自动降级到其他模型
  const fallbackModel = aiProvider.getModel('kimi-k2');
  // 重试逻辑
}
```

### 3. 性能优化

- 使用合适的 `temperature` 参数
- 设置适当的 `max_tokens` 限制
- 考虑使用流式响应处理长对话

## 🔄 从 Anthropic 直接调用迁移

如果您之前使用 Anthropic 直接调用：

```diff
- import { createAnthropic } from '@ai-sdk/anthropic';
+ import { createOpenAI } from '@ai-sdk/openai';

- const anthropic = createAnthropic({
-   apiKey: process.env.ANTHROPIC_API_KEY,
- });
+ const openrouter = createOpenAI({
+   apiKey: process.env.OPENROUTER_API_KEY,
+   baseURL: 'https://openrouter.ai/api/v1',
+ });

- model: anthropic('claude-3-sonnet-20240229')
+ model: openrouter('anthropic/claude-3.5-sonnet')
```

## 📊 性能监控

系统提供详细的错误信息和性能指标：

```typescript
{
  "intent": "other",
  "confidence": 50,
  "reason": "网络连接问题，请稍后重试",
  "error": "timeout after 30s" // 仅在开发模式下显示
};
```

## 🛠️ 故障排除

### 常见问题

1. **API Key 错误**
   - 检查 `OPENROUTER_API_KEY` 是否正确设置
   - 验证 API Key 是否有效

2. **模型不可用**
   - 检查模型标识符是否正确
   - 验证账户是否有足够的余额

3. **网络连接问题**
   - 确认可以访问 `https://openrouter.ai`
   - 检查防火墙设置

### 调试模式

```bash
# 启用详细错误信息
NODE_ENV=development npm run dev
```

## 🎉 优势总结

1. **网络稳定性**: 避免直接调用各厂商 API 的网络问题
2. **模型多样性**: 支持多种 AI 模型，灵活切换
3. **成本透明**: 清晰的定价机制，按使用量计费
4. **开发友好**: 统一的 API 接口，减少学习成本
5. **类型安全**: 完整的 TypeScript 支持
6. **易于扩展**: 模块化设计，便于添加新模型

## 📈 下一步计划

- [ ] 添加模型性能监控
- [ ] 实现智能模型选择
- [ ] 支持流式响应
- [ ] 添加缓存机制
- [ ] 集成用户反馈系统

---

**获取支持**: 如有问题，请参考 [OpenRouter 文档](https://openrouter.ai/docs) 或提交 Issue。
