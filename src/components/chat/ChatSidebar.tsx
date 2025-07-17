'use client';

import {useEffect, useRef, useState} from 'react';
import {Button} from '@/components/ui/Button';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'voice';
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
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      role: 'user',
      timestamp: new Date(),
      type: inputMode,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    onMessageSend?.(userMessage.content, inputMode);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (userInput: string): string => {
    if (userInput.includes('知识库') || userInput.includes('文件')) {
      return '我看到你想了解知识库功能。你可以在左侧浏览你的文件，我能帮你分析这些内容并生成相关文章。需要我帮你整理某个特定文件的内容吗？';
    }
    if (userInput.includes('写作') || userInput.includes('文章')) {
      return '我很乐意帮你写作！你想写什么类型的文章？我可以基于你的知识库内容来生成博客文章、技术文档、或者其他形式的内容。';
    }
    if (userInput.includes('语音') || userInput.includes('录音')) {
      return '语音输入功能已经启用！你可以点击麦克风按钮开始语音输入，我会将你的语音转换为文字并进行回复。';
    }
    return '好的，我理解了你的需求。让我来帮你处理这个问题。你还有其他问题吗？';
  };

  const handleVoiceToggle = () => {
    if (inputMode === 'voice' && isRecording) {
      // Stop recording
      setIsRecording(false);
      onVoiceStateChange?.(false);
      // Simulate voice recognition result
      setInputText('刚才通过语音输入的内容会显示在这里...');
      setInputMode('text');
    } else if (inputMode === 'voice') {
      // Start recording
      setIsRecording(true);
      onVoiceStateChange?.(true);
    } else {
      // Switch to voice mode
      setInputMode('voice');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    <div className="lg:col-span-3 flex flex-col u-gap-m h-full">
      {/* Chat Header */}
      <div className="bg-background-main rounded-lg border border-border-default/20 overflow-hidden">
        <div className="bg-background-ivory-medium px-6 py-4 border-b border-border-default/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center u-gap-s">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-medium text-text-main">AI 助手</h3>
                <p className="text-xs text-text-faded">在线 • 随时为你服务</p>
              </div>
            </div>

            <div className="flex items-center u-gap-s">
              <Button variant="outline" size="sm" className="text-xs">
                清空历史
              </Button>
              <button
                type="button"
                className="text-xs text-text-faded hover:text-text-main transition-colors"
                title="更多选项"
              >
                ⋯
              </button>
            </div>
          </div>
        </div>

        {/* Chat Context Pills */}
        <div className="p-4 border-b border-border-default/20">
          <div className="flex flex-wrap u-gap-s">
            <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
              📝 写作助手
            </div>
            <div className="bg-background-oat text-text-faded text-xs px-3 py-1 rounded-full">
              🧠 知识整理
            </div>
            <div className="bg-background-oat text-text-faded text-xs px-3 py-1 rounded-full">
              ✨ 内容优化
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="bg-background-main rounded-lg border border-border-default/20 flex-1 flex flex-col overflow-hidden">
        <div className="bg-background-ivory-medium px-6 py-3 border-b border-border-default/20">
          <h4 className="font-medium text-text-main text-sm">对话记录</h4>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
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
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
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

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-background-ivory-medium border border-border-default/20 rounded-lg p-3">
                <div className="flex items-center u-gap-s">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-text-faded rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-text-faded rounded-full animate-bounce"
                         style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-text-faded rounded-full animate-bounce"
                         style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-text-faded">AI 正在思考...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}/>
        </div>

        {/* Input Area */}
        <div className="border-t border-border-default/20 p-4">
          {/* Input Mode Toggle */}
          <div className="flex items-center justify-center mb-3">
            <div className="bg-background-ivory-medium rounded-full p-1 border border-border-default/20">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  inputMode === 'text'
                    ? 'bg-primary text-white'
                    : 'text-text-faded hover:text-text-main'
                }`}
              >
                📝 文字
              </button>
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  inputMode === 'voice'
                    ? 'bg-primary text-white'
                    : 'text-text-faded hover:text-text-main'
                }`}
              >
                🎙️ 语音
              </button>
            </div>
          </div>

          {/* Input Interface */}
          {inputMode === 'text'
            ? (
              <div className="flex u-gap-s">
                <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="输入消息..."
                      className="w-full p-3 border border-border-default/20 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                      style={{minHeight: '44px', maxHeight: '120px'}}
                      rows={1}
                    />
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="px-4 py-3 h-auto"
                >
                  发送
                </Button>
              </div>
            )
            : (
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-red-500/20 border-2 border-red-500 animate-pulse'
                      : 'bg-primary/20 border-2 border-primary hover:bg-primary/30'
                  }`}
                  onClick={handleVoiceToggle}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleVoiceToggle();
                    }
                  }}
                >
                  {isRecording ? '🔴' : '🎤'}
                </div>

                <p className="text-sm text-text-faded mb-4">
                  {isRecording ? '正在录音中，再次点击停止' : '点击按钮开始语音输入'}
                </p>

                {inputText && (
                  <div className="bg-background-ivory-medium rounded-lg p-3 mb-4 border border-border-default/20">
                    <p className="text-sm text-text-main">{inputText}</p>
                    <div className="flex justify-center u-gap-s mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText('')}
                      >
                        重录
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSendMessage}
                      >
                        发送
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Quick Actions */}
          <div className="flex flex-wrap u-gap-s mt-3">
            <button
              type="button"
              onClick={() => setInputText('帮我总结一下选中的文件内容')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              📄 总结文件
            </button>
            <button
              type="button"
              onClick={() => setInputText('基于知识库内容写一篇文章')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              ✍️ 写文章
            </button>
            <button
              type="button"
              onClick={() => setInputText('优化这段内容的表达')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              ✨ 优化内容
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
