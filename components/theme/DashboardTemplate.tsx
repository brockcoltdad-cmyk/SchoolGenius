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

  // Use raw colors for inline styles if available (dynamic themes)
  const primaryColor = colors.rawPrimary || '#FFD700';
  const secondaryColor = colors.rawSecondary || '#DC2626';
  const accentColor = colors.rawAccent || '#3B82F6';

  return (
    <div className={`relative min-h-screen overflow-hidden ${colors.background}`}>
      <div
        className="absolute inset-0"
        style={{
          background: colors.rawPrimary
            ? `linear-gradient(to bottom, ${primaryColor}20, black 30%, black)`
            : undefined
        }}
      />
      {!colors.rawPrimary && <div className={`absolute inset-0 ${colors.backgroundGradient}`} />}

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
              <div
                className={`text-6xl font-black ${colors.glowPrimary}`}
                style={{ color: primaryColor }}
              >
                {content.welcomeTitle}
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl font-bold mt-2 tracking-widest"
                style={{ color: secondaryColor }}
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
              <div className="text-sm font-bold tracking-widest" style={{ color: primaryColor }}>{content.rankLabel}</div>
              <div className="text-4xl font-black text-white tracking-tight">{playerName}</div>
              <div className="font-bold" style={{ color: secondaryColor }}>LEVEL {level} {content.playerSubtitle}</div>
            </div>
          </div>
          <div className="flex gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`text-center rounded-xl p-4 ${colors.glowPrimary}`}
              style={{
                background: `linear-gradient(to bottom right, ${primaryColor}20, transparent)`,
                border: `2px solid ${primaryColor}`,
              }}
            >
              <div className="font-black text-3xl" style={{ color: primaryColor }}>
                <AnimatedCounter value={currency} />
              </div>
              <div className="font-bold text-xs" style={{ color: primaryColor }}>{content.currencyLabel}</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`text-center rounded-xl p-4 ${colors.glowSecondary}`}
              style={{
                background: `linear-gradient(to bottom right, ${secondaryColor}20, transparent)`,
                border: `2px solid ${secondaryColor}`,
              }}
            >
              <Flame className="h-8 w-8 mx-auto mb-1" style={{ color: secondaryColor }} />
              <div className="text-white font-black text-2xl">{streak}</div>
              <div className="font-bold text-xs" style={{ color: secondaryColor }}>{content.streakLabel}</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-12"
        >
          <div
            className="absolute inset-0 rounded-3xl blur-xl"
            style={{ background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}20, ${primaryColor}20)` }}
          />
          <div
            className="relative rounded-3xl p-12 bg-black/80"
            style={{
              border: `4px solid ${primaryColor}`,
              boxShadow: `0 0 50px ${primaryColor}50`,
            }}
          >
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2 rounded-full border-4 border-black"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 0 30px ${primaryColor}80`,
              }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="font-black text-xl tracking-wider text-black">{content.characterTitle}</span>
            </motion.div>

            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      animate={{
                        boxShadow: [
                          `0 0 20px ${primaryColor}80`,
                          `0 0 40px ${primaryColor}`,
                          `0 0 20px ${primaryColor}80`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                        border: `4px solid ${primaryColor}`,
                      }}
                    >
                      <ThemeMascot theme={themeId} size={180} animate />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute -top-2 -right-2"
                    >
                      <Crown className="h-10 w-10" style={{ color: primaryColor }} />
                    </motion.div>
                  </div>
                  <div>
                    <div className="font-black text-5xl" style={{ color: primaryColor }}>{content.playerTitle}</div>
                    <div className="font-bold text-xl mt-1" style={{ color: secondaryColor }}>{content.characterSubtitle}</div>
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

                <div className="bg-black/60 rounded-xl p-4 border-2 border-white/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold" style={{ color: primaryColor }}>{content.nextLevelText}: {level + 1}</span>
                    <span className="text-white font-bold">{currentXP} / {maxXP} XP</span>
                  </div>
                  <AnimatedProgress value={xpPercentage} className="h-4" />
                  <div className="text-sm mt-2 font-bold" style={{ color: secondaryColor }}>{xpRemaining} XP {content.xpUntilText}!</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="rounded-lg p-3 text-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${primaryColor}20, transparent)`,
                      border: `2px solid ${primaryColor}50`,
                    }}
                  >
                    <Trophy className="h-6 w-6 mx-auto mb-1" style={{ color: primaryColor }} />
                    <div className="text-white font-black text-xl">{stat1Value}</div>
                    <div className="text-xs font-bold" style={{ color: primaryColor }}>{content.stat1Label}</div>
                  </div>
                  <div
                    className="rounded-lg p-3 text-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${secondaryColor}20, transparent)`,
                      border: `2px solid ${secondaryColor}50`,
                    }}
                  >
                    <Zap className="h-6 w-6 mx-auto mb-1" style={{ color: secondaryColor }} />
                    <div className="text-white font-black text-xl">{stat2Value}</div>
                    <div className="text-xs font-bold" style={{ color: secondaryColor }}>{content.stat2Label}</div>
                  </div>
                  <div
                    className="rounded-lg p-3 text-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${accentColor}20, transparent)`,
                      border: `2px solid ${accentColor}50`,
                    }}
                  >
                    <Star className="h-6 w-6 mx-auto mb-1" style={{ color: accentColor }} />
                    <div className="text-white font-black text-xl">{stat3Value}</div>
                    <div className="text-xs font-bold" style={{ color: accentColor }}>{content.stat3Label}</div>
                  </div>
                </div>
              </div>

              <div className="ml-8 bg-black/60 border-2 border-white/30 rounded-xl p-6 w-80">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5" style={{ color: primaryColor }} />
                  <span className="font-black text-lg" style={{ color: primaryColor }}>{content.managerName}</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-black/60 rounded-lg p-4 relative overflow-hidden"
                  style={{ border: `2px solid ${secondaryColor}50` }}
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-20">🎤</div>
                  <div className="relative z-10">
                    <div className="text-white font-bold mb-2">&quot;Listen up!&quot;</div>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {content.managerMessage}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-black text-black"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {content.managerBadge1}
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        {content.managerBadge2}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {previewMode ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-4 rounded-lg p-3 opacity-80"
                    style={{
                      background: `linear-gradient(to right, ${accentColor}30, rgba(0,0,0,0.8))`,
                      border: `1px solid ${accentColor}30`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" style={{ color: accentColor }} />
                        <span className="text-sm font-bold" style={{ color: accentColor }}>GLOBAL RANK</span>
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
                      className="mt-4 rounded-lg p-3 cursor-pointer transition-all"
                      style={{
                        background: `linear-gradient(to right, ${accentColor}30, rgba(0,0,0,0.8))`,
                        border: `1px solid ${accentColor}30`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" style={{ color: accentColor }} />
                          <span className="text-sm font-bold" style={{ color: accentColor }}>GLOBAL RANK</span>
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
            <h2
              className="text-4xl font-black"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {content.subjectsTitle}
            </h2>
            <div className="font-bold" style={{ color: primaryColor }}>{content.subjectsSubtitle} ⚡</div>
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
                  className={`relative group ${previewMode ? 'opacity-90' : 'cursor-pointer'} rounded-2xl overflow-hidden ${subject.glowShadow} transition-all`}
                  style={{ border: `4px solid ${primaryColor}60` }}
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
                    background: `linear-gradient(90deg, transparent, ${primaryColor}30, transparent)`,
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
                      <div className="font-black text-3xl tracking-wider" style={{ color: primaryColor }}>{subject.name}</div>
                      <div className="text-white font-bold text-sm">{subject.label}</div>
                    </div>
                  </div>

                  <div className="bg-black/70 rounded-xl p-4 mb-4 border-2 border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: primaryColor }}>{content.titleProgressLabel}</span>
                      <span className="text-white font-bold text-sm">8 / 10 DEFENSES</span>
                    </div>
                    <AnimatedProgress value={80} className="h-3" />
                  </div>

                  <div className="flex gap-2">
                    <MagneticButton
                      shape="squircle"
                      variant="primary"
                      glow
                      className="flex-1 font-black uppercase tracking-wider py-4 text-black"
                      style={{
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                        border: `2px solid ${primaryColor}`,
                        boxShadow: `0 0 30px ${primaryColor}80`,
                      }}
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      {content.defendButtonText}
                    </MagneticButton>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-black/70 px-4 rounded-xl font-bold transition-colors"
                      style={{ color: primaryColor, border: `2px solid ${primaryColor}50` }}
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
                  className={`relative group w-full ${previewMode ? 'opacity-90' : 'cursor-pointer'} rounded-xl overflow-hidden hover:border-white/60 transition-all p-4 bg-black/60 shadow-lg ${previewMode ? '' : 'hover:shadow-2xl'}`}
                  style={{ border: `2px solid ${primaryColor}50` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                    >
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-black text-lg uppercase tracking-wide" style={{ color: primaryColor }}>{item.label}</div>
                      {item.description && (
                        <div className="text-white/70 text-sm mt-0.5">{item.description}</div>
                      )}
                    </div>
                    <div className="text-2xl" style={{ color: primaryColor }}>→</div>
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
              className="relative group w-full rounded-xl overflow-hidden hover:border-white/60 transition-all p-4 bg-black/60 shadow-lg hover:shadow-2xl"
              style={{ border: `2px solid ${primaryColor}50` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-black text-lg uppercase tracking-wide" style={{ color: primaryColor }}>Pick Your Theme</div>
                  <div className="text-white/70 text-sm mt-0.5">Change your look instantly!</div>
                </div>
                <div className="text-2xl" style={{ color: primaryColor }}>{showThemePicker ? '↑' : '↓'}</div>
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
