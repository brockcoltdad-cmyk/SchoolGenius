'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Rocket, Sparkles, Star, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import GigiCharacter from '@/components/animations/GigiCharacter';
import PageTransition from '@/components/animations/PageTransition';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemedCard } from '@/components/theme/ThemedCard';
import { ThemedButton } from '@/components/theme/ThemedButton';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';

export default function StartDayPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        if (Math.random() > 0.6) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: -50,
          });
        }
        return newParticles.slice(-15);
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1000);
  };

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        {/* Floating Particles */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
              animate={{ y: window.innerHeight + 50, opacity: 0, scale: 0.5, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
              className="absolute pointer-events-none z-0"
            >
              <Sparkles className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="max-w-2xl text-center"
          >
            {/* Mascot with floating animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mb-6"
            >
              <GigiCharacter size="xl" showName={false} />
            </motion.div>

            {/* Greeting with text shadow and glow */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-5xl font-bold drop-shadow-lg"
              style={{ color: currentTheme.colors.primary }}
            >
              Good morning, Emma!
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block ml-2"
              >
                🌟
              </motion.span>
            </motion.h1>

            {/* Streak counter with flame animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.accent}40, ${currentTheme.colors.primary}40)`,
                boxShadow: `0 8px 32px ${currentTheme.colors.primary}30`,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame className="w-6 h-6 text-orange-500" />
              </motion.div>
              <p className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                12-day streak! Keep it going!
              </p>
            </motion.div>

            {/* Today's Adventure Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="mb-8"
            >
              <ThemedCard className="p-8 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br opacity-10"
                  style={{
                    background: `radial-gradient(circle at top right, ${currentTheme.colors.primary}, transparent)`,
                  }}
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <h2 className="mb-6 text-3xl font-bold" style={{ color: currentTheme.colors.primary }}>
                  Today&apos;s Adventure
                </h2>
                <div className="space-y-4 text-left">
                  {[
                    { emoji: '📐', subject: 'Math', time: '30 minutes', delay: 0.5 },
                    { emoji: '📚', subject: 'Reading', time: '30 minutes', delay: 0.6 },
                    { emoji: '✍️', subject: 'Writing', time: '20 minutes', delay: 0.7 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: item.delay }}
                      whileHover={{ x: 10, scale: 1.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(to right, ${currentTheme.colors.primary}20, transparent)`,
                      }}
                    >
                      <motion.span
                        animate={{
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="text-4xl"
                      >
                        {item.emoji}
                      </motion.span>
                      <div className="flex-1">
                        <p className="font-bold text-lg" style={{ color: currentTheme.colors.text }}>
                          {item.subject}
                        </p>
                        <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          {item.time}
                        </p>
                      </div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  ))}
                </div>
              </ThemedCard>
            </motion.div>

            {/* Start Button with burst effect */}
            <Link href={`/kid/${kidId}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartClick}
                className="relative inline-block"
              >
                <ThemedButton
                  size="lg"
                  className="px-12 py-8 text-2xl font-bold shadow-2xl relative z-10"
                >
                  <Rocket className="mr-3 h-8 w-8" />
                  Let&apos;s Start Learning!
                </ThemedButton>

                {/* Glow effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl blur-xl -z-10"
                  style={{ background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                />

                {/* Burst particles on click */}
                <AnimatePresence>
                  {showBurst && (
                    <>
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            x: Math.cos(i * 30 * Math.PI / 180) * 100,
                            y: Math.sin(i * 30 * Math.PI / 180) * 100,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                          style={{ background: currentTheme.colors.accent }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
