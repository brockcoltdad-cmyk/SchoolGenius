'use client';

import { Zap } from 'lucide-react';
import { generateMockPlayers, themeLeaderboardConfig } from '@/lib/leaderboard-config';
import LeaderboardTemplate from '@/components/theme/LeaderboardTemplate';

const theme = 'anime';
const config = themeLeaderboardConfig[theme];
const mockPlayers = generateMockPlayers(theme);

export default function AnimeLeaderboard() {
  return (
    <LeaderboardTemplate
      theme={theme}
      config={config}
      mockPlayers={mockPlayers}
      currentUserRank={64}
      colors={{
        background: 'bg-gradient-to-b from-orange-900/30 via-black to-black',
        backgroundGradient: 'bg-gradient-to-b from-orange-950/50 via-black to-black',
        radialGradient: `
          radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
        `,
        primary: 'text-orange-400',
        primaryLight: 'text-orange-500',
        primaryDark: 'text-orange-600',
        border: 'border-orange-500/30',
        shadow: 'shadow-orange-500/40',
        buttonBg: 'bg-orange-500',
        buttonText: 'text-white',
        buttonShadow: 'shadow-[0_0_30px_rgba(249,115,22,0.8)]',
        buttonHover: 'rgba(249,115,22,0.6)',
        cardBg: 'bg-black/80',
        cardBorder: 'border-orange-500',
        cardShadow: 'shadow-[0_0_50px_rgba(249,115,22,0.4)]',
        headerText: 'bg-gradient-to-r from-orange-400 to-blue-500',
        top3Bg: 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30',
        top3Border: 'border-yellow-500/50',
        currentUserBg: 'bg-orange-500/20',
        currentUserBorder: 'border-orange-400',
        currentUserShadow: 'shadow-[0_0_30px_rgba(249,115,22,0.6)]',
        rowBg: 'bg-stone-900/50',
        rowBorder: 'border-stone-700/30',
        rowHover: 'hover:border-orange-500/50',
        rankText: 'text-yellow-400',
        statCard1Bg: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
        statCard1Border: 'border-orange-500',
        statCard1Icon: 'text-orange-400',
        statCard1Text: 'text-orange-400',
        statCard2Bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
        statCard2Border: 'border-blue-500',
        statCard2Icon: 'text-blue-400',
        statCard2Text: 'text-blue-400',
        statCard3Bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        statCard3Border: 'border-green-500',
        statCard3Icon: 'text-green-400',
        statCard3Text: 'text-green-400',
        currencyText: 'text-orange-400',
        powerText: 'text-blue-400',
      }}
      backLink="/demo/anime"
      PowerIcon={Zap}
    />
  );
}
