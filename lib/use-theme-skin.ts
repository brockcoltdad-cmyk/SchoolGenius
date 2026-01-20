'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeId } from './theme-context';
import { ThemeSkin, getSkinsForTheme, getSkinById, getDefaultSkin } from './theme-skins';
import { createClient } from './supabase-client';

export interface ThemeProgress {
  xp: number;
  level: number;
  selectedSkin: string;
}

export function useThemeSkin(childId: string, themeId: ThemeId) {
  const [progress, setProgress] = useState<ThemeProgress>({
    xp: 0,
    level: 1,
    selectedSkin: 'default',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
      const isSimpleId = !childId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (isDemoMode || isSimpleId) {
        setProgress({
          xp: 750,
          level: 5,
          selectedSkin: 'default',
        });
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      // Get child's XP and level from children table
      const { data: child, error: childError } = await supabase
        .from('children')
        .select('xp, level')
        .eq('id', childId)
        .maybeSingle();

      if (childError) throw childError;

      // Get equipped skin from student_skins table
      const { data: skinData } = await supabase
        .from('student_skins')
        .select('skin_id')
        .eq('student_id', childId)
        .eq('equipped', true)
        .maybeSingle();

      if (child) {
        setProgress({
          xp: child.xp || 0,
          level: child.level || 1,
          selectedSkin: skinData?.skin_id || 'default',
        });
      }
    } catch (error) {
      console.error('Error fetching theme progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateSkin = async (skinId: string) => {
    try {
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
      const isSimpleId = !childId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (isDemoMode || isSimpleId) {
        setProgress(prev => ({ ...prev, selectedSkin: skinId }));
        return;
      }

      const supabase = createClient();

      // First, unequip all skins for this child
      await supabase
        .from('student_skins')
        .update({ equipped: false })
        .eq('student_id', childId);

      // Then equip the selected skin (or insert if it doesn't exist)
      const { error } = await supabase
        .from('student_skins')
        .upsert({
          student_id: childId,
          skin_id: skinId,
          equipped: true,
        }, {
          onConflict: 'student_id,skin_id'
        });

      if (error) throw error;

      setProgress(prev => ({ ...prev, selectedSkin: skinId }));
    } catch (error) {
      console.error('Error updating skin:', error);
      throw error;
    }
  };

  const addXP = async (amount: number) => {
    const xpPerLevel = 1000;
    const newXP = progress.xp + amount;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;

    try {
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
      const isSimpleId = !childId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (isDemoMode || isSimpleId) {
        const leveledUp = newLevel > progress.level;
        setProgress({
          ...progress,
          xp: newXP,
          level: newLevel,
        });
        return { leveledUp, newLevel };
      }

      const supabase = createClient();
      const { error } = await supabase
        .from('children')
        .update({
          xp: newXP,
          level: newLevel,
        })
        .eq('id', childId);

      if (error) throw error;

      const leveledUp = newLevel > progress.level;

      setProgress({
        ...progress,
        xp: newXP,
        level: newLevel,
      });

      return { leveledUp, newLevel };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  };

  const skins = getSkinsForTheme(themeId);
  const currentSkin = getSkinById(themeId, progress.selectedSkin) || getDefaultSkin(themeId);

  return {
    progress,
    currentSkin,
    skins,
    isLoading,
    updateSkin,
    addXP,
    refetch: fetchProgress,
  };
}

export function getSkinsWithUnlockStatus(
  skins: ThemeSkin[],
  currentLevel: number,
  ownedSkins: string[] = []
): ThemeSkin[] {
  // All skins are unlocked - no restrictions
  return skins.map(skin => ({
    ...skin,
    unlocked: true,
  }));
}

export function applySkinColors(skin: ThemeSkin) {
  return {
    '--skin-primary': skin.colors.primary,
    '--skin-secondary': skin.colors.secondary,
    '--skin-accent': skin.colors.accent,
  } as React.CSSProperties;
}
