'use client';

import { useState, useCallback } from 'react';
import { useThemeSkin } from './use-theme-skin';
import { ThemeId } from './theme-context';

interface XPRewardResult {
  xpGained: number;
  leveledUp: boolean;
  newLevel?: number;
  totalXP: number;
}

export function useXPRewards(childId: string, themeId: ThemeId) {
  const { addXP } = useThemeSkin(childId, themeId);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ level: number; message: string } | null>(null);

  const awardXP = useCallback(async (amount: number, reason: string = 'Task completed'): Promise<XPRewardResult> => {
    try {
      const result = await addXP(amount);

      if (result.leveledUp) {
        setCelebrationData({
          level: result.newLevel,
          message: 'LEVEL UP!',
        });
        setShowCelebration(true);
      }

      return {
        xpGained: amount,
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
        totalXP: 0,
      };
    } catch (error) {
      console.error('Error awarding XP:', error);
      throw error;
    }
  }, [addXP]);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationData(null);
  }, []);

  return {
    awardXP,
    showCelebration,
    celebrationData,
    closeCelebration,
  };
}

export const XP_REWARDS = {
  TASK_COMPLETED: 100,
  HOMEWORK_SCANNED: 50,
  LESSON_COMPLETED: 150,
  QUIZ_PERFECT: 200,
  DAILY_STREAK: 75,
  HELP_REQUEST: 25,
  DOCUMENT_UPLOADED: 30,
};
