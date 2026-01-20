'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Flame, Crown, Star, Zap, Award, Users, TrendingUp, Camera, MessageSquare, FileText, Settings, ShoppingBag, Palette } from 'lucide-react';
import { useTheme, themes, type ThemeId } from '@/lib/theme-context';
import { createClient } from '@/lib/supabase-client';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import ThemeMascot from '@/components/ThemeMascot';
import { triggerXPGain } from '@/components/animations/FloatingXP';
import { triggerParticles } from '@/components/animations/ParticleSystem';
import { playSound } from '@/hooks/use-sound-effects';
import type { LucideIcon } from 'lucide-react';

interface ThemeColors {
  background: string;
  backgroundGradient: string;
  radialGradient: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  cardBg: string;
  cardBorder: string;
  glowPrimary: string;
  glowSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  buttonGradient: string;
  buttonText: string;
  buttonBorder: string;
  buttonShadow: string;
  buttonHoverShadow: string;
  progressBarGradient: string;
  badge1: string;
  badge2: string;
}

interface Subject {
  id: string;
  name: string;
  emoji: string;
  label: string;
  colorGradient: string;
  glowShadow: string;
  href: string;
}

interface BottomNavItem {
  icon: LucideIcon;
  label: string;
  description?: string;
  colorGradient: string;
  href: string;
}

interface ThemeContent {
  welcomeTitle: string;
  streakText: string;
  playerTitle: string;
  playerSubtitle: string;
  rankLabel: string;
  characterTitle: string;
  characterSubtitle: string;
  nextLevelText: string;
  xpUntilText: string;
  stat1Label: string;
  stat2Label: string;
  stat3Label: string;
  managerName: string;
  managerMessage: string;
  managerBadge1: string;
  managerBadge2: string;
  rankUpText: string;
  liveCountText: string;
  liveMatchesText: string;
  liveTopPercentText: string;
  subjectsTitle: string;
  subjectsSubtitle: string;
  titleProgressLabel: string;
  defendButtonText: string;
  lastDefenseText: string;
  bonusXPText: string;
  currencyLabel: string;
  streakLabel: string;
}

interface DashboardTemplateProps {
  themeId: string;
  colors: ThemeColors;
  content: ThemeContent;
  subjects: Subject[];
  bottomNav: BottomNavItem[];
  playerName: string;
  playerEmoji: string;
  level: number;
  currency: number;
  streak: number;
  ranking: number;
  stat1Value: number;
  stat2Value: number;
  stat3Value: number;
  currentXP: number;
  maxXP: number;
  leaderboardLink: string;
  kidId: string;
  previewMode?: boolean;
}

export default function DashboardTemplate({
  themeId,
  colors,
  content,
  subjects,
  bottomNav,
  playerName,
  playerEmoji,
  level,
  currency,
  streak,
  ranking,
  stat1Value,
  stat2Value,
  stat3Value,
  currentXP,
  maxXP,
  leaderboardLink,
  kidId,
  previewMode = false,
}: DashboardTemplateProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { setTheme } = useTheme();

  // All kid-appropriate themes (excluding adult themes like finance, coffee, gym, nightowl, lofi, etc.)
  const quickThemes: ThemeId[] = [
    // Action/Adventure
    'wwe', 'battle', 'ninja', 'darkninja', 'hero', 'pirate', 'zombie', 'mech', 'scifi',
    // Animals
    'dinosaur', 'shark', 'kitten', 'puppy', 'butterfly', 'bug', 'teddy', 'pony',
    // Fantasy
    'unicorn', 'mermaid', 'princess', 'fairy', 'rainbow', 'dreams',
    // Space/Science
    'space', 'robot', 'planet', 'volcano',
    // Nature
    'ocean', 'jungle', 'safari', 'arctic', 'beach', 'camping', 'farm',
    // Creative
    'builder', 'cube', 'slime', 'bracelet', 'artstudio', 'candy', 'cupcake',
    // Entertainment
    'popstar', 'moviestar', 'dance', 'ballerina', 'anime', 'kawaii', 'kpop',
    // Sports/Games
    'racecar', 'esports', 'sneaker',
    // Style
    'glam', 'fashion', 'aesthetic', 'y2k', 'softgirl', 'cottagecore', 'graffiti', 'hiphop', 'streetwear', 'neon',
    // Other kid-friendly
    'monster', 'creatures', 'train', 'construction', 'firefighter', 'friendship', 'ice', 'spaday', 'petgroomer',
    'bookworm', 'zodiac', 'web', 'victory', 'default'
  ];

  const handleThemeSelect = async (newThemeId: ThemeId) => {
    setTheme(newThemeId);
    // Save to database
    try {
      const supabase = createClient();
      await supabase
        .from('children')
        .update({ current_theme: newThemeId })
        .eq('id', kidId);
    } catch (e) {
      console.error('Error saving theme:', e);
    }
    setShowThemePicker(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubjectClick = (e: React.MouseEvent, subject: string) => {
    triggerXPGain(50, e.clientX, e.clientY, 'xp');
    triggerParticles(e.clientX, e.clientY, 30);
    playSound('success');
  };

  const xpPercentage = (currentXP / maxXP) * 100;
  const xpRemaining = maxXP - currentXP;

  return (
    <div className={`relative min-h-screen overflow-hidden ${colors.background}`}>
      <div className={`absolute inset-0 ${colors.backgroundGradient}`} />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: colors.radialGradient,
        }} />
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className={`text-6xl font-black text-transparent bg-clip-text ${colors.primary} ${colors.glowPrimary}`}>
                {content.welcomeTitle}
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`text-2xl font-bold ${colors.textSecondary} mt-2 tracking-widest`}
              >
                🔥 {content.streakText} 🔥
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              🏆
            </motion.div>
            <div>
              <div className={`${colors.textPrimary} text-sm font-bold tracking-widest`}>{content.rankLabel}</div>
              <div className="text-4xl font-black text-white tracking-tight">{playerName}</div>
              <div className={`${colors.textSecondary} font-bold`}>LEVEL {level} {content.playerSubtitle}</div>
            </div>
          </div>
          <div className="flex gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`text-center bg-gradient-to-br ${colors.primary}/20 border-2 ${colors.cardBorder} rounded-xl p-4 ${colors.glowPrimary}`}
            >
              <div className={`${colors.textPrimary} font-black text-3xl`}>
                <AnimatedCounter value={currency} />
              </div>
              <div className={`${colors.primaryLight} font-bold text-xs`}>{content.currencyLabel}</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`text-center bg-gradient-to-br ${colors.secondary}/20 border-2 ${colors.secondary} rounded-xl p-4 ${colors.glowSecondary}`}
            >
              <Flame className={`h-8 w-8 ${colors.textSecondary} mx-auto mb-1`} />
              <div className="text-white font-black text-2xl">{streak}</div>
              <div className={`${colors.textSecondary} font-bold text-xs`}>{content.streakLabel}</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-12"
        >
          <div className={`absolute inset-0 ${colors.primary}/20 via-${colors.secondary}/20 to-${colors.primary}/20 rounded-3xl blur-xl`} />
          <div className={`relative ${colors.cardBg} border-4 ${colors.cardBorder} rounded-3xl p-12 ${colors.glowPrimary}`}>
            <motion.div
              className={`absolute -top-6 left-1/2 -translate-x-1/2 ${colors.buttonGradient} px-8 py-2 rounded-full border-4 border-black ${colors.buttonShadow}`}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className={`${colors.buttonText} font-black text-xl tracking-wider`}>{content.characterTitle}</span>
            </motion.div>

            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(255, 215, 0, 0.5)',
                          '0 0 40px rgba(255, 215, 0, 0.8)',
                          '0 0 20px rgba(255, 215, 0, 0.5)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-32 h-32 rounded-full ${colors.buttonGradient} flex items-center justify-center overflow-hidden border-4 ${colors.buttonBorder}`}
                    >
                      <ThemeMascot theme={themeId} size={180} animate />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute -top-2 -right-2"
                    >
                      <Crown className={`h-10 w-10 ${colors.textPrimary}`} />
                    </motion.div>
                  </div>
                  <div>
                    <div className={`${colors.textPrimary} font-black text-5xl`}>{content.playerTitle}</div>
                    <div className={`${colors.textSecondary} font-bold text-xl mt-1`}>{content.characterSubtitle}</div>
                    <div className="flex gap-2 mt-2">
                      {['💪', '⚡', '🔥', '👑'].map((emoji, i) => (
                        <motion.span
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="text-2xl"
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`bg-black/60 rounded-xl p-4 border-2 ${colors.cardBorder}/30`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${colors.textPrimary} font-bold`}>{content.nextLevelText}: {level + 1}</span>
                    <span className="text-white font-bold">{currentXP} / {maxXP} XP</span>
                  </div>
                  <AnimatedProgress value={xpPercentage} className="h-4" />
                  <div className={`${colors.textSecondary} text-sm mt-2 font-bold`}>{xpRemaining} XP {content.xpUntilText}!</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className={`bg-gradient-to-br ${colors.primary}/20 border-2 ${colors.cardBorder}/50 rounded-lg p-3 text-center`}>
                    <Trophy className={`h-6 w-6 ${colors.textPrimary} mx-auto mb-1`} />
                    <div className="text-white font-black text-xl">{stat1Value}</div>
                    <div className={`${colors.textPrimary} text-xs font-bold`}>{content.stat1Label}</div>
                  </div>
                  <div className={`bg-gradient-to-br ${colors.secondary}/20 border-2 ${colors.secondary}/50 rounded-lg p-3 text-center`}>
                    <Zap className={`h-6 w-6 ${colors.textSecondary} mx-auto mb-1`} />
                    <div className="text-white font-black text-xl">{stat2Value}</div>
                    <div className={`${colors.textSecondary} text-xs font-bold`}>{content.stat2Label}</div>
                  </div>
                  <div className={`bg-gradient-to-br ${colors.accent}/20 border-2 ${colors.accent}/50 rounded-lg p-3 text-center`}>
                    <Star className={`h-6 w-6 ${colors.textAccent} mx-auto mb-1`} />
                    <div className="text-white font-black text-xl">{stat3Value}</div>
                    <div className={`${colors.textAccent} text-xs font-bold`}>{content.stat3Label}</div>
                  </div>
                </div>
              </div>

              <div className={`ml-8 bg-black/60 border-2 ${colors.cardBorder}/30 rounded-xl p-6 w-80`}>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className={`h-5 w-5 ${colors.textPrimary}`} />
                  <span className={`${colors.textPrimary} font-black text-lg`}>{content.managerName}</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`${colors.cardBg} rounded-lg p-4 border-2 ${colors.secondary}/50 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-20">🎤</div>
                  <div className="relative z-10">
                    <div className="text-white font-bold mb-2">&quot;Listen up!&quot;</div>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {content.managerMessage}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div className={`${colors.buttonGradient} ${colors.buttonText} px-3 py-1 rounded-full text-xs font-black`}>{content.managerBadge1}</div>
                      <div className={`${colors.secondary} text-white px-3 py-1 rounded-full text-xs font-black`}>{content.managerBadge2}</div>
                    </div>
                  </div>
                </motion.div>

                {previewMode ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`mt-4 bg-gradient-to-r ${colors.accent}/80 to-black/80 rounded-lg p-3 border ${colors.accent}/30 opacity-80`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className={`h-4 w-4 ${colors.textAccent}`} />
                        <span className={`${colors.textAccent} text-sm font-bold`}>GLOBAL RANK</span>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-white font-black text-2xl"
                      >
                        #{ranking}
                      </motion.div>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">🔥 {content.rankUpText}</div>
                  </motion.div>
                ) : (
                  <Link href={leaderboardLink}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`mt-4 bg-gradient-to-r ${colors.accent}/80 to-black/80 rounded-lg p-3 border ${colors.accent}/30 cursor-pointer hover:border-${colors.accent} transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className={`h-4 w-4 ${colors.textAccent}`} />
                          <span className={`${colors.textAccent} text-sm font-bold`}>GLOBAL RANK</span>
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-white font-black text-2xl"
                        >
                          #{ranking}
                        </motion.div>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">🔥 {content.rankUpText} Click to view</div>
                    </motion.div>
                  </Link>
                )}

                <div className={`mt-4 bg-gradient-to-r from-green-950/80 to-black/80 rounded-lg p-3 border border-green-500/30`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm font-bold">LIVE STATS</span>
                  </div>
                  <div className="text-gray-300 text-xs space-y-1">
                    <div>{content.liveCountText}</div>
                    <div>{content.liveMatchesText}</div>
                    <div>{content.liveTopPercentText}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-4xl font-black text-transparent bg-clip-text ${colors.primary}`}>
              {content.subjectsTitle}
            </h2>
            <div className={`${colors.textPrimary} font-bold`}>{content.subjectsSubtitle} ⚡</div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {subjects.map((subject, index) => {
              const href = subject.href.replace('{id}', kidId);
              const cardContent = (
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={previewMode ? undefined : (e) => handleSubjectClick(e, subject.name)}
                  className={`relative group ${previewMode ? 'opacity-90' : 'cursor-pointer'} rounded-2xl overflow-hidden border-4 ${colors.cardBorder}/60 ${subject.glowShadow} ${previewMode ? '' : `hover:border-${colors.primary}`} transition-all`}
                >
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.colorGradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                />

                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-7xl"
                    >
                      {subject.emoji}
                    </motion.div>
                    <div className="text-right">
                      <div className={`${colors.textPrimary} font-black text-3xl tracking-wider`}>{subject.name}</div>
                      <div className="text-white font-bold text-sm">{subject.label}</div>
                    </div>
                  </div>

                  <div className={`bg-black/70 rounded-xl p-4 mb-4 border-2 ${colors.cardBorder}/30`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`${colors.textPrimary} font-bold text-sm`}>{content.titleProgressLabel}</span>
                      <span className="text-white font-bold text-sm">8 / 10 DEFENSES</span>
                    </div>
                    <AnimatedProgress value={80} className="h-3" />
                  </div>

                  <div className="flex gap-2">
                    <MagneticButton
                      shape="squircle"
                      variant="primary"
                      glow
                      className={`flex-1 ${colors.buttonGradient} ${colors.buttonText} font-black uppercase tracking-wider py-4 border-2 ${colors.buttonBorder} ${colors.buttonShadow} ${colors.buttonHoverShadow}`}
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      {content.defendButtonText}
                    </MagneticButton>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`bg-black/70 ${colors.textPrimary} px-4 rounded-xl border-2 ${colors.cardBorder}/50 font-bold hover:bg-${colors.primary}/20 transition-colors`}
                    >
                      <Award className="h-5 w-5" />
                    </motion.button>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-400">{content.lastDefenseText}: 2 days ago</span>
                    <span className="text-green-400 font-bold">⚡ {content.bonusXPText}</span>
                  </div>
                </div>
              </motion.div>
              );
              return previewMode ? (
                <div key={subject.id}>{cardContent}</div>
              ) : (
                <Link key={subject.id} href={href}>{cardContent}</Link>
              );
            })}
          </div>
        </motion.div>

        {/* Full-width navigation buttons with descriptions - uses THEME colors */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          {bottomNav.map((item, i) => {
            const Icon = item.icon;
            const href = item.href.replace('{id}', kidId);
            const navContent = (
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group w-full ${previewMode ? 'opacity-90' : 'cursor-pointer'} rounded-xl overflow-hidden border-2 ${colors.cardBorder} hover:border-white/60 transition-all p-4 ${colors.cardBg} shadow-lg ${colors.glowSecondary} ${previewMode ? '' : 'hover:shadow-2xl'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${colors.primary} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${colors.buttonText}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`${colors.textPrimary} font-black text-lg uppercase tracking-wide`}>{item.label}</div>
                      {item.description && (
                        <div className="text-white/70 text-sm mt-0.5">{item.description}</div>
                      )}
                    </div>
                    <div className={`${colors.textPrimary} text-2xl`}>→</div>
                  </div>
                </motion.div>
            );
            return previewMode ? (
              <div key={i}>{navContent}</div>
            ) : (
              <Link key={i} href={href}>{navContent}</Link>
            );
          })}

          {/* Pick Your Theme Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <motion.button
              onClick={() => setShowThemePicker(!showThemePicker)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group w-full rounded-xl overflow-hidden border-2 ${colors.cardBorder} hover:border-white/60 transition-all p-4 ${colors.cardBg} shadow-lg ${colors.glowSecondary} hover:shadow-2xl`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center`}>
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`${colors.textPrimary} font-black text-lg uppercase tracking-wide`}>Pick Your Theme</div>
                  <div className="text-white/70 text-sm mt-0.5">Change your look instantly!</div>
                </div>
                <div className={`${colors.textPrimary} text-2xl`}>{showThemePicker ? '↑' : '↓'}</div>
              </div>
            </motion.button>

            {/* Theme Picker Grid */}
            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3 p-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20">
                    {quickThemes.map((tid) => {
                      const t = themes[tid];
                      if (!t) return null;
                      const isActive = themeId === tid;
                      return (
                        <motion.button
                          key={tid}
                          onClick={() => handleThemeSelect(tid)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative p-3 rounded-xl text-center transition-all ${
                            isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})`
                          }}
                        >
                          <div className="text-2xl mb-1">{t.mascot}</div>
                          <div className="text-xs font-bold text-white truncate">{t.name}</div>
                          {isActive && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
