'use client';

import { Anchor } from 'lucide-react';
import { generateMockPlayers, themeLeaderboardConfig } from '@/lib/leaderboard-config';
import LeaderboardTemplate from '@/components/theme/LeaderboardTemplate';

const theme = 'pirate';
const config = themeLeaderboardConfig[theme];
const mockPlayers = generateMockPlayers(theme);

export default function PirateLeaderboard() {
  return (
    <LeaderboardTemplate
      theme={theme}
      config={config}
      mockPlayers={mockPlayers}
      currentUserRank={72}
      colors={{
        background: 'bg-gradient-to-b from-amber-900/50 via-blue-950 to-black',
        backgroundGradient: 'bg-gradient-to-b from-amber-950/50 via-black to-black',
        radialGradient: `
          radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
        `,
        primary: 'text-amber-400',
        primaryLight: 'text-amber-500',
        primaryDark: 'text-amber-600',
        border: 'border-amber-500/30',
        shadow: 'shadow-amber-500/40',
        buttonBg: 'bg-amber-500',
        buttonText: 'text-black',
        buttonShadow: 'shadow-[0_0_30px_rgba(251,191,36,0.8)]',
        buttonHover: 'rgba(251,191,36,0.6)',
        cardBg: 'bg-black/80',
        cardBorder: 'border-amber-500',
        cardShadow: 'shadow-[0_0_50px_rgba(251,191,36,0.4)]',
        headerText: 'bg-gradient-to-r from-amber-400 to-orange-500',
        top3Bg: 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30',
        top3Border: 'border-yellow-500/50',
        currentUserBg: 'bg-amber-500/20',
        currentUserBorder: 'border-amber-400',
        currentUserShadow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
        rowBg: 'bg-stone-900/50',
        rowBorder: 'border-stone-700/30',
        rowHover: 'hover:border-amber-500/50',
        rankText: 'text-yellow-400',
        statCard1Bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
        statCard1Border: 'border-amber-500',
        statCard1Icon: 'text-amber-400',
        statCard1Text: 'text-amber-400',
        statCard2Bg: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
        statCard2Border: 'border-orange-500',
        statCard2Icon: 'text-orange-400',
        statCard2Text: 'text-orange-400',
        statCard3Bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        statCard3Border: 'border-green-500',
        statCard3Icon: 'text-green-400',
        statCard3Text: 'text-green-400',
        currencyText: 'text-amber-400',
        powerText: 'text-yellow-400',
      }}
      backLink="/demo/pirate"
      PowerIcon={Anchor}
    />
  );
}
