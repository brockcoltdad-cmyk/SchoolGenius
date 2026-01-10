'use client';

import { Target } from 'lucide-react';
import { generateMockPlayers, themeLeaderboardConfig } from '@/lib/leaderboard-config';
import LeaderboardTemplate from '@/components/theme/LeaderboardTemplate';

const theme = 'fortnite';
const config = themeLeaderboardConfig[theme];
const mockPlayers = generateMockPlayers(theme);

export default function FortniteLeaderboard() {
  return (
    <LeaderboardTemplate
      theme={theme}
      config={config}
      mockPlayers={mockPlayers}
      currentUserRank={23}
      colors={{
        background: 'bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2a1f3a]',
        backgroundGradient: 'bg-gradient-to-b from-purple-950/50 via-black to-black',
        radialGradient: `
          radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
        `,
        primary: 'text-purple-400',
        primaryLight: 'text-purple-500',
        primaryDark: 'text-purple-600',
        border: 'border-purple-500/30',
        shadow: 'shadow-purple-500/40',
        buttonBg: 'bg-purple-500',
        buttonText: 'text-white',
        buttonShadow: 'shadow-[0_0_30px_rgba(168,85,247,0.8)]',
        buttonHover: 'rgba(168,85,247,0.6)',
        cardBg: 'bg-black/80',
        cardBorder: 'border-purple-500',
        cardShadow: 'shadow-[0_0_50px_rgba(139,92,246,0.4)]',
        headerText: 'bg-gradient-to-r from-purple-400 to-blue-500',
        top3Bg: 'bg-gradient-to-r from-purple-900/30 to-blue-900/30',
        top3Border: 'border-purple-500/50',
        currentUserBg: 'bg-purple-500/20',
        currentUserBorder: 'border-purple-400',
        currentUserShadow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
        rowBg: 'bg-stone-900/50',
        rowBorder: 'border-stone-700/30',
        rowHover: 'hover:border-purple-500/50',
        rankText: 'text-purple-400',
        statCard1Bg: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20',
        statCard1Border: 'border-purple-500',
        statCard1Icon: 'text-purple-400',
        statCard1Text: 'text-purple-400',
        statCard2Bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
        statCard2Border: 'border-blue-500',
        statCard2Icon: 'text-blue-400',
        statCard2Text: 'text-blue-400',
        statCard3Bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        statCard3Border: 'border-green-500',
        statCard3Icon: 'text-green-400',
        statCard3Text: 'text-green-400',
        currencyText: 'text-yellow-400',
        powerText: 'text-purple-400',
      }}
      backLink="/demo/fortnite"
      PowerIcon={Target}
    />
  );
}
