'use client';

import DashboardTemplate from '@/components/theme/DashboardTemplate';
import { themeDashboardConfigs } from '@/lib/theme-dashboard-config';

const theme = 'wwe';
const config = themeDashboardConfigs[theme];

export default function WWEDashboard() {
  return (
    <DashboardTemplate
      themeId={theme}
      colors={config.colors}
      content={config.content}
      subjects={config.subjects}
      bottomNav={config.bottomNav}
      playerName='EMMA "THE SCHOLAR" JOHNSON'
      playerEmoji="💪"
      level={23}
      currency={1247}
      streak={12}
      ranking={47}
      stat1Value={4}
      stat2Value={28}
      stat3Value={156}
      currentXP={750}
      maxXP={1000}
      leaderboardLink="/demo/wwe/leaderboard"
      kidId="1"
    />
  );
}
