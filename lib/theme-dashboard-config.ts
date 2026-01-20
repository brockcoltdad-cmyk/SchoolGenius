import { Camera, MessageSquare, FileText, Settings, ShoppingBag, Calendar, ClipboardCheck, TrendingUp, Trophy, Gamepad2, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { themes, type Theme, type ThemeId } from './theme-context';

export interface ThemeColors {
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
  // Raw hex colors for inline styles (used by dynamic themes)
  rawPrimary?: string;
  rawSecondary?: string;
  rawAccent?: string;
}

export interface ThemeSubject {
  id: string;
  name: string;
  emoji: string;
  label: string;
  colorGradient: string;
  glowShadow: string;
  href: string;
}

export interface ThemeBottomNav {
  icon: LucideIcon;
  label: string;
  description?: string;
  colorGradient: string;
  href: string;
}

export interface ThemeContent {
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

export interface ThemeConfig {
  colors: ThemeColors;
  content: ThemeContent;
  subjects: ThemeSubject[];
  bottomNav: ThemeBottomNav[];
}

export const themeDashboardConfigs: Record<string, ThemeConfig> = {
  wwe: {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-red-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-yellow-400 to-red-500',
      primaryLight: 'text-yellow-500',
      secondary: 'border-red-500',
      accent: 'from-blue-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-red-950/50 to-black/80',
      cardBorder: 'border-yellow-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(255,215,0,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
      textPrimary: 'text-yellow-400',
      textSecondary: 'text-red-500',
      textAccent: 'text-blue-400',
      buttonGradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      buttonText: 'text-black',
      buttonBorder: 'border-yellow-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(234,179,8,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(234,179,8,0.9)]',
      progressBarGradient: 'from-yellow-500 to-red-500',
      badge1: 'bg-yellow-500',
      badge2: 'bg-red-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK CHAMPION!',
      streakText: 'THE STREAK CONTINUES',
      playerTitle: "THE PEOPLE'S CHAMP",
      playerSubtitle: 'SUPERSTAR',
      rankLabel: 'REIGNING CHAMPION',
      characterTitle: 'YOUR WRESTLER',
      characterSubtitle: 'Current Superstar Persona',
      nextLevelText: 'NEXT LEVEL',
      xpUntilText: 'UNTIL TITLE UPGRADE',
      stat1Label: 'BELTS HELD',
      stat2Label: 'TITLE DEFENSES',
      stat3Label: 'MATCHES WON',
      managerName: 'YOUR MANAGER: GIGI',
      managerMessage: "You've got THREE championship matches today! The Math Universal Title is on the line. Defend your belt and you'll move up to #45 in the global rankings! The crowd is ROARING for you! 🔥",
      managerBadge1: 'HYPED',
      managerBadge2: 'MOTIVATED',
      rankUpText: '+3 spots this week!',
      liveCountText: '🌟 2,847 students learning RIGHT NOW',
      liveMatchesText: '⚡ 156 title matches happening today',
      liveTopPercentText: "🏆 You're in the TOP 2% worldwide!",
      subjectsTitle: 'CHAMPIONSHIP DIVISIONS',
      subjectsSubtitle: 'Choose Your Match',
      titleProgressLabel: 'TITLE PROGRESS',
      defendButtonText: 'DEFEND TITLE',
      lastDefenseText: 'Last defense',
      bonusXPText: '+50 XP BONUS',
      currencyLabel: 'CHAMPIONSHIP PTS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '📐',
        label: 'UNIVERSAL CHAMPION',
        colorGradient: 'from-yellow-500 to-yellow-600',
        glowShadow: 'shadow-[0_0_40px_rgba(234,179,8,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📖',
        label: 'INTERCONTINENTAL',
        colorGradient: 'from-green-500 to-green-600',
        glowShadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '✏️',
        label: 'US CHAMPION',
        colorGradient: 'from-red-500 to-red-600',
        glowShadow: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'TAG TEAM CHAMPION',
        colorGradient: 'from-blue-500 to-blue-600',
        glowShadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'CRUISERWEIGHT CHAMPION',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'HARDCORE CHAMPION',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Prove your skills! Pass with 80% to earn 50 coins', colorGradient: 'from-yellow-500 to-red-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'MY PROGRESS', description: 'Track your championship journey and stats', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'View your titles, belts, and accomplishments', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'ARCADE', description: 'Play fun learning games and earn bonus rewards', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'RANKINGS', description: 'See how you stack up against other superstars', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'SCHEDULE', description: 'Plan your training sessions and upcoming championship matches', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'SCOUTING', description: 'Scan documents and capture your opponent intel', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'MANAGER', description: 'Talk to Gigi, your personal wrestling manager', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'CONTRACTS', description: 'View your saved documents and championship records', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'LOCKER ROOM', description: 'Customize your gear and superstar settings', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'TITLE SHOP', description: 'Spend your championship points on awesome rewards', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  minecraft: {
    colors: {
      background: 'bg-gradient-to-br from-[#2d1b00] via-[#1a0f00] to-black',
      backgroundGradient: 'bg-gradient-to-b from-emerald-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-emerald-400 to-cyan-500',
      primaryLight: 'text-emerald-500',
      secondary: 'border-emerald-500',
      accent: 'from-cyan-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-emerald-950/50 to-black/80',
      cardBorder: 'border-emerald-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(16,185,129,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
      textPrimary: 'text-emerald-400',
      textSecondary: 'text-cyan-500',
      textAccent: 'text-cyan-400',
      buttonGradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      buttonText: 'text-white',
      buttonBorder: 'border-emerald-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(16,185,129,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.9)]',
      progressBarGradient: 'from-emerald-500 to-cyan-500',
      badge1: 'bg-emerald-500',
      badge2: 'bg-cyan-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK MINER!',
      streakText: 'THE MINING CONTINUES',
      playerTitle: 'THE MASTER BUILDER',
      playerSubtitle: 'CRAFTER',
      rankLabel: 'LEGENDARY MINER',
      characterTitle: 'YOUR AVATAR',
      characterSubtitle: 'Current Minecraft Skin',
      nextLevelText: 'NEXT LEVEL',
      xpUntilText: 'UNTIL DIAMOND RANK',
      stat1Label: 'DIAMONDS MINED',
      stat2Label: 'BUILDS CREATED',
      stat3Label: 'BLOCKS PLACED',
      managerName: 'YOUR GUIDE: STEVE',
      managerMessage: "You've got THREE mining expeditions today! Diamond ore awaits. Complete them and you'll move up to #34 in the global rankings! Your pickaxe is GLOWING! ⛏️",
      managerBadge1: 'READY',
      managerBadge2: 'MINING',
      rankUpText: '+8 spots this week!',
      liveCountText: '🌟 3,421 miners crafting RIGHT NOW',
      liveMatchesText: '⚡ 234 builds being created today',
      liveTopPercentText: "🏆 You're in the TOP 1% of miners!",
      subjectsTitle: 'MINING EXPEDITIONS',
      subjectsSubtitle: 'Choose Your Quest',
      titleProgressLabel: 'MINING PROGRESS',
      defendButtonText: 'START MINING',
      lastDefenseText: 'Last mine',
      bonusXPText: '+75 XP BONUS',
      currencyLabel: 'DIAMONDS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '⛏️',
        label: 'DIAMOND MINES',
        colorGradient: 'from-cyan-500 to-cyan-600',
        glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📚',
        label: 'ENCHANTMENT TABLE',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '✒️',
        label: 'CRAFTING BENCH',
        colorGradient: 'from-emerald-500 to-emerald-600',
        glowShadow: 'shadow-[0_0_40px_rgba(16,185,129,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'BREWING STATION',
        colorGradient: 'from-orange-500 to-orange-600',
        glowShadow: 'shadow-[0_0_40px_rgba(249,115,22,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'ENCHANTING TABLE',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'REDSTONE CIRCUIT',
        colorGradient: 'from-red-500 to-red-600',
        glowShadow: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Prove your skills! Pass with 80% to earn 50 diamonds', colorGradient: 'from-cyan-500 to-emerald-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'MY PROGRESS', description: 'Track your mining levels and XP gained', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'View your badges and completed challenges', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'MINIGAMES', description: 'Play fun learning games in the arcade', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'LEADERBOARD', description: 'See top miners and builders', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'CALENDAR', description: 'Plan your mining expeditions and building schedules', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'EXPLORE', description: 'Scan the world and discover new biomes', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'CHAT', description: 'Talk to Gigi, your crafting companion', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'RECIPES', description: 'View your crafting recipes and build notes', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'INVENTORY', description: 'Manage your items and settings', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'SHOP', description: 'Trade your emeralds for awesome gear', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  fortnite: {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-purple-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-purple-400 to-pink-500',
      primaryLight: 'text-purple-500',
      secondary: 'border-purple-500',
      accent: 'from-pink-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-purple-950/50 to-black/80',
      cardBorder: 'border-purple-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(168,85,247,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(236,72,153,0.4)]',
      textPrimary: 'text-purple-400',
      textSecondary: 'text-pink-500',
      textAccent: 'text-blue-400',
      buttonGradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      buttonText: 'text-white',
      buttonBorder: 'border-purple-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(168,85,247,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.9)]',
      progressBarGradient: 'from-purple-500 to-pink-500',
      badge1: 'bg-purple-500',
      badge2: 'bg-pink-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK LEGEND!',
      streakText: 'THE VICTORY CONTINUES',
      playerTitle: 'BATTLE ROYALE CHAMPION',
      playerSubtitle: 'LEGEND',
      rankLabel: 'VICTORY ROYALE',
      characterTitle: 'YOUR SKIN',
      characterSubtitle: 'Current Battle Pass Skin',
      nextLevelText: 'NEXT TIER',
      xpUntilText: 'UNTIL TIER UP',
      stat1Label: 'WINS',
      stat2Label: 'ELIMINATIONS',
      stat3Label: 'MATCHES',
      managerName: 'YOUR SQUAD LEADER',
      managerMessage: "You've got THREE battle challenges today! Complete them and you'll move up the leaderboard! The storm is closing in, time to shine! 🌟",
      managerBadge1: 'READY',
      managerBadge2: 'LOCKED IN',
      rankUpText: '+12 spots this week!',
      liveCountText: '🌟 5,234 players battling RIGHT NOW',
      liveMatchesText: '⚡ 892 matches happening today',
      liveTopPercentText: "🏆 You're in the TOP 3% worldwide!",
      subjectsTitle: 'BATTLE CHALLENGES',
      subjectsSubtitle: 'Choose Your Drop',
      titleProgressLabel: 'CHALLENGE PROGRESS',
      defendButtonText: 'DROP IN',
      lastDefenseText: 'Last match',
      bonusXPText: '+100 XP BONUS',
      currencyLabel: 'V-BUCKS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '🔢',
        label: 'TILTED TOWERS',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📖',
        label: 'PLEASANT PARK',
        colorGradient: 'from-green-500 to-green-600',
        glowShadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '✏️',
        label: 'RETAIL ROW',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'LAZY LAKE',
        colorGradient: 'from-blue-500 to-blue-600',
        glowShadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'MISTY MEADOWS',
        colorGradient: 'from-yellow-500 to-yellow-600',
        glowShadow: 'shadow-[0_0_40px_rgba(234,179,8,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'SWEATY SANDS',
        colorGradient: 'from-orange-500 to-orange-600',
        glowShadow: 'shadow-[0_0_40px_rgba(249,115,22,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Complete the challenge! Pass with 80% for 50 V-Bucks', colorGradient: 'from-purple-500 to-blue-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'CAREER', description: 'Track your stats and level progress', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'View your Victory Royales and badges', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'CREATIVE', description: 'Play fun learning games and challenges', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'LEADERBOARD', description: 'See top players in your lobby', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'BATTLE PASS', description: 'Track your daily and weekly missions', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'LOCKER', description: 'Scan and capture your Victory Royales', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'SQUAD', description: 'Chat with Gigi, your squad leader', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'CHALLENGES', description: 'View your quests and challenge progress', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'SETTINGS', description: 'Customize your loadout and controls', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'ITEM SHOP', description: 'Spend V-Bucks on epic skins and gear', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  zombie: {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-green-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-green-400 to-lime-500',
      primaryLight: 'text-green-500',
      secondary: 'border-green-500',
      accent: 'from-lime-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-green-950/50 to-black/80',
      cardBorder: 'border-green-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(34,197,94,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(132,204,22,0.4)]',
      textPrimary: 'text-green-400',
      textSecondary: 'text-lime-500',
      textAccent: 'text-yellow-400',
      buttonGradient: 'bg-gradient-to-r from-green-500 to-green-600',
      buttonText: 'text-black',
      buttonBorder: 'border-green-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(34,197,94,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.9)]',
      progressBarGradient: 'from-green-500 to-lime-500',
      badge1: 'bg-green-500',
      badge2: 'bg-lime-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK SURVIVOR!',
      streakText: 'THE SURVIVAL CONTINUES',
      playerTitle: 'ZOMBIE SLAYER',
      playerSubtitle: 'SURVIVOR',
      rankLabel: 'APOCALYPSE SURVIVOR',
      characterTitle: 'YOUR SURVIVOR',
      characterSubtitle: 'Current Survivor Class',
      nextLevelText: 'NEXT LEVEL',
      xpUntilText: 'UNTIL RANK UP',
      stat1Label: 'ZOMBIES SLAIN',
      stat2Label: 'SURVIVORS SAVED',
      stat3Label: 'DAYS SURVIVED',
      managerName: 'BASE COMMANDER',
      managerMessage: "THREE waves incoming today! Defend the safe zone and you'll rank up to survivor #32! The horde is coming, gear up and get ready! 🧟",
      managerBadge1: 'ALERT',
      managerBadge2: 'PREPARED',
      rankUpText: '+15 spots this week!',
      liveCountText: '🌟 1,892 survivors online RIGHT NOW',
      liveMatchesText: '⚡ 423 waves being defended today',
      liveTopPercentText: "🏆 You're in the TOP 5% of survivors!",
      subjectsTitle: 'SURVIVAL MISSIONS',
      subjectsSubtitle: 'Choose Your Defense',
      titleProgressLabel: 'DEFENSE PROGRESS',
      defendButtonText: 'DEFEND',
      lastDefenseText: 'Last defense',
      bonusXPText: '+60 XP BONUS',
      currencyLabel: 'SUPPLY POINTS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '🔫',
        label: 'WEAPON TRAINING',
        colorGradient: 'from-green-500 to-green-600',
        glowShadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📋',
        label: 'SURVIVAL GUIDE',
        colorGradient: 'from-lime-500 to-lime-600',
        glowShadow: 'shadow-[0_0_40px_rgba(132,204,22,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '📝',
        label: 'LOG BOOK',
        colorGradient: 'from-yellow-500 to-yellow-600',
        glowShadow: 'shadow-[0_0_40px_rgba(234,179,8,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'ANTIDOTE LAB',
        colorGradient: 'from-blue-500 to-blue-600',
        glowShadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'COMMS TRAINING',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'RADIO OPERATOR',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Survive the test! Pass with 80% for 50 supplies', colorGradient: 'from-green-500 to-lime-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'SURVIVOR LOG', description: 'Track your survival stats and days alive', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'View your survival badges and milestones', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'SAFE ZONE', description: 'Play fun mini-games while staying safe', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'SURVIVORS', description: 'See other survivors in your area', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'OPS CALENDAR', description: 'Plan your survival missions and supply runs', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'RECON', description: 'Scout the area and scan for survivors', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'RADIO', description: 'Contact Gigi at base camp for backup', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'MISSIONS', description: 'View your survival logs and mission briefings', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'BUNKER', description: 'Customize your gear and safe house', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'ARMORY', description: 'Trade supplies for survival equipment', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  pirate: {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-blue-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(234, 179, 8, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-blue-400 to-yellow-500',
      primaryLight: 'text-blue-500',
      secondary: 'border-blue-500',
      accent: 'from-yellow-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-blue-950/50 to-black/80',
      cardBorder: 'border-blue-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(59,130,246,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]',
      textPrimary: 'text-blue-400',
      textSecondary: 'text-yellow-500',
      textAccent: 'text-cyan-400',
      buttonGradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      buttonText: 'text-white',
      buttonBorder: 'border-blue-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(59,130,246,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.9)]',
      progressBarGradient: 'from-blue-500 to-yellow-500',
      badge1: 'bg-blue-500',
      badge2: 'bg-yellow-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK CAPTAIN!',
      streakText: 'THE VOYAGE CONTINUES',
      playerTitle: 'PIRATE CAPTAIN',
      playerSubtitle: 'BUCCANEER',
      rankLabel: 'LEGENDARY CAPTAIN',
      characterTitle: 'YOUR PIRATE',
      characterSubtitle: 'Current Pirate Rank',
      nextLevelText: 'NEXT RANK',
      xpUntilText: 'UNTIL PROMOTION',
      stat1Label: 'TREASURE FOUND',
      stat2Label: 'SHIPS SAILED',
      stat3Label: 'ISLANDS EXPLORED',
      managerName: 'FIRST MATE',
      managerMessage: "THREE treasure hunts await today, Captain! X marks the spot on all three maps. Complete them and you'll be promoted to Captain Rank #28! The crew is ready! 🏴‍☠️",
      managerBadge1: 'AYE AYE',
      managerBadge2: 'READY',
      rankUpText: '+9 spots this week!',
      liveCountText: '🌟 2,156 pirates sailing RIGHT NOW',
      liveMatchesText: '⚡ 567 treasure hunts today',
      liveTopPercentText: "🏆 You're in the TOP 4% of pirates!",
      subjectsTitle: 'TREASURE MAPS',
      subjectsSubtitle: 'Choose Your Quest',
      titleProgressLabel: 'QUEST PROGRESS',
      defendButtonText: 'SET SAIL',
      lastDefenseText: 'Last voyage',
      bonusXPText: '+80 XP BONUS',
      currencyLabel: 'GOLD DOUBLOONS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '🗺️',
        label: 'NAVIGATION',
        colorGradient: 'from-blue-500 to-blue-600',
        glowShadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📜',
        label: 'TREASURE MAP',
        colorGradient: 'from-yellow-500 to-yellow-600',
        glowShadow: 'shadow-[0_0_40px_rgba(234,179,8,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '✒️',
        label: 'SHIP LOG',
        colorGradient: 'from-cyan-500 to-cyan-600',
        glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '🔭',
        label: 'STAR NAVIGATION',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'CODE BREAKER',
        colorGradient: 'from-green-500 to-green-600',
        glowShadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'SIGNAL FLAGS',
        colorGradient: 'from-orange-500 to-orange-600',
        glowShadow: 'shadow-[0_0_40px_rgba(249,115,22,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Prove yer worth! Pass with 80% for 50 doubloons', colorGradient: 'from-yellow-500 to-blue-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'CAPTAIN LOG', description: 'Track your voyage stats and treasures found', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'View your pirate ranks and bounties claimed', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'TAVERN GAMES', description: 'Play fun games while docked at port', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'LEADERBOARD', description: 'See the most notorious pirates', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'VOYAGE LOG', description: 'Chart your course and plan treasure hunts', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'SPYGLASS', description: 'Scan the horizon and capture treasure maps', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'CREW', description: 'Talk to Gigi, your first mate', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'QUESTS', description: 'View your bounties and adventure logs', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'SHIP', description: 'Customize your vessel and pirate gear', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'PORT SHOP', description: 'Trade your doubloons for ship upgrades', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  anime: {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-pink-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-pink-400 to-purple-500',
      primaryLight: 'text-pink-500',
      secondary: 'border-pink-500',
      accent: 'from-purple-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-pink-950/50 to-black/80',
      cardBorder: 'border-pink-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(236,72,153,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
      textPrimary: 'text-pink-400',
      textSecondary: 'text-purple-500',
      textAccent: 'text-blue-400',
      buttonGradient: 'bg-gradient-to-r from-pink-500 to-pink-600',
      buttonText: 'text-white',
      buttonBorder: 'border-pink-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(236,72,153,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.9)]',
      progressBarGradient: 'from-pink-500 to-purple-500',
      badge1: 'bg-pink-500',
      badge2: 'bg-purple-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK HERO!',
      streakText: 'YOUR POWER GROWS',
      playerTitle: 'ULTIMATE HERO',
      playerSubtitle: 'HERO',
      rankLabel: 'S-RANK HERO',
      characterTitle: 'YOUR CHARACTER',
      characterSubtitle: 'Current Hero Form',
      nextLevelText: 'NEXT POWER LEVEL',
      xpUntilText: 'UNTIL EVOLUTION',
      stat1Label: 'POWER LEVEL',
      stat2Label: 'BATTLES WON',
      stat3Label: 'ENEMIES DEFEATED',
      managerName: 'SENSEI GIGI',
      managerMessage: "THREE training arcs await you today! Master them and you'll unlock new abilities. Your power level is rising! Time to go PLUS ULTRA! ⚡",
      managerBadge1: 'HYPED',
      managerBadge2: 'TRAINING',
      rankUpText: '+18 ranks this week!',
      liveCountText: '🌟 4,567 heroes training RIGHT NOW',
      liveMatchesText: '⚡ 1,234 battles happening today',
      liveTopPercentText: "🏆 You're in the TOP 1% of heroes!",
      subjectsTitle: 'TRAINING ARCS',
      subjectsSubtitle: 'Choose Your Training',
      titleProgressLabel: 'TRAINING PROGRESS',
      defendButtonText: 'TRAIN NOW',
      lastDefenseText: 'Last training',
      bonusXPText: '+150 XP BONUS',
      currencyLabel: 'HERO POINTS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '⚡',
        label: 'POWER TRAINING',
        colorGradient: 'from-yellow-500 to-yellow-600',
        glowShadow: 'shadow-[0_0_40px_rgba(234,179,8,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📖',
        label: 'JUTSU SCROLLS',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '✍️',
        label: 'HERO JOURNAL',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'QUIRK RESEARCH',
        colorGradient: 'from-blue-500 to-blue-600',
        glowShadow: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'SPELL MASTERY',
        colorGradient: 'from-cyan-500 to-cyan-600',
        glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'JUTSU SIGNS',
        colorGradient: 'from-orange-500 to-orange-600',
        glowShadow: 'shadow-[0_0_40px_rgba(249,115,22,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Power up! Pass with 80% for 50 crystals', colorGradient: 'from-pink-500 to-purple-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'POWER LEVEL', description: 'Track your training progress and stats', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'View your hero badges and power-ups unlocked', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'ARCADE', description: 'Play fun mini-games between episodes', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'RANKINGS', description: 'See top heroes in the academy', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'TRAINING', description: 'Schedule your training arcs and power-ups', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'GALLERY', description: 'Capture epic moments and transformation scenes', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'TEAM', description: 'Talk to Gigi, your anime sensei', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'MISSIONS', description: 'View your quest log and hero assignments', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'DOJO', description: 'Customize your hero outfit and abilities', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'HERO SHOP', description: 'Trade power crystals for legendary items', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  slime: {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-lime-950/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(163, 230, 53, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-lime-400 to-green-500',
      primaryLight: 'text-lime-500',
      secondary: 'border-lime-500',
      accent: 'from-green-950',
      cardBg: 'bg-gradient-to-br from-black/80 via-lime-950/50 to-black/80',
      cardBorder: 'border-lime-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(163,230,53,0.5)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]',
      textPrimary: 'text-lime-400',
      textSecondary: 'text-green-500',
      textAccent: 'text-cyan-400',
      buttonGradient: 'bg-gradient-to-r from-lime-500 to-lime-600',
      buttonText: 'text-black',
      buttonBorder: 'border-lime-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(163,230,53,0.8)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(163,230,53,0.9)]',
      progressBarGradient: 'from-lime-500 to-green-500',
      badge1: 'bg-lime-500',
      badge2: 'bg-green-500',
    },
    content: {
      welcomeTitle: 'WELCOME BACK SLIME MASTER!',
      streakText: 'THE GOOEY ADVENTURE CONTINUES',
      playerTitle: 'LEGENDARY SLIME',
      playerSubtitle: 'SLIME RANGER',
      rankLabel: 'ULTIMATE SLIME',
      characterTitle: 'YOUR SLIME',
      characterSubtitle: 'Current Slime Evolution',
      nextLevelText: 'NEXT EVOLUTION',
      xpUntilText: 'UNTIL MEGA SLIME',
      stat1Label: 'SLIMES COLLECTED',
      stat2Label: 'GOOP GATHERED',
      stat3Label: 'SLIME COMBOS',
      managerName: 'SLIME SCIENTIST',
      managerMessage: "THREE slime experiments today! Mix them all and you'll evolve to the next form! Your slime power is getting GOOEY-ER! 💚",
      managerBadge1: 'BOUNCY',
      managerBadge2: 'GOOEY',
      rankUpText: '+7 spots this week!',
      liveCountText: '🌟 3,892 slime masters RIGHT NOW',
      liveMatchesText: '⚡ 678 experiments happening today',
      liveTopPercentText: "🏆 You're in the TOP 2% of slime masters!",
      subjectsTitle: 'SLIME EXPERIMENTS',
      subjectsSubtitle: 'Choose Your Lab',
      titleProgressLabel: 'EXPERIMENT PROGRESS',
      defendButtonText: 'MIX SLIME',
      lastDefenseText: 'Last experiment',
      bonusXPText: '+65 XP BONUS',
      currencyLabel: 'SLIME COINS',
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '💻',
        label: 'SLIME CHEMISTRY',
        colorGradient: 'from-lime-500 to-lime-600',
        glowShadow: 'shadow-[0_0_40px_rgba(163,230,53,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📚',
        label: 'SLIME GUIDE',
        colorGradient: 'from-green-500 to-green-600',
        glowShadow: 'shadow-[0_0_40px_rgba(34,197,94,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '✏️',
        label: 'LAB NOTES',
        colorGradient: 'from-cyan-500 to-cyan-600',
        glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'SLIME LAB',
        colorGradient: 'from-emerald-500 to-emerald-600',
        glowShadow: 'shadow-[0_0_40px_rgba(16,185,129,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'SLIME DICTIONARY',
        colorGradient: 'from-purple-500 to-purple-600',
        glowShadow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'SLIME KEYBOARD',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Squish the test! Pass with 80% for 50 glitter', colorGradient: 'from-lime-500 to-green-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'SLIME STATS', description: 'Track your gooey progress and growth', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'TROPHIES', description: 'View your slime awards and achievements', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'SLIME GAMES', description: 'Play bouncy games and earn bonus glitter', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'SLIME BOARD', description: 'See who has the stretchiest scores', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'SCHEDULE', description: 'Plan your slime experiments and activities', colorGradient: 'from-indigo-500 to-indigo-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'COLLECT', description: 'Scan and collect new slime specimens', colorGradient: 'from-blue-500 to-blue-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'SLIME CHAT', description: 'Talk to Gigi, your slimy best friend', colorGradient: 'from-green-500 to-green-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'RECIPES', description: 'View your slime recipes and lab notes', colorGradient: 'from-purple-500 to-purple-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'LAB', description: 'Customize your laboratory and equipment', colorGradient: 'from-orange-500 to-orange-600', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'SLIME SHOP', description: 'Trade glitter for new slime ingredients', colorGradient: 'from-pink-500 to-pink-600', href: '/kid/{id}/shop' },
    ],
  },

  default: {
    colors: {
      background: 'bg-slate-900',
      backgroundGradient: 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.25) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(148, 163, 184, 0.2) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-cyan-400 to-slate-400',
      primaryLight: 'text-cyan-400',
      secondary: 'border-slate-400',
      accent: 'from-slate-700',
      cardBg: 'bg-gradient-to-br from-slate-800/90 via-slate-900/70 to-slate-800/90',
      cardBorder: 'border-cyan-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(6,182,212,0.4)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(148,163,184,0.3)]',
      textPrimary: 'text-cyan-400',
      textSecondary: 'text-slate-300',
      textAccent: 'text-emerald-400',
      buttonGradient: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      buttonText: 'text-slate-900',
      buttonBorder: 'border-cyan-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.8)]',
      progressBarGradient: 'from-cyan-400 to-slate-400',
      badge1: 'bg-cyan-500',
      badge2: 'bg-slate-500',
    },
    content: {
      welcomeTitle: 'SYSTEMS ONLINE!',
      streakText: 'UPTIME STREAK',
      playerTitle: 'TECH OPERATOR',
      playerSubtitle: 'UNIT ACTIVE',
      rankLabel: 'PROCESSING RANK',
      characterTitle: 'YOUR ROBOT',
      characterSubtitle: 'AI Learning Unit',
      nextLevelText: 'NEXT UPGRADE',
      xpUntilText: 'DATA UNTIL UPGRADE',
      stat1Label: 'PROGRAMS RUN',
      stat2Label: 'UPGRADES',
      stat3Label: 'DATA COLLECTED',
      managerName: 'AI ASSISTANT: GIGI 🤖',
      managerMessage: "BEEP BOOP! Systems check complete. You have learning modules ready to execute. Let's process some knowledge together! 🔧",
      managerBadge1: 'ONLINE',
      managerBadge2: 'READY',
      rankUpText: 'Processing...',
      liveCountText: '🤖 Units learning right now',
      liveMatchesText: '⚡ Programs executed today',
      liveTopPercentText: "🔧 Systems running optimally!",
      subjectsTitle: 'LEARNING MODULES',
      subjectsSubtitle: 'Select Program',
      titleProgressLabel: 'PROCESSING',
      defendButtonText: 'RUN PROGRAM',
      lastDefenseText: 'Last executed',
      bonusXPText: '+50 DATA BONUS',
      currencyLabel: 'CREDITS',
      streakLabel: 'UPTIME',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '🔢',
        label: 'CALCULATION MODULE',
        colorGradient: 'from-cyan-500 to-cyan-600',
        glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📡',
        label: 'DATA INPUT',
        colorGradient: 'from-emerald-500 to-emerald-600',
        glowShadow: 'shadow-[0_0_40px_rgba(16,185,129,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '💾',
        label: 'DATA OUTPUT',
        colorGradient: 'from-slate-400 to-slate-500',
        glowShadow: 'shadow-[0_0_40px_rgba(148,163,184,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '🖥️',
        label: 'PROGRAMMING',
        colorGradient: 'from-violet-500 to-violet-600',
        glowShadow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'LANGUAGE PROCESSOR',
        colorGradient: 'from-amber-500 to-amber-600',
        glowShadow: 'shadow-[0_0_40px_rgba(245,158,11,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'INPUT TRAINING',
        colorGradient: 'from-teal-500 to-teal-600',
        glowShadow: 'shadow-[0_0_40px_rgba(20,184,166,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'DIAGNOSTIC', description: 'Run system test! Pass with 80% for 50 credits', colorGradient: 'from-cyan-500 to-teal-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'ANALYTICS', description: 'View performance data and progress metrics', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'Check your unlocked badges and awards', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'RECREATION', description: 'Play learning games and earn bonus credits', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'RANKINGS', description: 'Compare your stats with other operators', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'SCHEDULER', description: 'Plan your learning programs and sessions', colorGradient: 'from-slate-500 to-slate-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'SCANNER', description: 'Scan and digitize documents', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'COMMS', description: 'Chat with Gigi, your AI assistant', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'DATABASE', description: 'Access your stored files and records', colorGradient: 'from-violet-500 to-violet-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'CONFIG', description: 'Adjust your system settings and preferences', colorGradient: 'from-slate-400 to-slate-500', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'UPGRADE SHOP', description: 'Spend credits on system upgrades', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/shop' },
    ],
  },

  robot: {
    colors: {
      background: 'bg-slate-900',
      backgroundGradient: 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.25) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(148, 163, 184, 0.2) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-cyan-400 to-slate-400',
      primaryLight: 'text-cyan-400',
      secondary: 'border-slate-400',
      accent: 'from-slate-700',
      cardBg: 'bg-gradient-to-br from-slate-800/90 via-slate-900/70 to-slate-800/90',
      cardBorder: 'border-cyan-500',
      glowPrimary: 'shadow-[0_0_50px_rgba(6,182,212,0.4)]',
      glowSecondary: 'shadow-[0_0_30px_rgba(148,163,184,0.3)]',
      textPrimary: 'text-cyan-400',
      textSecondary: 'text-slate-300',
      textAccent: 'text-emerald-400',
      buttonGradient: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      buttonText: 'text-slate-900',
      buttonBorder: 'border-cyan-400',
      buttonShadow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]',
      buttonHoverShadow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.8)]',
      progressBarGradient: 'from-cyan-400 to-slate-400',
      badge1: 'bg-cyan-500',
      badge2: 'bg-slate-500',
    },
    content: {
      welcomeTitle: 'SYSTEMS ONLINE!',
      streakText: 'UPTIME STREAK',
      playerTitle: 'ROBO OPERATOR',
      playerSubtitle: 'UNIT ACTIVE',
      rankLabel: 'PROCESSING RANK',
      characterTitle: 'YOUR MECH',
      characterSubtitle: 'Learning Robot',
      nextLevelText: 'NEXT UPGRADE',
      xpUntilText: 'DATA UNTIL UPGRADE',
      stat1Label: 'PROGRAMS RUN',
      stat2Label: 'UPGRADES',
      stat3Label: 'DATA COLLECTED',
      managerName: 'ROBO GIGI 🤖',
      managerMessage: "BEEP BOOP! All systems operational. Ready to compute some knowledge? Let's optimize your learning circuits! 🔧",
      managerBadge1: 'ONLINE',
      managerBadge2: 'ACTIVE',
      rankUpText: 'Computing...',
      liveCountText: '🤖 Robots learning right now',
      liveMatchesText: '⚡ Programs executed today',
      liveTopPercentText: "🔧 Systems at peak efficiency!",
      subjectsTitle: 'LEARNING MODULES',
      subjectsSubtitle: 'Select Program',
      titleProgressLabel: 'PROCESSING',
      defendButtonText: 'EXECUTE',
      lastDefenseText: 'Last computed',
      bonusXPText: '+50 DATA BONUS',
      currencyLabel: 'CREDITS',
      streakLabel: 'UPTIME',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '🔢',
        label: 'CALCULATION UNIT',
        colorGradient: 'from-cyan-500 to-cyan-600',
        glowShadow: 'shadow-[0_0_40px_rgba(6,182,212,0.6)]',
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📡',
        label: 'DATA INPUT',
        colorGradient: 'from-emerald-500 to-emerald-600',
        glowShadow: 'shadow-[0_0_40px_rgba(16,185,129,0.6)]',
        href: '/kid/{id}/reading'
      },
      {
        id: 'writing',
        name: 'Writing',
        emoji: '💾',
        label: 'DATA OUTPUT',
        colorGradient: 'from-slate-400 to-slate-500',
        glowShadow: 'shadow-[0_0_40px_rgba(148,163,184,0.6)]',
        href: '/kid/{id}/writing'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '🖥️',
        label: 'PROGRAMMING',
        colorGradient: 'from-violet-500 to-violet-600',
        glowShadow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '🔤',
        label: 'LANGUAGE PROCESSOR',
        colorGradient: 'from-amber-500 to-amber-600',
        glowShadow: 'shadow-[0_0_40px_rgba(245,158,11,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'INPUT TRAINING',
        colorGradient: 'from-teal-500 to-teal-600',
        glowShadow: 'shadow-[0_0_40px_rgba(20,184,166,0.6)]',
        href: '/kid/{id}/typing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'DIAGNOSTIC', description: 'Run system test! Pass with 80% for 50 credits', colorGradient: 'from-cyan-500 to-teal-600', href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'ANALYTICS', description: 'View performance data and progress metrics', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'Check your unlocked badges and awards', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'RECREATION', description: 'Play learning games and earn bonus credits', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'RANKINGS', description: 'Compare your stats with other operators', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'SCHEDULER', description: 'Plan your learning programs and sessions', colorGradient: 'from-slate-500 to-slate-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'SCANNER', description: 'Scan and digitize documents', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'COMMS', description: 'Chat with Robo Gigi, your AI assistant', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'DATABASE', description: 'Access your stored files and records', colorGradient: 'from-violet-500 to-violet-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'CONFIG', description: 'Adjust your system settings and preferences', colorGradient: 'from-slate-400 to-slate-500', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: 'UPGRADE SHOP', description: 'Spend credits on system upgrades', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/shop' },
    ],
  },
};

// Generate a dashboard config dynamically from any theme
export function getThemeDashboardConfig(themeId: ThemeId): ThemeConfig {
  // If we have a custom config for this theme, use it
  if (themeDashboardConfigs[themeId]) {
    return themeDashboardConfigs[themeId];
  }

  // Otherwise, generate a config from the theme's colors
  const theme = themes[themeId];
  if (!theme) {
    return themeDashboardConfigs['default'];
  }

  const { colors } = theme;

  // Generate Tailwind-compatible color classes from hex colors
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const primaryRgb = hexToRgb(colors.primary);
  const secondaryRgb = hexToRgb(colors.secondary);
  const accentRgb = hexToRgb(colors.accent);

  return {
    colors: {
      background: 'bg-black',
      backgroundGradient: 'bg-gradient-to-b from-gray-900/50 via-black to-black',
      radialGradient: `
        radial-gradient(circle at 20% 50%, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.3) 0%, transparent 50%)
      `,
      primary: 'bg-gradient-to-r from-white to-gray-300',
      primaryLight: 'text-white',
      secondary: 'border-white/50',
      accent: 'from-white',
      cardBg: 'bg-gradient-to-br from-black/80 via-gray-900/50 to-black/80',
      cardBorder: 'border-white/30',
      glowPrimary: `shadow-[0_0_50px_rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.5)]`,
      glowSecondary: `shadow-[0_0_30px_rgba(${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b},0.4)]`,
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textAccent: 'text-gray-200',
      buttonGradient: 'bg-gradient-to-r from-white to-gray-300',
      buttonText: 'text-black',
      buttonBorder: 'border-white/50',
      buttonShadow: `shadow-[0_0_30px_rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.8)]`,
      buttonHoverShadow: `hover:shadow-[0_0_40px_rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.9)]`,
      progressBarGradient: 'from-white to-gray-300',
      badge1: 'bg-white',
      badge2: 'bg-gray-300',
      // Raw hex colors for inline styles
      rawPrimary: colors.primary,
      rawSecondary: colors.secondary,
      rawAccent: colors.accent,
    },
    content: {
      welcomeTitle: `WELCOME BACK, ${theme.name.toUpperCase()} CHAMPION!`,
      streakText: 'KEEP THE STREAK GOING!',
      playerTitle: theme.name.toUpperCase() + ' MASTER',
      playerSubtitle: 'SUPERSTAR',
      rankLabel: 'CHAMPION',
      characterTitle: 'YOUR CHARACTER',
      characterSubtitle: `Current ${theme.name} Persona`,
      nextLevelText: 'NEXT LEVEL',
      xpUntilText: 'UNTIL LEVEL UP',
      stat1Label: 'WINS',
      stat2Label: 'STREAK',
      stat3Label: 'STARS',
      managerName: 'YOUR COACH: GIGI',
      managerMessage: `You're doing amazing! Keep learning and earning ${theme.coinName}! Complete your daily challenges to level up! 🔥`,
      managerBadge1: 'AWESOME',
      managerBadge2: 'CHAMPION',
      rankUpText: 'Keep winning to rank up!',
      liveCountText: '🟢 Learning now',
      liveMatchesText: '⚡ Daily challenges ready',
      liveTopPercentText: '🏆 Top learner!',
      subjectsTitle: 'YOUR SUBJECTS',
      subjectsSubtitle: 'Choose your challenge',
      titleProgressLabel: 'PROGRESS',
      defendButtonText: 'START',
      lastDefenseText: 'Last practice',
      bonusXPText: '+50 XP BONUS',
      currencyLabel: theme.coinName.toUpperCase(),
      streakLabel: 'DAY STREAK',
    },
    subjects: [
      {
        id: 'math',
        name: 'Math',
        emoji: '🔢',
        label: 'NUMBER MASTER',
        colorGradient: `from-[${colors.primary}] to-[${colors.secondary}]`,
        glowShadow: `shadow-[0_0_40px_rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.6)]`,
        href: '/kid/{id}/math'
      },
      {
        id: 'reading',
        name: 'Reading',
        emoji: '📚',
        label: 'STORY EXPLORER',
        colorGradient: `from-[${colors.secondary}] to-[${colors.accent}]`,
        glowShadow: `shadow-[0_0_40px_rgba(${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b},0.6)]`,
        href: '/kid/{id}/reading'
      },
      {
        id: 'coding',
        name: 'Coding',
        emoji: '💻',
        label: 'CODE CREATOR',
        colorGradient: 'from-violet-500 to-violet-600',
        glowShadow: 'shadow-[0_0_40px_rgba(139,92,246,0.6)]',
        href: '/kid/{id}/coding'
      },
      {
        id: 'spelling',
        name: 'Spelling',
        emoji: '✏️',
        label: 'WORD WIZARD',
        colorGradient: 'from-amber-500 to-amber-600',
        glowShadow: 'shadow-[0_0_40px_rgba(245,158,11,0.6)]',
        href: '/kid/{id}/spelling'
      },
      {
        id: 'typing',
        name: 'Typing',
        emoji: '⌨️',
        label: 'KEYBOARD PRO',
        colorGradient: 'from-teal-500 to-teal-600',
        glowShadow: 'shadow-[0_0_40px_rgba(20,184,166,0.6)]',
        href: '/kid/{id}/typing'
      },
      {
        id: 'writing',
        name: 'Language Arts',
        emoji: '📝',
        label: 'WRITING STAR',
        colorGradient: 'from-pink-500 to-pink-600',
        glowShadow: 'shadow-[0_0_40px_rgba(236,72,153,0.6)]',
        href: '/kid/{id}/writing'
      },
    ],
    bottomNav: [
      { icon: ClipboardCheck, label: 'WEEKLY TEST', description: 'Take your weekly test! Pass with 80% for 50 coins', colorGradient: `from-[${colors.primary}] to-[${colors.secondary}]`, href: '/kid/{id}/weekly-test' },
      { icon: TrendingUp, label: 'MY PROGRESS', description: 'See how far you have come!', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/progress' },
      { icon: Trophy, label: 'ACHIEVEMENTS', description: 'Check your badges and awards', colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/achievements' },
      { icon: Gamepad2, label: 'GAMES', description: 'Play fun learning games', colorGradient: 'from-fuchsia-500 to-fuchsia-600', href: '/kid/{id}/games' },
      { icon: Users, label: 'LEADERBOARD', description: 'See how you rank against others', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/leaderboard' },
      { icon: Calendar, label: 'MY SCHEDULE', description: 'Plan your learning week', colorGradient: 'from-slate-500 to-slate-600', href: '/kid/{id}/syllabus' },
      { icon: Camera, label: 'SCAN HOMEWORK', description: 'Scan your school work', colorGradient: 'from-emerald-500 to-emerald-600', href: '/kid/{id}/scan' },
      { icon: MessageSquare, label: 'CHAT WITH GIGI', description: 'Ask Gigi for help!', colorGradient: 'from-cyan-500 to-cyan-600', href: '/kid/{id}/chat' },
      { icon: FileText, label: 'MY DOCUMENTS', description: 'See your saved work', colorGradient: 'from-violet-500 to-violet-600', href: '/kid/{id}/documents' },
      { icon: Settings, label: 'SETTINGS', description: 'Change your theme and settings', colorGradient: 'from-slate-400 to-slate-500', href: '/kid/{id}/settings' },
      { icon: ShoppingBag, label: theme.shopName.toUpperCase(), description: `Spend your ${theme.coinName} on cool stuff!`, colorGradient: 'from-amber-500 to-amber-600', href: '/kid/{id}/shop' },
    ],
  };
}
