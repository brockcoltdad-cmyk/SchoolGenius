'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Medal, Crown, TrendingUp, ArrowLeft, Star, Flame, Zap } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemedCard } from '@/components/theme/ThemedCard';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useThemedCurrency } from '@/lib/themed-currency';
import { AnimatedProgress } from '@/components/ui/animated-progress';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  streak: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export default function ThemedLeaderboard() {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;

  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'alltime'>('week');
  const [showCelebration, setShowCelebration] = useState(false);

  const isGamingTheme = ['victory', 'zombie', 'battle', 'wwe'].includes(currentTheme.id);

  // Mock leaderboard data - in production this would come from Supabase
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Alex Thunder', score: 2847, streak: 45, level: 32, avatar: '👑', isCurrentUser: false },
    { rank: 2, name: 'Sophia Star', score: 2654, streak: 38, level: 30, avatar: '⭐', isCurrentUser: false },
    { rank: 3, name: 'Marcus Storm', score: 2521, streak: 42, level: 29, avatar: '⚡', isCurrentUser: false },
    { rank: 47, name: 'Emma', score: 1247, streak: 12, level: 23, avatar: '💪', isCurrentUser: true },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getLeaderboardTitle = () => {
    const titles: Record<string, string> = {
      wwe: 'CHAMPIONSHIP RANKINGS',
      battle: 'WARRIOR LEADERBOARD',
      builder: 'BUILDER RANKINGS',
      pirate: 'PIRATE LEGENDS',
      zombie: 'SURVIVOR RANKINGS',
      anime: 'HERO RANKINGS',
      unicorn: 'MAGICAL LEADERBOARD',
      dinosaur: 'PREHISTORIC CHAMPIONS',
      space: 'GALACTIC RANKINGS',
    };
    return titles[currentTheme.id] || `${currentTheme.name.toUpperCase()} LEADERBOARD`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-400" />;
    return <span className="text-lg font-black">{rank}</span>;
  };

  const currentUser = leaderboardData.find(e => e.isCurrentUser);

  const BackgroundWrapper = isGamingTheme ? 'div' : ThemedBackground;
  const backgroundProps = isGamingTheme ? {
    className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2a1f3a]"
  } : {};

  return (
    <BackgroundWrapper {...backgroundProps}>
      {isGamingTheme && (
        <>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }} />
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px] opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        </>
      )}

      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 font-bold transition-colors ${isGamingTheme ? 'text-purple-400 hover:text-purple-300' : ''}`}
            style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </motion.div>

        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <motion.h1
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-5xl md:text-7xl font-black mb-4 ${isGamingTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500' : ''}`}
                style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}
              >
                {getLeaderboardTitle()}
              </motion.h1>
              <p className={`text-xl ${isGamingTheme ? 'text-purple-300' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                Compete with {currentTheme.name} students worldwide!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {currentUser && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <ThemedCard
              className={
                isGamingTheme
                  ? "bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl rounded-3xl p-6 border-4 border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.5)]"
                  : "p-6"
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    {currentUser.avatar}
                  </motion.div>
                  <div>
                    <div className={`text-sm font-bold ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                      YOUR RANK
                    </div>
                    <div className={`text-3xl font-black ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                      #{currentUser.rank}
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${isGamingTheme ? 'text-green-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.accent } : {}}>
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-bold">+3 this week!</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <div className={`text-sm ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                      {currency.name}
                    </div>
                    <div className={`text-2xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                      {currentUser.score}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <Flame className={`h-5 w-5 mx-auto ${isGamingTheme ? 'text-red-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.accent } : {}} />
                      <div className={`text-lg font-black ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                        {currentUser.streak}
                      </div>
                      <div className={`text-xs ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                        streak
                      </div>
                    </div>
                    <div className="text-center">
                      <Star className={`h-5 w-5 mx-auto ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}} />
                      <div className={`text-lg font-black ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                        {currentUser.level}
                      </div>
                      <div className={`text-xs ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                        level
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ThemedCard>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex gap-2 justify-center">
            {(['today', 'week', 'month', 'alltime'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  timeFilter === filter
                    ? isGamingTheme
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                      : 'text-white'
                    : isGamingTheme
                      ? 'bg-black/40 text-gray-400 hover:bg-black/60'
                      : 'bg-white/20'
                }`}
                style={!isGamingTheme && timeFilter === filter ? {
                  backgroundColor: currentTheme.colors.primary,
                  color: '#ffffff'
                } : !isGamingTheme ? {
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  color: currentTheme.colors.text
                } : {}}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <ThemedCard
                className={
                  entry.isCurrentUser
                    ? isGamingTheme
                      ? "bg-gradient-to-r from-yellow-900/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-5 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                      : "p-5 border-4"
                    : isGamingTheme
                      ? entry.rank <= 3
                        ? "bg-gradient-to-r from-black/60 to-purple-900/40 backdrop-blur-xl rounded-2xl p-5 border-2 border-purple-500/50"
                        : "bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/10"
                      : "p-5"
                }
                style={!isGamingTheme && entry.isCurrentUser ? {
                  borderColor: currentTheme.colors.primary,
                  boxShadow: `0 0 20px ${currentTheme.colors.primary}40`
                } : {}}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 text-center ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                    {getRankBadge(entry.rank)}
                  </div>

                  <motion.div
                    animate={entry.rank <= 3 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    {entry.avatar}
                  </motion.div>

                  <div className="flex-1">
                    <div className={`font-black text-lg ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                      {entry.name}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className={`text-sm ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                        Level {entry.level}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${isGamingTheme ? 'text-red-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.accent } : {}}>
                        <Flame className="h-4 w-4" />
                        {entry.streak} day streak
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                      {entry.score.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isGamingTheme ? 'text-purple-300' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                      {currency.name}
                    </div>
                  </div>

                  {entry.rank <= 3 && (
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className={`h-8 w-8 ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`} />
                    </motion.div>
                  )}
                </div>
              </ThemedCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <ThemedCard
            className={
              isGamingTheme
                ? "bg-gradient-to-br from-black/60 to-purple-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50"
                : "p-6"
            }
          >
            <div className={`text-center mb-4 text-lg font-bold ${isGamingTheme ? 'text-purple-300' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
              🔥 Live Stats
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-3xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                  2,847
                </div>
                <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  Students Online
                </div>
              </div>
              <div>
                <div className={`text-3xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                  156
                </div>
                <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  Active Today
                </div>
              </div>
              <div>
                <div className={`text-3xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                  TOP 2%
                </div>
                <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  Your Ranking
                </div>
              </div>
            </div>
          </ThemedCard>
        </motion.div>
      </div>

      {isGamingTheme && (
        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
          }
        `}</style>
      )}
    </BackgroundWrapper>
  );
}
