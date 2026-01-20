'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumCard from '@/components/ui/premium-card';
import { createClient } from '@/lib/supabase-client';
import { themes, type ThemeId } from '@/lib/theme-context';
import { useToast } from '@/hooks/use-toast';
import DashboardShell, { useDashboardTheme } from '@/components/parent/DashboardShell';

interface Child {
  id: string;
  name: string;
  grade_level: string;
  current_theme: string;
}

interface OwnedTheme {
  theme_id: string;
  is_free: boolean;
  purchased_at: string;
}

export default function ChildThemeSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { theme: dashTheme, isDark } = useDashboardTheme();
  const childId = params.childId as string;

  const [child, setChild] = useState<Child | null>(null);
  const [ownedThemes, setOwnedThemes] = useState<OwnedTheme[]>([]);
  const [disabledThemes, setDisabledThemes] = useState<ThemeId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingTheme, setProcessingTheme] = useState<ThemeId | null>(null);

  useEffect(() => {
    fetchData();
  }, [childId]);

  async function fetchData() {
    try {
      // Check for demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';

      if (isDemoMode) {
        // Use mock data for demo
        setChild({
          id: childId,
          name: childId === '1' ? 'Emma' : 'Noah',
          grade_level: childId === '1' ? '3' : '5',
          current_theme: 'default',
        });

        setOwnedThemes([
          { theme_id: 'default', is_free: true, purchased_at: new Date().toISOString() },
          { theme_id: 'battle', is_free: true, purchased_at: new Date().toISOString() },
          { theme_id: 'builder', is_free: false, purchased_at: new Date().toISOString() },
          { theme_id: 'unicorn', is_free: false, purchased_at: new Date().toISOString() },
        ]);

        setDisabledThemes([]);
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('id', childId)
        .eq('parent_id', user.id)
        .single();

      if (childError) throw childError;
      setChild(childData as Child);

      // Try to load student themes - but don't crash if table doesn't exist
      try {
        const { data: themesData, error: themesError } = await supabase
          .from('student_themes')
          .select('theme_id, is_active, purchased_at')
          .eq('student_id', childId)
          .order('purchased_at', { ascending: false });

        if (!themesError && themesData) {
          setOwnedThemes(themesData as unknown as OwnedTheme[]);
        }

        const { data: disabledData, error: disabledError } = await supabase
          .from('student_themes')
          .select('theme_id')
          .eq('student_id', childId)
          .eq('is_active', false);

        if (!disabledError && disabledData) {
          setDisabledThemes(disabledData?.map((d: any) => d.theme_id as ThemeId).filter(Boolean) || []);
        }
      } catch (themeError) {
        // student_themes table may not exist - that's OK, continue with empty themes
        console.log('Note: student_themes table not available, showing default themes');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load child data',
        variant: 'destructive',
      });
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleThemeDisabled(themeId: ThemeId) {
    setProcessingTheme(themeId);
    const isCurrentlyDisabled = disabledThemes.includes(themeId);

    try {
      // Check for demo mode
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';

      if (isDemoMode) {
        // Simulate toggle in demo mode
        if (isCurrentlyDisabled) {
          setDisabledThemes(disabledThemes.filter(id => id !== themeId));
          toast({
            title: 'Theme enabled',
            description: `${themes[themeId].name} is now available for ${child?.name}`,
          });
        } else {
          if (child?.current_theme === themeId) {
            toast({
              title: 'Cannot disable',
              description: 'This is the active theme. Have your child switch themes first.',
              variant: 'destructive',
            });
            setProcessingTheme(null);
            return;
          }
          setDisabledThemes([...disabledThemes, themeId]);
          toast({
            title: 'Theme disabled',
            description: `${themes[themeId].name} is now hidden from ${child?.name}`,
          });
        }
        setProcessingTheme(null);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isCurrentlyDisabled) {
        const { error } = await supabase
          .from('student_themes')
          .update({ is_active: true })
          .eq('student_id', childId)
          .eq('theme_id', themeId);

        if (error) throw error;
        setDisabledThemes(disabledThemes.filter(id => id !== themeId));
        toast({
          title: 'Theme enabled',
          description: `${themes[themeId].name} is now available for ${child?.name}`,
        });
      } else {
        if (child?.current_theme === themeId) {
          toast({
            title: 'Cannot disable',
            description: 'This is the active theme. Have your child switch themes first.',
            variant: 'destructive',
          });
          setProcessingTheme(null);
          return;
        }

        const { error } = await supabase
          .from('student_themes')
          .update({ is_active: false })
          .eq('student_id', childId)
          .eq('theme_id', themeId);

        if (error) throw error;
        setDisabledThemes([...disabledThemes, themeId]);
        toast({
          title: 'Theme disabled',
          description: `${themes[themeId].name} is now hidden from ${child?.name}`,
        });
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to update theme status',
        variant: 'destructive',
      });
    } finally {
      setProcessingTheme(null);
    }
  }

  if (isLoading) {
    return (
      <DashboardShell showBackButton backHref="/dashboard">
        <Card className="mx-auto max-w-md p-12 text-center border-2 border-white/10 bg-black/60 backdrop-blur-xl">
          <p className="text-gray-400">Loading...</p>
        </Card>
      </DashboardShell>
    );
  }

  if (!child) {
    return null;
  }

  const freeThemes = ownedThemes.filter(t => t.is_free);
  const purchasedThemes = ownedThemes.filter(t => !t.is_free);

  return (
    <DashboardShell
      showBackButton
      backHref="/dashboard"
      title={`${child.name}'s Theme Settings`}
      subtitle={`Control which themes ${child.name} can see and use`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-6xl mx-auto"
      >
        <Card className="p-6 border-2 border-blue-500/30 bg-blue-500/10 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-blue-500/20">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-blue-300">How Theme Controls Work</h3>
              <p className="text-sm text-blue-200/80">
                Click the eye icon to hide themes from your child. Hidden themes won&apos;t appear in their Settings or Shop.
                You can always re-enable them later.
              </p>
            </div>
          </div>
        </Card>

        {child.current_theme && (
          <Card className="p-6 border-2 border-green-500/30 bg-green-500/10 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-black/40 text-5xl shadow-lg border-2 border-white/20">
                {themes[child.current_theme as ThemeId]?.mascot || '🎨'}
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-green-400">Currently Active Theme</p>
                <h3 className="text-2xl font-bold text-green-300">
                  {themes[child.current_theme as ThemeId]?.name || 'Default'}
                </h3>
                <p className="text-sm text-green-200/80">
                  {child.name} is using this theme right now
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Show message when no themes from database */}
        {freeThemes.length === 0 && purchasedThemes.length === 0 && (
          <Card className="p-6 border-2 border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2 bg-yellow-500/20">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-yellow-300">Theme Management Coming Soon</h3>
                <p className="text-sm text-yellow-200/80">
                  {child.name} is currently using the <strong>{child.current_theme || 'default'}</strong> theme.
                  Advanced theme management (hide/show themes, purchases) will be available soon.
                  For now, {child.name} can change their theme from their own Settings page.
                </p>
              </div>
            </div>
          </Card>
        )}

        {freeThemes.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className={`text-2xl font-bold text-white`}>Free Themes</h2>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold bg-white/10 text-gray-300`}>
              {freeThemes.length} themes
            </span>
          </div>
          <p className={`mb-6 text-gray-400`}>
            These themes came free with {child.name}&apos;s grade level
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {freeThemes.map((ownedTheme, i) => {
              const themeId = ownedTheme.theme_id as ThemeId;
              const theme = themes[themeId];
              const isDisabled = disabledThemes.includes(themeId);
              const isActive = child.current_theme === themeId;
              const isProcessing = processingTheme === themeId;

              if (!theme) return null;

              return (
                <PremiumCard key={themeId} delay={i * 0.05} className={`p-6 border-4 ${dashTheme.border}`}>
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-xl text-4xl shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      }}
                    >
                      {theme.mascot}
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                        <Check className="h-3 w-3" />
                        Active
                      </div>
                    )}
                  </div>

                  <h3 className={`mb-1 text-lg font-bold text-white`}>{theme.name}</h3>
                  <p className={`mb-4 text-sm text-gray-400`}>
                    {theme.coinName} • {theme.shopName}
                  </p>

                  <Button
                    onClick={() => toggleThemeDisabled(themeId)}
                    disabled={isProcessing}
                    variant={isDisabled ? 'default' : 'outline'}
                    className={`w-full ${isDisabled ? 'bg-slate-600 hover:bg-slate-700' : ''}`}
                  >
                    {isDisabled ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hidden (Click to Show)
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Visible (Click to Hide)
                      </>
                    )}
                  </Button>
                </PremiumCard>
              );
            })}
          </div>
        </div>
        )}

        {purchasedThemes.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <h2 className={`text-2xl font-bold text-white`}>Purchased Themes</h2>
              <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-semibold text-yellow-800">
                {purchasedThemes.length} themes
              </span>
            </div>
            <p className={`mb-6 text-gray-400`}>
              {child.name} earned these themes with their coins!
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {purchasedThemes.map((ownedTheme, i) => {
                const themeId = ownedTheme.theme_id as ThemeId;
                const theme = themes[themeId];
                const isDisabled = disabledThemes.includes(themeId);
                const isActive = child.current_theme === themeId;
                const isProcessing = processingTheme === themeId;

                if (!theme) return null;

                return (
                  <PremiumCard key={themeId} delay={i * 0.05} className={`p-6 border-4 ${dashTheme.border}`}>
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-xl text-4xl shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                        }}
                      >
                        {theme.mascot}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isActive && (
                          <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                            <Check className="h-3 w-3" />
                            Active
                          </div>
                        )}
                        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                          <Crown className="h-3 w-3" />
                          Earned
                        </div>
                      </div>
                    </div>

                    <h3 className={`mb-1 text-lg font-bold text-white`}>{theme.name}</h3>
                    <p className={`mb-1 text-sm text-gray-400`}>
                      {theme.coinName} • {theme.shopName}
                    </p>
                    <p className={`mb-4 text-xs text-gray-500`}>
                      Purchased {new Date(ownedTheme.purchased_at).toLocaleDateString()}
                    </p>

                    <Button
                      onClick={() => toggleThemeDisabled(themeId)}
                      disabled={isProcessing}
                      variant={isDisabled ? 'default' : 'outline'}
                      className={`w-full ${isDisabled ? 'bg-slate-600 hover:bg-slate-700' : ''}`}
                    >
                      {isDisabled ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hidden (Click to Show)
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Visible (Click to Hide)
                        </>
                      )}
                    </Button>
                  </PremiumCard>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
