'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { NotificationConfig } from '@/types/waitlist';
import { Button } from '@/components/lovpen-ui/button';

type WaitlistPositionNotificationProps = {
  config: NotificationConfig;
  onDismiss?: () => void;
}

export function WaitlistPositionNotification({
  config,
  onDismiss
}: WaitlistPositionNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  const triggerCelebration = () => {
    // Confetti animation for priority positions
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
    });

    // Additional burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 }
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 }
      });
    }, 400);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300); // Wait for exit animation
  };

  useEffect(() => {
    // Smooth entrance animation
    const enterTimer = setTimeout(() => setVisible(true), 100);

    // Celebratory animation for VIP positions
    if (config.celebratory && !celebrated) {
      const celebrateTimer = setTimeout(() => {
        triggerCelebration();
        setCelebrated(true);
      }, 500);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(celebrateTimer);
      };
    }

    // Auto-dismiss
    if (config.duration > 0) {
      const dismissTimer = setTimeout(() => {
        handleDismiss();
      }, config.duration);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(dismissTimer);
      };
    }

    return () => clearTimeout(enterTimer);
  }, [config.celebratory, config.duration, celebrated, handleDismiss]);

  const getNotificationStyle = () => {
    switch (config.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-400';
    }
  };

  const extractPosition = (message: string): string | null => {
    // Extract position number from message for highlighting
    const match = message.match(/第\s*(\d+)\s*位|#(\d+)/);
    return match ? (match[1] || match[2] || null) : null;
  };

  const highlightPosition = (message: string): React.JSX.Element => {
    const position = extractPosition(message);
    if (!position) {
      return <span>{message}</span>;
    }

    // Replace position number with highlighted version
    const regex = new RegExp(`第\\s*${position}\\s*位|#${position}`, 'g');
    const parts = message.split(regex);
    
    if (parts.length <= 1) {
      return <span>{message}</span>;
    }

    return (
      <span>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="inline-block mx-1">
                <span className="font-bold text-yellow-200 bg-yellow-600/30 px-2 py-1 rounded-md border border-yellow-300/50 shadow-sm">
                  {message.includes('第') ? `第 ${position} 位` : `#${position}`}
                </span>
              </span>
            )}
          </span>
        ))}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -120, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -120, opacity: 0, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-2xl mx-auto px-4"
        >
          <div
            className={`
              relative overflow-hidden rounded-xl border-2 shadow-2xl backdrop-blur-sm
              ${getNotificationStyle()}
            `}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  {/* Title */}
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold">
                      {config.title}
                    </h3>
                    {config.celebratory && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="ml-2 text-2xl"
                      >
                        🎉
                      </motion.span>
                    )}
                  </div>

                  {/* Message with highlighted position */}
                  <div className="text-sm opacity-95 mb-4 leading-relaxed">
                    {highlightPosition(config.message)}
                  </div>

                  {/* Actions */}
                  {config.actions && config.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {config.actions.map(action => (
                        <Button
                          key={action.key}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200"
                          onClick={() => {
                            action.handler();
                            handleDismiss();
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
                  aria-label="关闭通知"
                >
                  <svg
                    className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress bar for auto-dismiss */}
            {config.duration > 0 && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: config.duration / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 origin-left"
                style={{ width: '100%' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
