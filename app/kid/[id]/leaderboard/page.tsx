'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Medal, Crown, TrendingUp, ArrowLeft, Star, Flame, Zap, Users, User } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemedCard } from '@/components/theme/ThemedCard';
import { useThemedCurrency } from '@/lib/themed-currency';
import { createClient } from '@/lib/supabase/client';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  streak: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
  isSibling?: boolean;
}

interface ChildData {
  id: string;
  name: string;
  coins: number;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  avatar_url?: string;
  grade_level: string;
}

export default function ThemedLeaderboard() {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const supabase = createClient();

  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'alltime'>('week');
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentChild, setCurrentChild] = useState<ChildData | null>(null);
  const [siblings, setSiblings] = useState<ChildData[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  const isGamingTheme = ['victory', 'zombie', 'battle', 'wwe'].includes(currentTheme.id);

  // Fetch real data from database
  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        // Get current child's data
        const { data: child, error: childError } = await supabase
          .from('children')
          .select('id, name, coins, xp, level, current_streak, longest_streak, avatar_url, grade_level, parent_id')
          .eq('id', kidId)
          .single();

        if (childError) throw childError;
        setCurrentChild(child);

        // Get siblings (same parent, different child)
        const { data: siblingData, error: siblingError } = await supabase
          .from('children')
          .select('id, name, coins, xp, level, current_streak, longest_streak, avatar_url, grade_level')
          .eq('parent_id', child.parent_id)
          .neq('id', kidId);

        if (!siblingError && siblingData) {
          setSiblings(siblingData);
        }

        // Build leaderboard entries
        const entries: LeaderboardEntry[] = [];

        // Add current child
        entries.push({
          rank: 0, // Will be calculated
          name: child.name,
          score: child.coins || 0,
          streak: child.current_streak || 0,
          level: child.level || 1,
          avatar: getAvatarEmoji(child.name),
          isCurrentUser: true
        });

        // Add siblings
        if (siblingData) {
          siblingData.forEach(sibling => {
            entries.push({
              rank: 0,
              name: sibling.name,
              score: sibling.coins || 0,
              streak: sibling.current_streak || 0,
              level: sibling.level || 1,
              avatar: getAvatarEmoji(sibling.name),
              isSibling: true
            });
          });
        }

        // Sort by score and assign ranks
        entries.sort((a, b) => b.score - a.score);
        entries.forEach((entry, index) => {
          entry.rank = index + 1;
        });

        setLeaderboardData(entries);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboardData();
  }, [kidId, supabase]);

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getAvatarEmoji = (name: string) => {
    const emojis = ['💪', '⭐', '🔥', '⚡', '🚀', '👑', '🌟', '💎'];
    const index = name.charCodeAt(0) % emojis.length;
    return emojis[index];
  };

  const getLeaderboardTitle = () => {
    if (siblings.length === 0) {
      return 'MY PROGRESS';
    }
    const titles: Record<string, string> = {
      wwe: 'FAMILY CHAMPIONSHIP',
      battle: 'FAMILY WARRIORS',
      builder: 'FAMILY BUILDERS',
      pirate: 'FAMILY PIRATES',
      zombie: 'FAMILY SURVIVORS',
      anime: 'FAMILY HEROES',
      unicorn: 'FAMILY MAGIC',
      dinosaur: 'FAMILY DINOS',
      space: 'FAMILY EXPLORERS',
    };
    return titles[currentTheme.id] || 'FAMILY LEADERBOARD';
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

  if (loading) {
    return (
      <BackgroundWrapper {...backgroundProps}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white font-bold">Loading leaderboard...</p>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

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
                {siblings.length > 0
                  ? `Compete with your family in ${currentTheme.name}!`
                  : `Track your personal progress in ${currentTheme.name}!`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current User Stats Card */}
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
                      {siblings.length > 0 ? 'YOUR FAMILY RANK' : 'YOUR STATS'}
                    </div>
                    <div className={`text-3xl font-black ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                      {siblings.length > 0 ? `#${currentUser.rank}` : currentUser.name}
                    </div>
                    {currentChild && currentChild.longest_streak > currentChild.current_streak && (
                      <div className={`flex items-center gap-2 mt-1 ${isGamingTheme ? 'text-orange-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.accent } : {}}>
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-bold">Personal best: {currentChild.longest_streak} day streak!</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <div className={`text-sm ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                      {currency.name}
                    </div>
                    <div className={`text-2xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                      {currentUser.score.toLocaleString()}
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

        {/* Family Leaderboard or Personal Stats */}
        {siblings.length > 0 ? (
          <>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className={`h-5 w-5 ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}} />
                <span className={`font-bold ${isGamingTheme ? 'text-purple-300' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                  Family Rankings ({leaderboardData.length} members)
                </span>
              </div>
            </motion.div>

            <div className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <motion.div
                  key={entry.name}
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
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">YOU</span>
                          )}
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
          </>
        ) : (
          // No siblings - show personal progress
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ThemedCard
              className={
                isGamingTheme
                  ? "bg-gradient-to-br from-black/60 to-purple-900/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50"
                  : "p-6"
              }
            >
              <div className="flex items-center gap-2 mb-6">
                <User className={`h-5 w-5 ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}} />
                <span className={`font-bold ${isGamingTheme ? 'text-purple-300' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                  Your Personal Progress
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className={`text-3xl font-black ${isGamingTheme ? 'text-yellow-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                    {currentChild?.coins || 0}
                  </div>
                  <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                    {currency.name}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className={`text-3xl font-black ${isGamingTheme ? 'text-purple-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                    {currentChild?.level || 1}
                  </div>
                  <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                    Level
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className={`text-3xl font-black ${isGamingTheme ? 'text-red-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.accent } : {}}>
                    {currentChild?.current_streak || 0}
                  </div>
                  <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                    Current Streak
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className={`text-3xl font-black ${isGamingTheme ? 'text-green-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.primary } : {}}>
                    {currentChild?.longest_streak || 0}
                  </div>
                  <div className={`text-sm ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                    Best Streak
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className={`text-sm ${isGamingTheme ? 'text-purple-300' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  Keep learning to increase your stats!
                </p>
              </div>
            </ThemedCard>
          </motion.div>
        )}

        {/* Tips Card */}
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
              How to Earn More
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-2xl mb-2">📚</div>
                <div className={`text-sm font-bold ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                  Complete Lessons
                </div>
                <div className={`text-xs ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  +5-15 coins per lesson
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-2xl mb-2">🔥</div>
                <div className={`text-sm font-bold ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                  Build Streaks
                </div>
                <div className={`text-xs ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  Bonus for 7+ day streaks!
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-2xl mb-2">⭐</div>
                <div className={`text-sm font-bold ${isGamingTheme ? 'text-white' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.text } : {}}>
                  Get Perfect Scores
                </div>
                <div className={`text-xs ${isGamingTheme ? 'text-gray-400' : ''}`} style={!isGamingTheme ? { color: currentTheme.colors.textSecondary } : {}}>
                  3-star lessons = bonus XP
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
