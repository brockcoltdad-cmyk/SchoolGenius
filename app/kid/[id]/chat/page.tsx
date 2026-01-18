'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send, Loader2, Sparkles, BookOpen, Calculator, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import GigiCharacter, { getGigiConfig } from '@/components/animations/GigiCharacter';
import PageTransition from '@/components/animations/PageTransition';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: 'library' | 'claude';
}

export default function ChatPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;
  const gigiConfig = getGigiConfig(currentTheme.id as any);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick prompt suggestions - themed colors
  const quickPrompts = [
    { icon: Calculator, text: 'Help me with math' },
    { icon: BookOpen, text: 'Explain a reading concept' },
    { icon: Pencil, text: 'Help me with spelling' },
    { icon: Sparkles, text: 'Quiz me on something' },
  ];

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          childId: kidId
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        source: data.source
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I'm having a little trouble right now. Can you try asking again?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageTransition>
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, #0a0a0a 50%, ${currentTheme.colors.secondary}15 100%)`
        }}
      >
        {/* Themed overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${currentTheme.colors.primary}20 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${currentTheme.colors.secondary}20 0%, transparent 50%)`
          }}
        />

        <div className="min-h-screen relative z-10 flex flex-col">
          {/* Header */}
          <header
            className="border-b backdrop-blur-xl"
            style={{
              borderColor: `${currentTheme.colors.primary}30`,
              background: `${currentTheme.colors.primary}10`
            }}
          >
            <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
              <Link
                href={`/kid/${kidId}`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  }}
                >
                  {gigiConfig.character}
                </div>
                <span className="font-bold" style={{ color: currentTheme.colors.primary }}>
                  Chat with {gigiConfig.name}
                </span>
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <main className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 ? (
                // Welcome state
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <GigiCharacter size="lg" showName={false} showGreeting={false} className="mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {gigiConfig.greeting}
                  </h2>
                  <p className="mb-8" style={{ color: currentTheme.colors.textSecondary || '#888' }}>
                    Ask me anything about your lessons, or just chat!
                  </p>

                  {/* Quick prompts - themed */}
                  <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {quickPrompts.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => handleSend(prompt.text)}
                        className="p-4 rounded-xl text-white font-medium text-left flex items-center gap-3 hover:scale-[1.02] transition-transform shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                          boxShadow: `0 4px 20px ${currentTheme.colors.primary}40`
                        }}
                      >
                        <prompt.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{prompt.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                // Message list
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                              }}
                            >
                              <span className="text-xs">{gigiConfig.character}</span>
                            </div>
                            <span className="text-xs" style={{ color: currentTheme.colors.primary }}>
                              {gigiConfig.name} {message.source === 'library' && '(instant)'}
                            </span>
                          </div>
                        )}
                        <Card
                          className="p-4 text-white"
                          style={{
                            background: message.role === 'user'
                              ? `linear-gradient(135deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.primary})`
                              : `${currentTheme.colors.primary}20`,
                            border: message.role === 'assistant' ? `1px solid ${currentTheme.colors.primary}40` : 'none',
                            boxShadow: message.role === 'user' ? `0 4px 15px ${currentTheme.colors.primary}30` : 'none'
                          }}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{
                      background: `${currentTheme.colors.primary}20`,
                      border: `1px solid ${currentTheme.colors.primary}40`
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                      }}
                    >
                      <span className="text-xs">{gigiConfig.character}</span>
                    </div>
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: currentTheme.colors.primary }}
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: currentTheme.colors.primary }}
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: currentTheme.colors.primary }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="border-t backdrop-blur-xl p-4"
              style={{
                borderColor: `${currentTheme.colors.primary}30`,
                background: `linear-gradient(to top, #000, ${currentTheme.colors.primary}10)`
              }}
            >
              <div className="max-w-4xl mx-auto flex gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${gigiConfig.name} anything...`}
                  rows={1}
                  className="flex-1 rounded-xl px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2"
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    background: '#1a1a1a',
                    border: `2px solid ${currentTheme.colors.primary}50`,
                  }}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="text-white px-4 rounded-xl disabled:opacity-50 transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                    boxShadow: `0 4px 15px ${currentTheme.colors.primary}50`
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
