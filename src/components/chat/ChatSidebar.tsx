'use client';

import {useEffect, useRef, useState} from 'react';
import {Button} from '@/components/lovpen-ui/button';
import {VoiceMessageComponent} from './VoiceMessageComponent';

type IntentType = 'memo' | 'chat' | 'create' | 'dangerous' | 'other';

type IntentAnalysis = {
  intent: IntentType;
  confidence: number;
  reason: string;
  response: string;
  action?: {
    type: 'save_memo' | 'none';
    params?: Record<string, any>;
  };
  suggestions?: string[];
};

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'voice';
  audioUrl?: string;
  duration?: number;
  intent?: IntentAnalysis;
  isAnalyzing?: boolean;
  isStreaming?: boolean;
  streamComplete?: boolean;
};

type ChatSidebarProps = {
  onMessageSend?: (message: string, type: 'text' | 'voice') => void;
  onVoiceStateChange?: (isRecording: boolean) => void;
};

export function ChatSidebar({onMessageSend, onVoiceStateChange}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是你的AI写作助手。我可以帮你整理知识库内容，生成文章，或者回答任何问题。有什么可以帮助你的吗？',
      role: 'assistant',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      type: 'text',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const analyzeIntent = async (
    userMessage: string,
    chatHistory: Message[]
  ): Promise<IntentAnalysis> => {
    try {
      const response = await fetch('/api/analyze-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          chatHistory: chatHistory.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('API调用失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('意图分析失败:', error);
      return {
        intent: 'other',
        confidence: 50,
        reason: '分析失败，默认为其他类型',
        response: '好的，我来帮助你。',
      };
    }
  };

  const saveMemoToFileSystem = async (content: string) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `memo-${timestamp}.txt`;

      const response = await fetch('/api/save-memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          fileName,
          path: 'memo',
        }),
      });

      if (!response.ok) {
        throw new Error('保存备忘录失败');
      }

      return fileName;
    } catch (error) {
      console.error('保存备忘录失败:', error);
      throw error;
    }
  };

  const handleStreamResponse = async (
    userMessage: string,
    intentAnalysis: IntentAnalysis,
    messageId: string
  ): Promise<void> => {
    try {
      // 创建初始的助手消息
      const assistantMessage: Message = {
        id: messageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        type: 'text',
        isStreaming: true,
        streamComplete: false,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 处理特殊操作（如保存备忘录）
      let memoInfo = '';
      if (intentAnalysis.action?.type === 'save_memo') {
        try {
          const fileName = await saveMemoToFileSystem(userMessage);
          memoInfo = `\n\n📁 已保存到文件：${fileName}`;
        } catch (error) {
          console.error('保存备忘录失败:', error);
          memoInfo = '\n\n❌ 保存备忘录时出现错误。';
        }
      }

      // 调用流式API
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          chatHistory: messages.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          intentAnalysis,
          modelType: 'claude-3.5-sonnet-openrouter' // 可以从状态获取
        }),
      });

      if (!response.ok) {
        throw new Error(`流式API错误: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      try {
        while (true) {
          const {done, value} = await reader.read();
          if (done) {
 break;
}

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
                // 流完成，添加备忘录信息（如果有）
                setMessages(prev => prev.map(msg =>
                  msg.id === messageId
                    ? {
                        ...msg,
                        content: fullContent + memoInfo,
                        isStreaming: false,
                        streamComplete: true
                      }
                    : msg
                ));
                return;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.error) {
                  // 处理错误
                  setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          content: parsed.error,
                          isStreaming: false,
                          streamComplete: true
                        }
                      : msg
                  ));
                  return;
                }

                if (parsed.content) {
                  fullContent += parsed.content;

                  // 实时更新消息内容
                  setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                      ? {...msg, content: fullContent}
                      : msg
                  ));
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

      // 如果到这里还没有完成，标记为完成
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              content: fullContent + memoInfo,
              isStreaming: false,
              streamComplete: true
            }
          : msg
      ));
    } catch (error) {
      console.error('流式响应处理错误:', error);

      // 显示错误消息
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              content: '抱歉，生成响应时出现了错误，请稍后重试。',
              isStreaming: false,
              streamComplete: true
            }
          : msg
      ));
    }
  };

  const handleSendMessage = async (messageType: 'text' | 'voice' = inputMode) => {
    const content = messageType === 'text' ? inputText.trim() : voiceText.trim();
    if (!content) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      type: messageType,
      isAnalyzing: true,
      ...(messageType === 'voice' && {
        audioUrl: 'mock-audio-url.wav',
        duration: 15,
      }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (messageType === 'text') {
      setInputText('');
    } else {
      setVoiceText('');
      setInputMode('text');
    }

    onMessageSend?.(userMessage.content, messageType);

    try {
      // 第一步：意图分析（快速）
      console.log('🔍 开始意图分析...');
      const intentAnalysis = await analyzeIntent(userMessage.content, messages);

      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id
          ? { ...msg, intent: intentAnalysis, isAnalyzing: false }
          : msg
      ));

      console.log(`✅ 意图分析完成: ${intentAnalysis.intent} (${intentAnalysis.confidence}%)`);

      // 第二步：流式响应生成
      console.log('🌊 开始流式响应生成...');
      const assistantMessageId = (Date.now() + 1).toString();
      await handleStreamResponse(
        userMessage.content,
        intentAnalysis,
        assistantMessageId
      );

      console.log('✅ 流式响应完成');
    } catch (error) {
      console.error('处理消息时出错:', error);

      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id
          ? { ...msg, isAnalyzing: false }
          : msg
      ));

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，处理你的消息时出现了错误。请稍后重试。',
        role: 'assistant',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleVoiceStart = () => {
    setIsRecording(true);
    onVoiceStateChange?.(true);
  };

  const handleVoiceEnd = async () => {
    if (isRecording) {
      setIsRecording(false);
      onVoiceStateChange?.(false);

      const recognizedText = '刚才通过语音输入的内容会显示在这里...';
      setVoiceText(recognizedText);

      const voiceMessage: Message = {
        id: Date.now().toString(),
        content: recognizedText,
        role: 'user',
        timestamp: new Date(),
        type: 'voice',
        audioUrl: 'mock-audio-url.wav',
        duration: 15,
        isAnalyzing: true,
      };

      setMessages(prev => [...prev, voiceMessage]);
      setVoiceText('');
      onMessageSend?.(recognizedText, 'voice');

      try {
        const intentAnalysis = await analyzeIntent(recognizedText, messages);

        setMessages(prev => prev.map(msg =>
          msg.id === voiceMessage.id
            ? { ...msg, intent: intentAnalysis, isAnalyzing: false }
            : msg
        ));

        const assistantMessageId = (Date.now() + 1).toString();
        await handleStreamResponse(
          recognizedText,
          intentAnalysis,
          assistantMessageId
        );
      } catch (error) {
        console.error('处理语音消息时出错:', error);

        setMessages(prev => prev.map(msg =>
          msg.id === voiceMessage.id
            ? { ...msg, isAnalyzing: false }
            : msg
        ));

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '抱歉，处理你的语音消息时出现了错误。请稍后重试。',
          role: 'assistant',
          timestamp: new Date(),
          type: 'text',
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage('text');
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  return (
    <div className="flex flex-col u-gap-m h-full">
      <div
        className="bg-background-main rounded-lg border border-border-default/20 flex-1 flex flex-col overflow-hidden"
      >
        <div
          className="bg-background-ivory-medium px-4 py-2 border-b border-border-default/20 flex items-center justify-between flex-shrink-0"
        >
          <h4 className="font-medium text-text-main text-sm flex items-center u-gap-s">
            💬 Lovpen助手小皮
          </h4>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              🗑
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2" title="导出对话">
              📤
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2" title="搜索对话">
              🔍
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              title="复制全部聊天记录"
              onClick={() => {
                const allMessages = messages.map(msg =>
                  `[${msg.role === 'user' ? '用户' : '助手'}] ${formatTime(msg.timestamp)}: ${msg.content}`
                ).join('\n\n');
                navigator.clipboard.writeText(allMessages);
              }}
            >
              📋
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2" title="对话设置">
              ⚙️
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-background-ivory-medium border border-border-default/20'
                }`}
              >
                {message.type === 'voice'
? (
                  <VoiceMessageComponent
                    audioUrl={message.audioUrl}
                    transcription={message.content}
                    duration={message.duration}
                  />
                )
: (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {/* 流式输出时显示闪烁光标 */}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse">|</span>
                    )}
                  </div>
                )}

                {message.isAnalyzing && (
                  <div className="mt-2 flex items-center u-gap-s">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-white/70 rounded-full animate-bounce"
                        style={{animationDelay: '0.1s'}}
                      >
                      </div>
                      <div
                        className="w-1 h-1 bg-white/70 rounded-full animate-bounce"
                        style={{animationDelay: '0.2s'}}
                      >
                      </div>
                    </div>
                    <span className="text-xs text-white/70">小皮正在思考...</span>
                  </div>
                )}

                {message.intent && !message.isAnalyzing && (
                  <div className="mt-2 flex items-center u-gap-s">
                    <div className="flex items-center u-gap-xs">
                      <span className="text-xs">
                        {message.intent.intent === 'memo' && '📝'}
                        {message.intent.intent === 'chat' && '💬'}
                        {message.intent.intent === 'create' && '✍️'}
                        {message.intent.intent === 'dangerous' && '⚠️'}
                        {message.intent.intent === 'other' && '🤔'}
                      </span>
                      <span className="text-xs text-white/70">
                        {message.intent.intent === 'memo' && '备忘录'}
                        {message.intent.intent === 'chat' && '闲聊'}
                        {message.intent.intent === 'create' && '创作'}
                        {message.intent.intent === 'dangerous' && '敏感'}
                        {message.intent.intent === 'other' && '其他'}
                      </span>
                    </div>
                    <div className="text-xs text-white/50">
                      {message.intent.confidence}
%
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div
                    className={`text-xs ${
                      message.role === 'user' ? 'text-white/70' : 'text-text-faded'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                  {message.type === 'voice' && (
                    <span className="text-xs">🎙️</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}/>
        </div>

        {/* Input Area */}
        <div className="border-t border-border-default/20 p-3 space-y-2 flex-shrink-0">
          {/* Quick Actions */}
          <div className="flex flex-wrap u-gap-s mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputText('帮我总结一下选中的文件内容')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              📄 总结
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputText('基于知识库内容写一篇文章')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              ✍️ 写作
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputText('优化这段内容的表达')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              ✨ 优化
            </Button>
          </div>

          <div className="flex u-gap-s items-center">
            {/* Voice/Keyboard toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
              className="w-9 h-9 flex items-center justify-center text-text-faded hover:text-text-main hover:bg-background-oat rounded-lg transition-all flex-shrink-0"
              title={inputMode === 'text' ? '切换到语音输入' : '切换到文字输入'}
            >
              {inputMode === 'text' ? '🎙️' : '⌨️'}
            </Button>

            {/* Input area */}
            <div className="flex-1">
              {inputMode === 'text'
? (
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  placeholder="💬 输入消息..."
                  className="w-full px-3 py-2 border border-border-default/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm h-9"
                />
              )
: (
                <button
                  type="button"
                  onMouseDown={handleVoiceStart}
                  onMouseUp={handleVoiceEnd}
                  onMouseLeave={handleVoiceEnd}
                  onTouchStart={handleVoiceStart}
                  onTouchEnd={handleVoiceEnd}
                  className={`w-full px-3 py-2 h-9 rounded-lg text-center text-sm transition-all select-none border ${
                    isRecording
                      ? 'bg-red-500/20 border-red-500 text-red-700 animate-pulse'
                      : 'bg-white border-border-default/20 text-text-main hover:bg-background-oat focus:ring-2 focus:ring-primary focus:border-primary'
                  }`}
                >
                  {isRecording ? '松开 结束' : '按住 说话'}
                </button>
              )}
            </div>

            {/* Plus button for file upload */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 flex items-center justify-center text-text-faded hover:text-text-main hover:bg-background-oat rounded-lg transition-all flex-shrink-0"
              title="发送文件"
            >
              ➕
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
