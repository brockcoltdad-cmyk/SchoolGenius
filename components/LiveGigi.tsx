'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useTheme, type ThemeId } from '@/lib/theme-context';
import { getGigiConfig } from './animations/GigiCharacter';

// Quick action types for different pages
type QuickAction = {
  label: string;
  icon: string;
  action: 'read' | 'self' | 'help' | 'skip' | 'hint' | 'explain' | 'custom';
  speechText?: string;
};

// Page-specific quick actions
const PAGE_ACTIONS: Record<string, QuickAction[]> = {
  lesson: [
    { label: 'Read to me', icon: '🔊', action: 'read', speechText: "I'll read everything out loud for you!" },
    { label: "I'll read myself", icon: '📖', action: 'self', speechText: "Great! You've got this!" },
    { label: 'Give me a hint', icon: '💡', action: 'hint', speechText: "Here's a little hint to help you..." },
    { label: 'Explain again', icon: '🔄', action: 'explain', speechText: "Let me explain that a different way..." },
  ],
  dashboard: [
    { label: 'What should I do?', icon: '🎯', action: 'help', speechText: "Let me show you what's next!" },
    { label: "I know what I want", icon: '✨', action: 'self', speechText: "Go for it! Pick your adventure!" },
    { label: 'Read my progress', icon: '📊', action: 'read', speechText: "Let me tell you how awesome you're doing!" },
  ],
  chat: [
    { label: 'I have a question', icon: '❓', action: 'help', speechText: "I'm all ears! What would you like to know?" },
    { label: 'Just chatting', icon: '💬', action: 'self', speechText: "I love chatting with you!" },
    { label: 'Help with homework', icon: '📚', action: 'explain', speechText: "Let's tackle that homework together!" },
  ],
  shop: [
    { label: 'Show me themes', icon: '🎨', action: 'read', speechText: "Let me show you all the cool themes!" },
    { label: "I'll browse myself", icon: '👀', action: 'self', speechText: "Happy shopping! You have great taste!" },
    { label: 'What can I afford?', icon: '💰', action: 'help', speechText: "Let me check your coin balance..." },
  ],
  leaderboard: [
    { label: 'Read rankings', icon: '🏆', action: 'read', speechText: "Let me announce the champions!" },
    { label: 'How do I rank up?', icon: '📈', action: 'help', speechText: "Here's how to climb the leaderboard..." },
  ],
  default: [
    { label: 'Help me out', icon: '🙋', action: 'help', speechText: "I'm here to help! What do you need?" },
    { label: "I'm good", icon: '👍', action: 'self', speechText: "Awesome! Let me know if you need anything!" },
  ],
};

// Grade-appropriate welcome messages
const WELCOME_BY_GRADE: Record<string, string> = {
  'K-2': "Hi friend! What would you like to do?",
  '3-5': "Hey there! How can I help you today?",
  '6-8': "What's up? Need any help?",
  '9-12': "Hey! What can I do for you?",
  'default': "Hi! What would you like to do?",
};

interface LiveGigiProps {
  pageContext?: string;
  gradeBand?: string;
  childName?: string;
  childId?: string;
  onAction?: (action: string, data?: any) => void;
  autoGreet?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'floating' | 'corner';
  className?: string;
}

export default function LiveGigi({
  pageContext = 'default',
  gradeBand = 'default',
  childName,
  childId,
  onAction,
  autoGreet = true,
  size = 'md',
  position = 'inline',
  className = '',
}: LiveGigiProps) {
  const { currentTheme } = useTheme();
  const gigiConfig = getGigiConfig(currentTheme.id as ThemeId);

  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Get page-specific actions
  const quickActions = PAGE_ACTIONS[pageContext] || PAGE_ACTIONS.default;

  // Get grade-appropriate welcome
  const welcomeMessage = childName
    ? `Hi ${childName}! ${WELCOME_BY_GRADE[gradeBand] || WELCOME_BY_GRADE.default}`
    : WELCOME_BY_GRADE[gradeBand] || WELCOME_BY_GRADE.default;

  // Size classes
  const sizeClasses = {
    sm: { character: 'text-4xl', bubble: 'max-w-xs', buttons: 'text-sm px-3 py-2' },
    md: { character: 'text-6xl', bubble: 'max-w-sm', buttons: 'text-base px-4 py-2' },
    lg: { character: 'text-8xl', bubble: 'max-w-md', buttons: 'text-lg px-5 py-3' },
  };

  // Position classes
  const positionClasses = {
    inline: 'relative',
    floating: 'fixed bottom-4 right-4 z-50',
    corner: 'fixed bottom-20 right-4 z-50',
  };

  // Speak text using TTS API (with parent's cloned voice if available)
  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    setCurrentMessage(text);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, childId }),
      });

      if (response.ok) {
        const { audio } = await response.json();
        const audioBlob = new Blob(
          [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioEl = new Audio(audioUrl);

        audioEl.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioEl.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audioEl.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [childId]);

  // Handle quick action click
  const handleAction = useCallback((action: QuickAction) => {
    // Speak the response if there's speech text
    if (action.speechText) {
      speak(action.speechText);
    }

    // Notify parent component
    if (onAction) {
      onAction(action.action, { label: action.label });
    }

    // Handle specific actions
    switch (action.action) {
      case 'self':
        // User wants to do it themselves - minimize Gigi
        setTimeout(() => setIsMinimized(true), 2000);
        break;
      case 'read':
        // Stay visible for reading mode
        break;
      case 'help':
      case 'hint':
      case 'explain':
        // Keep options visible for follow-up
        break;
    }
  }, [speak, onAction]);

  // Auto-greet when component mounts
  useEffect(() => {
    if (autoGreet && !hasGreeted && !isMinimized) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setCurrentMessage(welcomeMessage);
        setShowOptions(true);
        setHasGreeted(true);
        // Optionally speak the greeting
        // speak(welcomeMessage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoGreet, hasGreeted, isMinimized, welcomeMessage]);

  // Minimized state - just show a small clickable Gigi
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsMinimized(false);
          setIsOpen(true);
          setShowOptions(true);
        }}
        className={`${positionClasses[position]} ${className}`}
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          borderRadius: '50%',
          padding: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <span className="text-3xl">{gigiConfig.character}</span>
      </motion.button>
    );
  }

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Gigi Character */}
            <motion.div
              animate={isSpeaking ? {
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              } : {
                y: [0, -10, 0],
              }}
              transition={{
                duration: isSpeaking ? 0.5 : 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`${sizeClasses[size].character} cursor-pointer`}
              onClick={() => setShowOptions(!showOptions)}
            >
              {gigiConfig.character}
            </motion.div>

            {/* Speech Bubble */}
            {currentMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${sizeClasses[size].bubble} rounded-2xl p-4 text-center relative`}
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
                  border: `2px solid ${currentTheme.colors.primary}50`,
                  color: currentTheme.colors.text,
                }}
              >
                {/* Speech bubble tail */}
                <div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
                    borderLeft: `2px solid ${currentTheme.colors.primary}50`,
                    borderTop: `2px solid ${currentTheme.colors.primary}50`,
                  }}
                />

                <p className="font-medium">{currentMessage}</p>

                {/* Speaking indicator */}
                {isSpeaking && (
                  <motion.div
                    className="flex justify-center gap-1 mt-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span>🔊</span>
                    <span className="text-sm">Speaking...</span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Quick Action Buttons */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-wrap justify-center gap-2 max-w-md"
                >
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(action)}
                      disabled={isSpeaking}
                      className={`${sizeClasses[size].buttons} rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50`}
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                        color: '#fff',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                      }}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimize button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              onClick={() => setIsMinimized(true)}
              className="text-sm px-3 py-1 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.1)',
                color: currentTheme.colors.text,
              }}
            >
              I'm good for now ✓
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial trigger if not auto-greeting */}
      {!isOpen && !autoGreet && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setIsOpen(true);
            setCurrentMessage(welcomeMessage);
            setShowOptions(true);
          }}
          className="p-4 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <span className={sizeClasses[size].character}>{gigiConfig.character}</span>
        </motion.button>
      )}
    </div>
  );
}

// Export helper to trigger Gigi from anywhere
export function triggerLiveGigi(message: string, options?: QuickAction[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('livegigi:message', {
      detail: { message, options }
    }));
  }
}
