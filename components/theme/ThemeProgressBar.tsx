'use client';

import { motion } from 'framer-motion';
import { Zap, Trophy } from 'lucide-react';

interface ThemeProgressBarProps {
  xp: number;
  level: number;
  maxXp?: number;
  showStats?: boolean;
  completedTasks?: number;
}

export function ThemeProgressBar({
  xp,
  level,
  maxXp = 1000,
  showStats = true,
  completedTasks = 0,
}: ThemeProgressBarProps) {
  const progress = (xp % maxXp) / maxXp * 100;

  return (
    <div className="w-full">
      {showStats && (
        <div className="flex gap-4 justify-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative px-6 py-3 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl border-2 border-yellow-500/50 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-3 -right-3"
            >
              <Trophy className="w-6 h-6 text-yellow-400 filter drop-shadow-lg" />
            </motion.div>
            <div className="text-2xl font-black text-yellow-400">{completedTasks}</div>
            <div className="text-xs text-yellow-200">Tasks</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative px-6 py-3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border-2 border-purple-500/50 shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-3 -right-3"
            >
              <Zap className="w-6 h-6 text-purple-400 filter drop-shadow-lg" />
            </motion.div>
            <div className="text-2xl font-black text-purple-400">{xp}</div>
            <div className="text-xs text-purple-200">XP</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative px-6 py-3 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl border-2 border-blue-500/50 shadow-2xl"
          >
            <motion.div
              animate={{
                textShadow: [
                  '0 0 10px rgba(59, 130, 246, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.8)',
                  '0 0 10px rgba(59, 130, 246, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl font-black text-blue-400"
            >
              {level}
            </motion.div>
            <div className="text-xs text-blue-200">Level</div>
          </motion.div>
        </div>
      )}

      {/* XP Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative h-8 bg-black/50 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-2xl">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20 }}
            className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ width: '50%' }}
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-lg">
            {xp % maxXp} / {maxXp} XP
          </div>
        </div>

        {/* Next Level Text */}
        <div className="text-center mt-2 text-sm font-semibold text-white/70">
          Next level: {level + 1}
        </div>
      </motion.div>
    </div>
  );
}
