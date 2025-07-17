'use client';

import {useEffect, useRef, useState} from 'react';
import {Button} from '@/components/ui/CustomButton';
import {VoiceMessageComponent} from './VoiceMessageComponent';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'voice';
  audioUrl?: string;
  duration?: number;
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
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);

    onMessageSend?.(userMessage.content, messageType);

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

  const handleVoiceStart = () => {
    setIsRecording(true);
    onVoiceStateChange?.(true);
  };

  const handleVoiceEnd = () => {
    if (isRecording) {
      setIsRecording(false);
      onVoiceStateChange?.(false);
      // Simulate voice recognition result
      const recognizedText = '刚才通过语音输入的内容会显示在这里...';
      setVoiceText(recognizedText);
      // Send voice message immediately
      const voiceMessage: Message = {
        id: Date.now().toString(),
        content: recognizedText,
        role: 'user',
        timestamp: new Date(),
        type: 'voice',
        audioUrl: 'mock-audio-url.wav',
        duration: 15,
      };
      setMessages(prev => [...prev, voiceMessage]);
      setVoiceText('');
      setIsTyping(true);
      onMessageSend?.(recognizedText, 'voice');

      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateMockResponse(recognizedText),
          role: 'assistant',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
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
          className="bg-background-ivory-medium px-4 py-2 border-b border-border-default/20 flex items-center justify-between"
        >
          <h4 className="font-medium text-text-main text-sm flex items-center u-gap-s">
            💬 对话记录
          </h4>
          <div className="flex items-center u-gap-s">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              🗑
            </Button>
            <button
              type="button"
              className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
              title="导出对话"
            >
              📤
            </button>
            <button
              type="button"
              className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
              title="搜索对话"
            >
              🔍
            </button>
            <button
              type="button"
              className="text-xs text-text-faded hover:text-text-main transition-colors p-1 hover:bg-background-oat rounded"
              title="对话设置"
            >
              ⚙️
            </button>
          </div>
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
                {message.type === 'voice' ? (
                  <VoiceMessageComponent
                    audioUrl={message.audioUrl}
                    transcription={message.content}
                    duration={message.duration}
                  />
                ) : (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
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

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-background-ivory-medium border border-border-default/20 rounded-lg p-3">
                <div className="flex items-center u-gap-s">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-text-faded rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-text-faded rounded-full animate-bounce"
                      style={{animationDelay: '0.1s'}}
                    >
                    </div>
                    <div
                      className="w-2 h-2 bg-text-faded rounded-full animate-bounce"
                      style={{animationDelay: '0.2s'}}
                    >
                    </div>
                  </div>
                  <span className="text-xs text-text-faded">AI 正在思考...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}/>
        </div>

        {/* Input Area */}
        <div className="border-t border-border-default/20 p-3 space-y-2">
          {/* Quick Actions */}
          <div className="flex flex-wrap u-gap-s mt-2">
            <button
              type="button"
              onClick={() => setInputText('帮我总结一下选中的文件内容')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              📄 总结
            </button>
            <button
              type="button"
              onClick={() => setInputText('基于知识库内容写一篇文章')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              ✍️ 写作
            </button>
            <button
              type="button"
              onClick={() => setInputText('优化这段内容的表达')}
              className="text-xs bg-background-oat text-text-faded px-2 py-1 rounded hover:bg-background-ivory-medium transition-colors"
            >
              ✨ 优化
            </button>
          </div>

          <div className="flex u-gap-s items-center">
            {/* Voice/Keyboard toggle button */}
            <button
              type="button"
              onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
              className="w-9 h-9 flex items-center justify-center text-text-faded hover:text-text-main hover:bg-background-oat rounded-lg transition-all flex-shrink-0"
              title={inputMode === 'text' ? '切换到语音输入' : '切换到文字输入'}
            >
              {inputMode === 'text' ? '🎙️' : '⌨️'}
            </button>

            {/* Input area */}
            <div className="flex-1">
              {inputMode === 'text' ? (
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
              ) : (
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
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center text-text-faded hover:text-text-main hover:bg-background-oat rounded-lg transition-all flex-shrink-0"
              title="发送文件"
            >
              ➕
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
