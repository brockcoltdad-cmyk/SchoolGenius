'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function AnimeDemo() {
  const config = themeDashboardConfigs.anime;

  return (
    <DashboardTemplate
      themeId="anime"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="⚡"
      level={52}
      currency={4567}
      streak={28}
      ranking={23}
      stat1Value={9001}
      stat2Value={567}
      stat3Value={3421}
      currentXP={2800}
      maxXP={3200}
      leaderboardLink="/demo/anime/leaderboard"
      kidId="1"
    />
  );
}
