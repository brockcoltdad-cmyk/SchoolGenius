'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { useThemedCurrency } from '@/lib/themed-currency';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemedCard } from '@/components/theme/ThemedCard';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';

function BadgeCard({ badge, index }: { badge: any; index: number }) {
  const { currentTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateYVal = ((e.clientX - centerX) / rect.width) * 15;
    const rotateXVal = ((centerY - e.clientY) / rect.height) * 15;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, y: 30, rotateX: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', damping: 12 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <ThemedCard
        className="p-6 text-center relative overflow-hidden cursor-pointer"
      >
        {/* Shimmer effect for unlocked badges */}
        {badge.unlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}

        {/* Holographic effect on hover */}
        {badge.unlocked && (
          <motion.div
            animate={isHovered ? { opacity: [0.2, 0.4, 0.2] } : { opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, transparent 30%, ${currentTheme.colors.primary}33 50%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Badge Icon */}
        <motion.div
          className="mb-4 text-7xl relative"
          animate={isHovered ? {
            scale: 1.2,
            rotateZ: [0, -10, 10, 0],
          } : {
            scale: [1, 1.05, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: isHovered ? 0.5 : 3,
            repeat: Infinity,
            repeatDelay: !isHovered ? 2 : 0,
          }}
          style={{ transform: 'translateZ(40px)' }}
        >
          {badge.emoji}
        </motion.div>

        {/* Badge Name */}
        <h3 className="mb-2 text-xl font-bold" style={{ color: currentTheme.colors.text, transform: 'translateZ(30px)' }}>
          {badge.name}
        </h3>

        {/* Badge Status */}
        <motion.p
          className="text-sm font-semibold text-green-600"
          animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
          style={{ transform: 'translateZ(20px)' }}
        >
          {badge.date}
        </motion.p>

        {/* Sparkle burst on hover for unlocked badges */}
        <AnimatePresence>
          {badge.unlocked && isHovered && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 80,
                    y: Math.sin(i * 45 * Math.PI / 180) * 80,
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                >
                  <Sparkles className="w-4 h-4" style={{ color: currentTheme.colors.accent }} />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Glow effect for unlocked badges on hover */}
        {badge.unlocked && (
          <motion.div
            animate={isHovered ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            } : { opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-xl blur-2xl -z-10 pointer-events-none"
            style={{ background: currentTheme.colors.primary }}
          />
        )}
      </ThemedCard>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const params = useParams();
  const kidId = params.id as string;
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // All achievements are unlocked - explore freely!
  const badges = [
    { id: '1', name: 'First Lesson', emoji: '🎓', unlocked: true, date: 'Ready to earn!' },
    { id: '2', name: '7 Day Streak', emoji: '🔥', unlocked: true, date: 'Ready to earn!' },
    { id: '3', name: `100 ${currency.name}`, emoji: currency.icon, unlocked: true, date: 'Ready to earn!' },
    { id: '4', name: 'Bookworm', emoji: '📚', unlocked: true, date: 'Ready to earn!' },
    { id: '5', name: 'Math Master', emoji: '🧮', unlocked: true, date: 'Ready to earn!' },
    { id: '6', name: 'Perfect Week', emoji: '⭐', unlocked: true, date: 'Ready to earn!' },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        if (Math.random() > 0.7) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: -50,
          });
        }
        return newParticles.slice(-8);
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

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
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute pointer-events-none z-0"
            >
              <Trophy className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="min-h-screen pb-24 relative z-10">
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <Link
                href={`/kid/${kidId}`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <GigiCharacter size="lg" showName={false} className="mb-4" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-2 text-5xl font-bold drop-shadow-lg"
                  style={{ color: currentTheme.colors.primary }}
                >
                  <motion.span
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    🏆
                  </motion.span>
                  {' '}My Achievements
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  Collect badges as you learn!
                </motion.p>

                {/* Progress Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 inline-flex items-center gap-3 px-8 py-4 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}40, ${currentTheme.colors.accent}40)`,
                    boxShadow: `0 8px 32px ${currentTheme.colors.primary}30`,
                  }}
                >
                  <Trophy className="w-8 h-8" style={{ color: currentTheme.colors.primary }} />
                  <div>
                    <p className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                      {unlockedCount} / {badges.length}
                    </p>
                    <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                      Badges Unlocked
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {badges.map((badge, i) => (
                  <BadgeCard key={badge.id} badge={badge} index={i} />
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
