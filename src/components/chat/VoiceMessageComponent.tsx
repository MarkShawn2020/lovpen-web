'use client';

import {useRef, useState} from 'react';
import {Button} from '@/components/lovpen-ui/button';

type VoiceMessageProps = {
  audioUrl?: string;
  transcription: string;
  duration?: number;
  className?: string;
};

export function VoiceMessageComponent({
  audioUrl,
  transcription,
  duration = 0,
  className = '',
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) {
 return;
}

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Voice Player Part */}
      <div className="bg-background-oat/50 rounded-lg p-3 border border-border-default/10">
        <div className="flex items-center u-gap-s">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            className="w-8 h-8 p-0 rounded-full"
            disabled={!audioUrl}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </Button>

          <div className="flex-1">
            <div className="relative h-1 bg-background-ivory-medium rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-150"
                style={{width: `${progressPercentage}%`}}
              />
            </div>
          </div>

          <span className="text-xs text-text-faded font-mono">
            {formatTime(currentTime)}
{' '}
/
{formatTime(duration)}
          </span>

          <span className="text-lg">🎙️</span>
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            preload="metadata"
          >
            <track kind="captions" srcLang="zh" label="Chinese captions" />
          </audio>
        )}
      </div>

      {/* ASR Text Part */}
      <div className="bg-background-ivory-light/30 rounded-lg p-3 border border-border-default/10">
        <div className="flex items-start u-gap-s">
          <span className="text-sm text-text-faded mt-0.5">📝</span>
          <div className="flex-1">
            <div className="text-sm text-text-main leading-relaxed">
              {transcription || '语音转文字处理中...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
