'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function FortniteDemo() {
  const config = themeDashboardConfigs.fortnite;

  return (
    <DashboardTemplate
      themeId="fortnite"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="🎮"
      level={45}
      currency={2850}
      streak={18}
      ranking={127}
      stat1Value={342}
      stat2Value={1289}
      stat3Value={891}
      currentXP={2400}
      maxXP={3000}
      leaderboardLink="/demo/fortnite/leaderboard"
      kidId="1"
    />
  );
}
