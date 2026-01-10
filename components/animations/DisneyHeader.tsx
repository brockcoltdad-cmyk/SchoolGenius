'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Flame, Sparkles, Crown, Zap, Star } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { useTheme } from '@/lib/theme-context';
import { useThemedCurrency } from '@/lib/themed-currency';

interface DisneyHeaderProps {
  childName: string;
  coins: number;
  streakDays: number;
}

export default function DisneyHeader({ childName, coins, streakDays }: DisneyHeaderProps) {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const isBattle = currentTheme.id === 'battle';

  const [isHovering, setIsHovering] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [0, 1000], [-20, 20]);
  const parallaxY = useTransform(mouseY, [0, 1000], [-10, 10]);

  const smoothParallaxX = useSpring(parallaxX, { stiffness: 50, damping: 20 });
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Sparkle effect on hover
  useEffect(() => {
    if (isHovering) {
      const interval = setInterval(() => {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 800);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  if (isBattle) {
    return (
      <header className="relative z-10 overflow-hidden border-b-4 border-red-500/40 bg-gradient-to-r from-zinc-900/95 via-stone-900/95 to-zinc-900/95 backdrop-blur-xl">
        {/* Animated tactical scanlines */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.1) 2px, rgba(239, 68, 68, 0.1) 4px)',
          }}
          animate={{ backgroundPositionY: ['0px', '4px'] }}
          transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
        />

        {/* Glowing energy waves */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="mx-auto max-w-7xl px-4 py-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Left: Character and Name with Disney Magic */}
            <motion.div
              className="flex items-center gap-4"
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              {/* Animated Mascot with Personality */}
              <motion.div className="relative">
                {/* Glow ring behind mascot */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(239, 68, 68, 0.4)',
                      '0 0 40px rgba(239, 68, 68, 0.6)',
                      '0 0 20px rgba(239, 68, 68, 0.4)',
                    ],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Rotating battle ring */}
                <motion.div
                  className="absolute -inset-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-full h-full border-2 border-dashed border-red-500/30 rounded-full" />
                </motion.div>

                {/* Main Mascot Character */}
                <motion.div
                  className="relative text-7xl cursor-pointer"
                  style={{ x: smoothParallaxX, y: smoothParallaxY }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, -5, 5, 0],
                    transition: { duration: 0.6, type: 'spring', stiffness: 300 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: isHovering ? [-5, 5, -5] : [0, -8, 0],
                    rotate: isHovering ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 2, repeat: Infinity }
                  }}
                >
                  <motion.span
                    animate={{
                      filter: [
                        'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))',
                        'drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))',
                        'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentTheme.mascot}
                  </motion.span>
                </motion.div>

                {/* Impact effects around mascot */}
                <AnimatePresence>
                  {isHovering && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{
                            scale: [0, 1.5],
                            opacity: [1, 0],
                            x: Math.cos((i * Math.PI * 2) / 8) * 50,
                            y: Math.sin((i * Math.PI * 2) / 8) * 50,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          style={{
                            top: '50%',
                            left: '50%',
                          }}
                        >
                          <Zap className="w-4 h-4 text-amber-400" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Name Section with Animation */}
              <div className="relative">
                {/* Title Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-1"
                >
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-600/30 to-amber-600/30 rounded-full border border-red-500/50"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(239, 68, 68, 0.3)',
                        '0 0 20px rgba(239, 68, 68, 0.5)',
                        '0 0 10px rgba(239, 68, 68, 0.3)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-200 tracking-wider">WARRIOR</span>
                  </motion.div>
                </motion.div>

                {/* Name with Letter Animation */}
                <motion.h1
                  className="text-3xl font-black text-white relative"
                  style={{ WebkitTextStroke: '1px rgba(0,0,0,0.3)' }}
                >
                  {childName.toUpperCase().split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        textShadow: [
                          '0 0 20px rgba(239, 68, 68, 0.8)',
                          '0 0 40px rgba(245, 158, 11, 0.8)',
                          '0 0 20px rgba(239, 68, 68, 0.8)',
                        ]
                      }}
                      transition={{
                        delay: i * 0.05,
                        textShadow: { duration: 2, repeat: Infinity }
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.2,
                        color: '#FDE047',
                        transition: { duration: 0.2 }
                      }}
                      className="inline-block cursor-pointer"
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.div
                  className="text-sm font-bold text-red-300 tracking-wide mt-1"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  &apos;S DASHBOARD
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Stats with WWE-style Cards */}
            <div className="flex items-center gap-4">
              {/* Coins Display - WWE Style */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-4 border-amber-500 rounded-xl p-4 shadow-[0_0_30px_rgba(251,191,36,0.6)]"
              >
                <div className="text-amber-400 font-black text-3xl">
                  <AnimatedCounter value={coins} />
                </div>
                <div className="text-amber-500 font-bold text-xs">{currency.name.toUpperCase()}</div>
              </motion.div>

              {/* Streak Display - WWE Style */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center bg-gradient-to-br from-red-500/20 to-red-600/20 border-4 border-red-500 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.6)]"
              >
                <Flame className="h-8 w-8 text-red-500 mx-auto mb-1" />
                <div className="text-white font-black text-2xl">{streakDays}</div>
                <div className="text-red-400 font-bold text-xs">DAY STREAK</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom accent line with animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 10px rgba(239, 68, 68, 0.5)',
              '0 0 20px rgba(239, 68, 68, 0.8)',
              '0 0 10px rgba(239, 68, 68, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </header>
    );
  }

  // Default theme header (WWE-style scoreboard)
  return (
    <header className="relative z-10 overflow-hidden backdrop-blur-xl py-4" style={{
      background: `linear-gradient(135deg, ${currentTheme.colors.primary}10, ${currentTheme.colors.secondary}10)`
    }}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Main Header Row */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-4"
        >
          {/* Left: Character Identity */}
          <div className="flex items-center gap-4">
            <motion.div
              className="text-6xl cursor-pointer"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentTheme.mascot}
            </motion.div>
            <div>
              <div className="text-sm font-bold tracking-widest uppercase" style={{ color: currentTheme.colors.accent }}>
                {currentTheme.name} CHAMPION
              </div>
              <div className="text-4xl font-black tracking-tight" style={{
                color: currentTheme.colors.text,
                textShadow: `2px 2px 0px ${currentTheme.colors.primary}40`
              }}>
                {childName.toUpperCase()}
              </div>
              <div className="font-bold" style={{ color: currentTheme.colors.primary }}>
                ULTIMATE LEARNER
              </div>
            </div>
          </div>

          {/* Right: Stats Cards */}
          <div className="flex gap-4">
            {/* Currency Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center rounded-xl p-4 border-4"
              style={{
                background: `linear-gradient(to bottom right, ${currentTheme.colors.accent}20, ${currentTheme.colors.accent}10)`,
                borderColor: currentTheme.colors.accent,
                boxShadow: `0 0 30px ${currentTheme.colors.accent}40`
              }}
            >
              <div className="font-black text-3xl" style={{ color: currentTheme.colors.accent }}>
                <AnimatedCounter value={coins} />
              </div>
              <div className="font-bold text-xs" style={{ color: currentTheme.colors.accent }}>
                {currency.name.toUpperCase()}
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center rounded-xl p-4 border-4"
              style={{
                background: `linear-gradient(to bottom right, ${currentTheme.colors.primary}20, ${currentTheme.colors.primary}10)`,
                borderColor: currentTheme.colors.primary,
                boxShadow: `0 0 30px ${currentTheme.colors.primary}40`
              }}
            >
              <Flame className="h-8 w-8 mx-auto mb-1" style={{ color: currentTheme.colors.primary }} />
              <div className="text-white font-black text-2xl">{streakDays}</div>
              <div className="font-bold text-xs" style={{ color: currentTheme.colors.primary }}>
                DAY STREAK
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
