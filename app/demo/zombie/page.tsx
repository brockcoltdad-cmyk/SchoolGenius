'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function ZombieDemo() {
  const config = themeDashboardConfigs.zombie;

  return (
    <DashboardTemplate
      themeId="zombie"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="🧟"
      level={29}
      currency={1876}
      streak={21}
      ranking={83}
      stat1Value={2341}
      stat2Value={156}
      stat3Value={67}
      currentXP={1950}
      maxXP={2500}
      leaderboardLink="/demo/zombie/leaderboard"
      kidId="1"
    />
  );
}
