'use client';

import { Zap } from 'lucide-react';
import { generateMockPlayers, themeLeaderboardConfig } from '@/lib/leaderboard-config';
import LeaderboardTemplate from '@/components/theme/LeaderboardTemplate';

const theme = 'wwe';
const config = themeLeaderboardConfig[theme];
const mockPlayers = generateMockPlayers(theme);

export default function WWELeaderboard() {
  return (
    <LeaderboardTemplate
      theme={theme}
      config={config}
      mockPlayers={mockPlayers}
      currentUserRank={47}
      colors={{
        background: 'bg-black',
        backgroundGradient: 'bg-gradient-to-b from-red-950/50 via-black to-black',
        radialGradient: `
          radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)
        `,
        primary: 'text-yellow-400',
        primaryLight: 'text-yellow-500',
        primaryDark: 'text-yellow-600',
        border: 'border-yellow-500/30',
        shadow: 'shadow-yellow-500/40',
        buttonBg: 'bg-yellow-500',
        buttonText: 'text-black',
        buttonShadow: 'shadow-[0_0_30px_rgba(234,179,8,0.8)]',
        buttonHover: 'rgba(234,179,8,0.6)',
        cardBg: 'bg-black/80',
        cardBorder: 'border-yellow-500',
        cardShadow: 'shadow-[0_0_50px_rgba(255,215,0,0.4)]',
        headerText: 'bg-gradient-to-r from-yellow-400 to-red-500',
        top3Bg: 'bg-gradient-to-r from-yellow-900/30 to-red-900/30',
        top3Border: 'border-yellow-500/50',
        currentUserBg: 'bg-yellow-500/20',
        currentUserBorder: 'border-yellow-400',
        currentUserShadow: 'shadow-[0_0_30px_rgba(234,179,8,0.6)]',
        rowBg: 'bg-stone-900/50',
        rowBorder: 'border-stone-700/30',
        rowHover: 'hover:border-yellow-500/50',
        rankText: 'text-yellow-400',
        statCard1Bg: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
        statCard1Border: 'border-yellow-500',
        statCard1Icon: 'text-yellow-400',
        statCard1Text: 'text-yellow-400',
        statCard2Bg: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
        statCard2Border: 'border-red-500',
        statCard2Icon: 'text-red-400',
        statCard2Text: 'text-red-400',
        statCard3Bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        statCard3Border: 'border-green-500',
        statCard3Icon: 'text-green-400',
        statCard3Text: 'text-green-400',
        currencyText: 'text-yellow-400',
        powerText: 'text-red-400',
      }}
      backLink="/demo/wwe"
      PowerIcon={Zap}
    />
  );
}
