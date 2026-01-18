'use client';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SkinProvider } from '@/components/theme/SkinProvider';
import GigiLiveChat from '@/components/GigiLiveChat';
import { useTheme, ThemeId } from '@/lib/theme-context';
import { createClient } from '@/lib/supabase-client';

export default function KidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const kidId = params.id as string;
  const [childName, setChildName] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('5');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const { setTheme, currentTheme } = useTheme();

  // Determine page context from pathname
  const getPageContext = () => {
    if (pathname.includes('/lesson')) return 'lesson';
    if (pathname.includes('/chat')) return 'chat';
    if (pathname.includes('/shop')) return 'shop';
    if (pathname.includes('/leaderboard')) return 'leaderboard';
    if (pathname.includes('/reading')) return 'reading';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  // Set current child ID and load their theme
  useEffect(() => {
    if (typeof window !== 'undefined' && kidId) {
      localStorage.setItem('current_child_id', kidId);

      // Check if demo mode (simple ID or demo_mode flag)
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      const isSimpleId = !kidId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (isDemoMode || isSimpleId) {
        // Demo mode: load theme from localStorage
        const savedTheme = localStorage.getItem(`demo_theme_${kidId}`);
        if (savedTheme) {
          setTheme(savedTheme as any);
        }
        setThemeLoaded(true);
        return;
      }

      // Real mode: load from database
      const loadChildTheme = async () => {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from('children')
            .select('current_theme, grade_level')
            .eq('id', kidId)
            .maybeSingle();

          if (data?.current_theme) {
            setTheme(data.current_theme as ThemeId);
          }
          if (data?.grade_level) {
            setGradeLevel(data.grade_level);
          }
          setThemeLoaded(true);
        } catch (error) {
          console.error('Error loading child theme:', error);
          setThemeLoaded(true);
        }
      }
      loadChildTheme();
    }
  }, [kidId, setTheme]);

  // Fetch child name for Gigi
  useEffect(() => {
    async function fetchChildName() {
      if (!kidId) return;
      try {
        const response = await fetch(`/api/gigi/context?childId=${kidId}`);
        if (response.ok) {
          const data = await response.json();
          setChildName(data.childName || '');
        }
      } catch (e) {
        console.error('Could not fetch child context');
      }
    }
    fetchChildName();
  }, [kidId]);

  // Don't show chat on the dedicated chat page (it has its own)
  const showChat = !pathname.includes('/chat');

  return (
    <SkinProvider>
      <div className="pb-16">
        {children}
      </div>
      {showChat && kidId && themeLoaded && (
        <GigiLiveChat
          childId={kidId}
          childName={childName}
          gradeLevel={gradeLevel}
          pageContext={getPageContext()}
        />
      )}
    </SkinProvider>
  );
}
