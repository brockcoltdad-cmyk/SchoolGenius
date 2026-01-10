'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function PirateDemo() {
  const config = themeDashboardConfigs.pirate;

  return (
    <DashboardTemplate
      themeId="pirate"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="🏴‍☠️"
      level={31}
      currency={3421}
      streak={15}
      ranking={56}
      stat1Value={789}
      stat2Value={42}
      stat3Value={128}
      currentXP={2100}
      maxXP={2800}
      leaderboardLink="/demo/pirate/leaderboard"
      kidId="1"
    />
  );
}
