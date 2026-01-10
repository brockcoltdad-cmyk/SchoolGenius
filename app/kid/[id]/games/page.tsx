'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lock, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import GigiCharacter from '@/components/animations/GigiCharacter';
import PageTransition from '@/components/animations/PageTransition';
import { useThemedCurrency } from '@/lib/themed-currency';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemedCard } from '@/components/theme/ThemedCard';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';

const games = [
  { id: '1', name: 'Math Race', emoji: '🏎️', coins: 50 },
  { id: '2', name: 'Word Builder', emoji: '🏗️', coins: 30 },
  { id: '3', name: 'Spell Check', emoji: '✨', coins: 40 },
  { id: '4', name: 'Number Ninja', emoji: '🥷', coins: 50 },
];

function GameCard({ game, index }: { game: typeof games[0]; index: number }) {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateYVal = ((e.clientX - centerX) / rect.width) * 20;
    const rotateXVal = ((centerY - e.clientY) / rect.height) * 20;
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
      initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: -20 }}
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
      whileTap={{ scale: 0.95 }}
    >
      <ThemedCard className="relative overflow-hidden p-8 text-center cursor-pointer">
        {/* Holographic effect */}
        <motion.div
          animate={isHovered ? { opacity: [0.2, 0.4, 0.2] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, transparent 30%, ${currentTheme.colors.primary}33 50%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Coming Soon Badge */}
        <motion.div
          className="absolute top-3 right-3 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
        >
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 shadow-lg">
            <Lock className="h-3 w-3 text-yellow-700" />
            <span className="text-xs font-bold text-yellow-700">Coming Soon</span>
          </div>
        </motion.div>

        {/* Game Icon */}
        <motion.div
          className="mb-4 text-8xl relative"
          animate={isHovered ? {
            scale: 1.15,
            rotateZ: [0, -5, 5, 0],
          } : {
            rotate: [0, -5, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: isHovered ? 0 : 3,
          }}
          style={{ transform: 'translateZ(40px)' }}
        >
          {game.emoji}
        </motion.div>

        {/* Game Title */}
        <h3 className="mb-2 text-2xl font-bold drop-shadow-md" style={{ color: currentTheme.colors.text, transform: 'translateZ(30px)' }}>
          {game.name}
        </h3>

        {/* Reward Info */}
        <motion.div
          className="mb-4 flex items-center justify-center gap-2"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
          style={{ transform: 'translateZ(20px)' }}
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-yellow-700">
            Earn up to
            <motion.span
              className="text-2xl"
              animate={{
                rotate: isHovered ? [0, 360] : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              {currency.icon}
            </motion.span>
            {game.coins} {currency.name.toLowerCase()}!
          </p>
        </motion.div>

        {/* Floating Stars */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 80,
                    y: Math.sin(i * 60 * Math.PI / 180) * 80,
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Button */}
        <button
          disabled
          className="w-full rounded-xl py-3 font-bold opacity-50 relative overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
            color: 'white',
            transform: 'translateZ(10px)'
          }}
        >
          Coming Soon
        </button>

        {/* Glow effect on hover */}
        <motion.div
          animate={isHovered ? {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl blur-2xl -z-10 pointer-events-none"
          style={{ background: currentTheme.colors.primary }}
        />
      </ThemedCard>
    </motion.div>
  );
}

export default function GamesPage() {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const params = useParams();
  const kidId = params.id as string;
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

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
        return newParticles.slice(-10);
      });
    }, 1000);

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
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute pointer-events-none z-0"
            >
              <Sparkles className="w-5 h-5" style={{ color: currentTheme.colors.accent }} />
            </motion.div>
          ))}
        </AnimatePresence>

        <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl relative z-10">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Link
              href={`/kid/${kidId}`}
              className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
              style={{ color: currentTheme.colors.primary }}
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-3, 3, -3],
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
                className="text-5xl font-bold drop-shadow-lg"
                style={{ color: currentTheme.colors.primary }}
              >
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  🎮
                </motion.span>
                {' '}Learning Games
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-xl"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                Play fun games and earn {currency.name.toLowerCase()}!
              </motion.p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {games.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>
          </motion.div>
        </main>
      </ThemedBackground>
    </PageTransition>
  );
}
