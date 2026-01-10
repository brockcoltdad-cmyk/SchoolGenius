'use client';

import { Pickaxe } from 'lucide-react';
import { generateMockPlayers, themeLeaderboardConfig } from '@/lib/leaderboard-config';
import LeaderboardTemplate from '@/components/theme/LeaderboardTemplate';

const theme = 'minecraft';
const config = themeLeaderboardConfig[theme];
const mockPlayers = generateMockPlayers(theme);

export default function MinecraftLeaderboard() {
  return (
    <LeaderboardTemplate
      theme={theme}
      config={config}
      mockPlayers={mockPlayers}
      currentUserRank={35}
      colors={{
        background: 'bg-gradient-to-br from-[#2d1b00] via-[#1a0f00] to-black',
        backgroundGradient: 'bg-gradient-to-b from-emerald-950/50 via-black to-black',
        radialGradient: `
          radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)
        `,
        primary: 'text-emerald-400',
        primaryLight: 'text-emerald-500',
        primaryDark: 'text-emerald-600',
        border: 'border-emerald-500/30',
        shadow: 'shadow-emerald-500/40',
        buttonBg: 'bg-emerald-500',
        buttonText: 'text-white',
        buttonShadow: 'shadow-[0_0_30px_rgba(16,185,129,0.8)]',
        buttonHover: 'rgba(16,185,129,0.6)',
        cardBg: 'bg-black/80',
        cardBorder: 'border-emerald-500',
        cardShadow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]',
        headerText: 'bg-gradient-to-r from-emerald-400 to-cyan-500',
        top3Bg: 'bg-gradient-to-r from-emerald-900/30 to-cyan-900/30',
        top3Border: 'border-emerald-500/50',
        currentUserBg: 'bg-emerald-500/20',
        currentUserBorder: 'border-emerald-400',
        currentUserShadow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
        rowBg: 'bg-stone-900/50',
        rowBorder: 'border-stone-700/30',
        rowHover: 'hover:border-emerald-500/50',
        rankText: 'text-emerald-400',
        statCard1Bg: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
        statCard1Border: 'border-cyan-500',
        statCard1Icon: 'text-cyan-400',
        statCard1Text: 'text-cyan-400',
        statCard2Bg: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
        statCard2Border: 'border-emerald-500',
        statCard2Icon: 'text-emerald-400',
        statCard2Text: 'text-emerald-400',
        statCard3Bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        statCard3Border: 'border-green-500',
        statCard3Icon: 'text-green-400',
        statCard3Text: 'text-green-400',
        currencyText: 'text-cyan-400',
        powerText: 'text-emerald-400',
      }}
      backLink="/demo/minecraft"
      PowerIcon={Pickaxe}
    />
  );
}
