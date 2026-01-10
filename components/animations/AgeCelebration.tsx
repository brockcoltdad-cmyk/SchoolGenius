'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Star, Zap, Trophy, Award, Crown } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import Confetti from './Confetti';

interface AgeCelebrationProps {
  show: boolean;
  grade: string;
  message?: string;
  onComplete?: () => void;
}

export default function AgeCelebration({ show, grade, message = 'Amazing!', onComplete }: AgeCelebrationProps) {
  const { currentTheme } = useTheme();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      const gradeNum = getGradeNumber(grade);
      if (gradeNum <= 2) {
        setShowConfetti(true);
      }

      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(timer);
        setShowConfetti(false);
      };
    }
  }, [show, onComplete, grade]);

  const getGradeNumber = (gradeStr: string): number => {
    if (gradeStr.toLowerCase().startsWith('k')) return 0;
    const match = gradeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 5;
  };

  const gradeNum = getGradeNumber(grade);

  const renderK2Celebration = () => (
    <>
      <Confetti active={showConfetti} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, x: '50vw', y: '50vh' }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1, 0],
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 2, delay: particle.delay }}
            className="absolute text-4xl"
          >
            {['🎉', '⭐', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative z-10 rounded-3xl p-12 text-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.8 }}
            className="mb-6 text-9xl"
          >
            {currentTheme.mascot}
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-6xl font-black text-white drop-shadow-lg"
          >
            {message}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white/90"
          >
            You're a superstar!
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="mt-6 text-5xl"
          >
            🎊 🎈 🎁 🎉
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );

  const renderGrade35Celebration = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: -100 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative overflow-hidden rounded-2xl p-10 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mb-4 flex justify-center"
          >
            <div className="rounded-full bg-white/20 p-4">
              <Trophy className="h-20 w-20 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-4 text-7xl"
          >
            {currentTheme.mascot}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="mb-2 text-4xl font-black uppercase text-white drop-shadow-lg">
              ACHIEVEMENT UNLOCKED!
            </h2>
            <p className="text-2xl font-bold text-white/90">{message}</p>
          </motion.div>

          <motion.div
            className="mt-6 flex justify-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <Star className="h-8 w-8 fill-white text-white drop-shadow-md" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderGrade68Celebration = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -50 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mb-4 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background: `radial-gradient(circle, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                }}
              />
              <div className="relative rounded-full bg-slate-900 p-4">
                <Zap className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-4 text-6xl"
          >
            {currentTheme.mascot}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2
              className="mb-2 text-3xl font-black"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {message}
            </h2>
            <p className="text-sm font-medium text-slate-400">Nice work!</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderGrade912Celebration = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900"
      >
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: currentTheme.colors.primary + '20' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2, type: 'spring' }}
            >
              <Award className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{message}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Task completed</p>
            <motion.div
              className="mt-2 h-1 rounded-full"
              style={{ backgroundColor: currentTheme.colors.primary }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {show && (
        <>
          {gradeNum <= 2 && renderK2Celebration()}
          {gradeNum >= 3 && gradeNum <= 5 && renderGrade35Celebration()}
          {gradeNum >= 6 && gradeNum <= 8 && renderGrade68Celebration()}
          {gradeNum >= 9 && renderGrade912Celebration()}
        </>
      )}
    </AnimatePresence>
  );
}
