'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

export default function SlimeDemo() {
  const config = themeDashboardConfigs.slime;

  return (
    <DashboardTemplate
      themeId="slime"
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName="THE KID"
      playerEmoji="💚"
      level={27}
      currency={2134}
      streak={19}
      ranking={92}
      stat1Value={456}
      stat2Value={1234}
      stat3Value={89}
      currentXP={1800}
      maxXP={2300}
      leaderboardLink="/demo"
      kidId="1"
    />
  );
}
