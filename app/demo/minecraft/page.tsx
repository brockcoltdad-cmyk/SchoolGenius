'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function MinecraftDemo() {
  const config = themeDashboardConfigs.minecraft;

  return (
    <DashboardTemplate
      themeId="minecraft"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="⛏️"
      level={38}
      currency={3421}
      streak={22}
      ranking={34}
      stat1Value={1567}
      stat2Value={234}
      stat3Value={8912}
      currentXP={2500}
      maxXP={3000}
      leaderboardLink="/demo/minecraft/leaderboard"
      kidId="1"
    />
  );
}
