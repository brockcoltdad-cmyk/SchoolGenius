'use client';

import { Target } from 'lucide-react';
import { generateMockPlayers, themeLeaderboardConfig } from '@/lib/leaderboard-config';
import LeaderboardTemplate from '@/components/theme/LeaderboardTemplate';

const theme = 'zombie';
const config = themeLeaderboardConfig[theme];
const mockPlayers = generateMockPlayers(theme);

export default function ZombieLeaderboard() {
  return (
    <LeaderboardTemplate
      theme={theme}
      config={config}
      mockPlayers={mockPlayers}
      currentUserRank={58}
      colors={{
        background: 'bg-gradient-to-b from-green-950 via-stone-900 to-black',
        backgroundGradient: 'bg-gradient-to-b from-green-950/50 via-black to-black',
        radialGradient: `
          radial-gradient(circle at 20% 50%, rgba(132, 204, 22, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)
        `,
        primary: 'text-green-400',
        primaryLight: 'text-green-500',
        primaryDark: 'text-green-600',
        border: 'border-green-500/30',
        shadow: 'shadow-green-500/40',
        buttonBg: 'bg-green-500',
        buttonText: 'text-black',
        buttonShadow: 'shadow-[0_0_30px_rgba(34,197,94,0.8)]',
        buttonHover: 'rgba(34,197,94,0.6)',
        cardBg: 'bg-black/80',
        cardBorder: 'border-green-500',
        cardShadow: 'shadow-[0_0_50px_rgba(34,197,94,0.4)]',
        headerText: 'bg-gradient-to-r from-green-400 to-red-500',
        top3Bg: 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30',
        top3Border: 'border-yellow-500/50',
        currentUserBg: 'bg-green-500/20',
        currentUserBorder: 'border-green-400',
        currentUserShadow: 'shadow-[0_0_30px_rgba(34,197,94,0.6)]',
        rowBg: 'bg-stone-900/50',
        rowBorder: 'border-stone-700/30',
        rowHover: 'hover:border-green-500/50',
        rankText: 'text-yellow-400',
        statCard1Bg: 'bg-gradient-to-br from-green-500/20 to-lime-500/20',
        statCard1Border: 'border-green-500',
        statCard1Icon: 'text-green-400',
        statCard1Text: 'text-green-400',
        statCard2Bg: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
        statCard2Border: 'border-red-500',
        statCard2Icon: 'text-red-400',
        statCard2Text: 'text-red-400',
        statCard3Bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
        statCard3Border: 'border-blue-500',
        statCard3Icon: 'text-blue-400',
        statCard3Text: 'text-blue-400',
        currencyText: 'text-green-400',
        powerText: 'text-red-400',
      }}
      backLink="/demo/zombie"
      PowerIcon={Target}
    />
  );
}
