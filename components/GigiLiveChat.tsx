'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { getGigiConfig } from './animations/GigiCharacter';
import { isUnder13 as checkUnder13, filterPII } from '@/lib/coppa-chat-helper';

interface Message {
  id: string;
  role: 'user' | 'gigi';
  content: string;
  timestamp: Date;
}

interface GigiLiveChatProps {
  childId: string;
  childName?: string;
  gradeLevel?: string; // K, 1-12 - used for COPPA compliance
  pageContext?: string;
}

// Get typewriter speed based on grade level (ms per character)
// Slower for young kids, faster for older - slightly faster than reading speed
function getTypingSpeed(grade: string): number {
  const g = grade.toUpperCase();
  if (g === 'K' || g === '1' || g === '2') return 45;      // Young kids - slow
  if (g === '3' || g === '4' || g === '5') return 30;      // Elementary - medium
  if (g === '6' || g === '7' || g === '8') return 20;      // Middle school - fast
  return 12;                                                // High school - very fast
}

export default function GigiLiveChat({ childId, childName, gradeLevel = '5', pageContext = 'dashboard' }: GigiLiveChatProps) {
  const { currentTheme } = useTheme();
  const router = useRouter();
  const gigiConfig = getGigiConfig(currentTheme.id as any);

  // COPPA Compliance - simple check
  const isUnder13 = checkUnder13(gradeLevel);

  // Use theme colors directly from context (already reactive to theme changes)
  const themeColors = {
    primary: currentTheme.colors.primary,
    secondary: currentTheme.colors.secondary,
    accent: currentTheme.colors.accent
  };

  // Typewriter speed based on kid's grade
  const typingSpeed = getTypingSpeed(gradeLevel);

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const [hasSpeakers, setHasSpeakers] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Detect speakers on mount
  useEffect(() => {
    async function detectSpeakers() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudio = devices.some(d => d.kind === 'audiooutput');
        setHasSpeakers(hasAudio);
        if (!hasAudio) setAudioEnabled(false);
      } catch (e) {
        console.log('Could not detect audio devices');
      }
    }
    detectSpeakers();
  }, []);

  // Auto-collapse chat when user scrolls to bottom of page (with debounce)
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const nearBottom = scrollTop + windowHeight >= documentHeight - 100;

        if (nearBottom && isExpanded) {
          setIsExpanded(false);
          setAutoCollapsed(true);
        } else if (!nearBottom && autoCollapsed) {
          setIsExpanded(true);
          setAutoCollapsed(false);
        }
      }, 100); // 100ms debounce prevents jitter
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [isExpanded, autoCollapsed]);

  // Typewriter effect for Gigi messages
  useEffect(() => {
    if (!typingMessageId) return;

    const message = messages.find(m => m.id === typingMessageId);
    if (!message || message.role !== 'gigi') return;

    const fullText = message.content;
    if (displayedText.length >= fullText.length) {
      // Done typing
      setTypingMessageId(null);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(fullText.slice(0, displayedText.length + 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingMessageId, displayedText, messages, typingSpeed]);

  // Scroll to bottom when messages change or typing updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages, displayedText]);

  // Speak text using TTS - with lock to prevent overlapping
  const speakText = useCallback(async (text: string) => {
    if (!audioEnabled || !hasSpeakers || isSpeaking) return;

    // Stop any currently playing audio first
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    setIsSpeaking(true);

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
          { type: 'audio/wav' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioEl = new Audio(audioUrl);
        currentAudioRef.current = audioEl;
        audioEl.onended = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          setIsSpeaking(false);
        };
        audioEl.onerror = () => {
          setIsSpeaking(false);
        };
        await audioEl.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  }, [audioEnabled, hasSpeakers, isSpeaking]);

  // No auto-greeting - just show placeholder prompt (no speech)
  // User initiates conversation by typing or speaking

  // Send message to Gigi
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // COPPA: Filter PII from message for under-13 users
    const safeContent = isUnder13 ? filterPII(text.trim()) : text.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: safeContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role === 'gigi' ? 'assistant' : 'user',
            content: m.content,
          })),
          childId,
          pageContext,
          isUnder13, // Pass COPPA flag to API for system prompt adjustment
        }),
      });

      const data = await response.json();

      const gigiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'gigi',
        content: data.message || "I'm not sure about that. Can you ask another way?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, gigiMessage]);

      // Start typewriter effect
      setDisplayedText('');
      setTypingMessageId(gigiMessage.id);

      // Speak response if audio enabled
      if (audioEnabled && hasSpeakers) {
        speakText(gigiMessage.content);
      }

      // Handle navigation action from Gigi
      if (data.action?.url) {
        // Wait a moment so they see/hear the message, then navigate
        setTimeout(() => {
          router.push(data.action.url);
        }, 1500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'gigi',
        content: "Oops! Something went wrong. Try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice input
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      sendMessage(text);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Match page content width - max-w-4xl (896px) same as kid dashboard */}
      <div className="w-full max-w-4xl mx-auto px-4 pointer-events-auto">
        {/* Collapse/Expand button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              setAutoCollapsed(false); // Manual click overrides auto behavior
            }}
            className="px-5 py-2 rounded-t-xl text-white text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
              boxShadow: `0 -2px 10px ${themeColors.primary}50`
            }}
          >
            <span className="text-lg">{gigiConfig.character}</span>
            <span>{gigiConfig.name}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="rounded-t-xl"
              style={{
                backgroundColor: '#000000',
                borderTop: `3px solid ${themeColors.primary}`,
                borderLeft: `3px solid ${themeColors.primary}`,
                borderRight: `3px solid ${themeColors.primary}`,
                boxShadow: `0 -4px 20px ${themeColors.primary}40`,
              }}
            >
            {/* Messages area - Only show Gigi's responses (cleaner UI) */}
            <div
              className="h-16 overflow-y-auto px-3 py-2"
              style={{ backgroundColor: '#000000' }}
            >
              {messages
                .filter(msg => msg.role === 'gigi')
                .slice(-2) // Only show last 2 Gigi messages
                .map((msg) => (
                <div key={msg.id} className="text-sm">
                  <p className="text-white">
                    <span style={{ color: themeColors.primary }} className="font-bold">
                      {gigiConfig.character}
                    </span>{' '}
                    {typingMessageId === msg.id ? displayedText : msg.content}
                    {typingMessageId === msg.id && <span className="animate-pulse">|</span>}
                  </p>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="text-sm">
                  <span style={{ color: themeColors.primary }} className="font-bold">
                    {gigiConfig.character} {gigiConfig.name}:
                  </span>
                  <span className="text-gray-400 ml-1 animate-pulse">thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div
              className="px-4 py-3"
              style={{
                background: `linear-gradient(to top, #000000, ${themeColors.primary}15)`,
                borderTop: `2px solid ${themeColors.primary}50`,
              }}
            >
              {/* Input row */}
              <div className="flex gap-2">
                {/* Speaker button - nice gradient */}
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-3 rounded-full transition-all hover:scale-105"
                  style={{
                    background: audioEnabled && hasSpeakers
                      ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`
                      : '#333333',
                    color: '#ffffff',
                    boxShadow: audioEnabled && hasSpeakers ? `0 2px 10px ${themeColors.primary}50` : 'none'
                  }}
                >
                  {audioEnabled && hasSpeakers ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                {/* Mic button - nice gradient */}
                <button
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-full transition-all hover:scale-105 ${isListening ? 'animate-pulse' : ''}`}
                  style={{
                    background: isListening
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                    color: '#ffffff',
                    boxShadow: `0 2px 10px ${isListening ? '#ef444450' : themeColors.primary + '50'}`
                  }}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Type to Gigi..."}
                  disabled={isListening}
                  className="flex-1 px-4 py-3 rounded-full text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: `2px solid ${themeColors.primary}60`,
                  }}
                />

                {/* Send button - nice gradient */}
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-full transition-all disabled:opacity-50 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                    color: '#fff',
                    boxShadow: `0 2px 10px ${themeColors.primary}50`
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
