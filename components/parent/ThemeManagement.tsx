'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Palette, Ban, Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumCard from '@/components/ui/premium-card';
import { createClient } from '@/lib/supabase-client';
import { themes, type ThemeId } from '@/lib/theme-context';
import { useToast } from '@/hooks/use-toast';

interface ThemeManagementProps {
  childId: string;
  childName: string;
}

export default function ThemeManagement({ childId, childName }: ThemeManagementProps) {
  const { toast } = useToast();
  const [ownedThemes, setOwnedThemes] = useState<ThemeId[]>([]);
  const [disabledThemes, setDisabledThemes] = useState<ThemeId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingTheme, setTogglingTheme] = useState<ThemeId | null>(null);

  useEffect(() => {
    fetchThemes();
  }, [childId]);

  async function fetchThemes() {
    try {
      // Demo mode with mock data
      setOwnedThemes(['default', 'battle', 'builder', 'unicorn'] as ThemeId[]);
      setDisabledThemes([]);
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleTheme(themeId: ThemeId) {
    setTogglingTheme(themeId);
    const isDisabled = disabledThemes.includes(themeId);

    try {
      // Demo mode - simulate toggle
      if (isDisabled) {
        setDisabledThemes(prev => prev.filter(id => id !== themeId));
        toast({
          title: 'Demo Mode',
          description: `${childName} can now use ${themes[themeId].name}`,
        });
      } else {
        setDisabledThemes(prev => [...prev, themeId]);
        toast({
          title: 'Demo Mode',
          description: `${childName} can no longer use ${themes[themeId].name}`,
        });
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to update theme access',
        variant: 'destructive',
      });
    } finally {
      setTogglingTheme(null);
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white/80 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-800">Theme Management</h3>
        </div>
        <p className="text-slate-600">Loading themes...</p>
      </Card>
    );
  }

  if (ownedThemes.length === 0) {
    return (
      <Card className="bg-white/80 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-800">Theme Management</h3>
        </div>
        <p className="text-slate-600">No themes owned yet</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-800">Theme Management</h3>
        </div>
        <p className="text-sm text-slate-600">
          Control which themes {childName} can access. Disabled themes will not appear in their Settings or Shop.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {ownedThemes.filter(id => themes[id]).map((themeId, i) => {
          const theme = themes[themeId];
          const isDisabled = disabledThemes.includes(themeId);
          const isToggling = togglingTheme === themeId;

          return (
            <motion.div
              key={themeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                isDisabled
                  ? 'border-red-200 bg-red-50 opacity-60'
                  : 'border-transparent bg-white shadow-md'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  }}
                >
                  {theme.mascot}
                </div>
                {isDisabled && (
                  <div className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                    <Ban className="h-3 w-3" />
                    Disabled
                  </div>
                )}
              </div>

              <h4 className="mb-1 font-bold text-slate-800">{theme.name}</h4>
              <p className="mb-3 text-xs text-slate-600">
                {theme.coinName} • {theme.shopName}
              </p>

              <Button
                onClick={() => toggleTheme(themeId)}
                disabled={isToggling}
                size="sm"
                variant={isDisabled ? 'default' : 'destructive'}
                className="w-full"
              >
                {isToggling ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Updating...
                  </>
                ) : isDisabled ? (
                  <>
                    <Check className="mr-2 h-3 w-3" />
                    Enable Theme
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-3 w-3" />
                    Disable Theme
                  </>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> {childName} can still earn coins and purchase themes freely. You can disable any theme at any time if you prefer they don't use it.
        </p>
      </div>
    </Card>
  );
}
