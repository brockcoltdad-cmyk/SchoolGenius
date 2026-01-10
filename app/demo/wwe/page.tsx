'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function WWEDemo() {
  const config = themeDashboardConfigs.wwe;

  return (
    <DashboardTemplate
      themeId="wwe"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="💪"
      level={23}
      currency={1247}
      streak={12}
      ranking={47}
      stat1Value={8}
      stat2Value={156}
      stat3Value={234}
      currentXP={1800}
      maxXP={2500}
      leaderboardLink="/demo/wwe/leaderboard"
      kidId="1"
    />
  );
}
