'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { getSkinById, getDefaultSkin } from '@/lib/theme-skins';
import { createClient } from '@/lib/supabase-client';

interface SkinProviderProps {
  children: ReactNode;
}

export function SkinProvider({ children }: SkinProviderProps) {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params?.id as string | undefined;
  const [selectedSkinId, setSelectedSkinId] = useState('default');

  useEffect(() => {
    if (!kidId) return;

    const fetchSkin = async () => {
      try {
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';

        if (isDemoMode) {
          setSelectedSkinId('default');
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from('student_skins')
          .select('skin_id')
          .eq('student_id', kidId)
          .eq('equipped', true)
          .maybeSingle();

        if (error) throw error;

        if (data?.skin_id) {
          setSelectedSkinId(data.skin_id);
        }
      } catch (error) {
        console.error('Error fetching skin:', error);
      }
    };

    fetchSkin();
  }, [kidId, currentTheme.id]);

  const skin = getSkinById(currentTheme.id, selectedSkinId) || getDefaultSkin(currentTheme.id);

  return (
    <div
      style={{
        ['--skin-primary' as any]: skin.colors.primary,
        ['--skin-secondary' as any]: skin.colors.secondary,
        ['--skin-accent' as any]: skin.colors.accent,
      }}
    >
      {children}
    </div>
  );
}
