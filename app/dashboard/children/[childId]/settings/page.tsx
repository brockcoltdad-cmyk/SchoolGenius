'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Check, Crown, Lock, Unlock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumCard from '@/components/ui/premium-card';
import { createClient } from '@/lib/supabase-client';
import { themes, type ThemeId } from '@/lib/theme-context';
import { useToast } from '@/hooks/use-toast';

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
        .select('id, name, grade_level, current_theme')
        .eq('id', childId)
        .eq('parent_id', user.id)
        .single();

      if (childError) throw childError;
      setChild(childData);

      const { data: themesData, error: themesError } = await supabase
        .from('owned_themes')
        .select('theme_id, is_free, purchased_at')
        .eq('child_id', childId)
        .order('purchased_at', { ascending: false });

      if (themesError) throw themesError;
      setOwnedThemes(themesData || []);

      const { data: disabledData, error: disabledError } = await supabase
        .from('disabled_themes')
        .select('theme_id')
        .eq('child_id', childId);

      if (disabledError) throw disabledError;
      setDisabledThemes(disabledData?.map((d: any) => d.theme_id as ThemeId) || []);
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
          .from('disabled_themes')
          .delete()
          .eq('child_id', childId)
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
          .from('disabled_themes')
          .insert({
            child_id: childId,
            theme_id: themeId,
            disabled_by: user.id,
          } as any);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Card className="mx-auto mt-12 max-w-md p-12 text-center">
          <p className="text-slate-600">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!child) {
    return null;
  }

  const freeThemes = ownedThemes.filter(t => t.is_free);
  const purchasedThemes = ownedThemes.filter(t => !t.is_free);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-12">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-800">
              {child.name}'s Theme Settings
            </h1>
            <p className="text-lg text-slate-600">
              Control which themes {child.name} can see and use
            </p>
          </div>

          <Card className="bg-blue-50 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-blue-900">How Theme Controls Work</h3>
                <p className="text-sm text-blue-800">
                  Click the eye icon to hide themes from your child. Hidden themes won't appear in their Settings or Shop.
                  You can always re-enable them later.
                </p>
              </div>
            </div>
          </Card>

          {child.current_theme && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-5xl shadow-lg">
                  {themes[child.current_theme as ThemeId]?.mascot || '🎨'}
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-green-700">Currently Active Theme</p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {themes[child.current_theme as ThemeId]?.name || 'Default'}
                  </h3>
                  <p className="text-sm text-green-700">
                    {child.name} is using this theme right now
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">Free Themes</h2>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                {freeThemes.length} themes
              </span>
            </div>
            <p className="mb-6 text-slate-600">
              These themes came free with {child.name}'s grade level
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
                  <PremiumCard key={themeId} delay={i * 0.05} className="p-6">
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

                    <h3 className="mb-1 text-lg font-bold text-slate-800">{theme.name}</h3>
                    <p className="mb-4 text-sm text-slate-600">
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

          {purchasedThemes.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">Purchased Themes</h2>
                <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-semibold text-yellow-800">
                  {purchasedThemes.length} themes
                </span>
              </div>
              <p className="mb-6 text-slate-600">
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
                    <PremiumCard key={themeId} delay={i * 0.05} className="p-6">
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

                      <h3 className="mb-1 text-lg font-bold text-slate-800">{theme.name}</h3>
                      <p className="mb-1 text-sm text-slate-600">
                        {theme.coinName} • {theme.shopName}
                      </p>
                      <p className="mb-4 text-xs text-slate-500">
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
      </main>
    </div>
  );
}
