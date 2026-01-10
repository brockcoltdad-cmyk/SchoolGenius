import { createClient } from './supabase-client';
import { ThemeId } from './theme-context';
import { getFreeThemesForGrade, getThemesForGrade } from './theme-config';
import type { Child, OwnedTheme, DisabledTheme } from '@/types/database';

export async function assignFreeThemesToChild(childId: string, gradeLevel: string) {
  const supabase = createClient();
  const freeThemes = getFreeThemesForGrade(gradeLevel);

  const themesToInsert = freeThemes.map(themeId => ({
    child_id: childId,
    theme_id: themeId,
    is_free: true,
  }));

  const { error } = await supabase
    .from('owned_themes')
    .insert(themesToInsert);

  if (error) throw error;
}

export async function getOwnedThemes(childId: string): Promise<ThemeId[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('owned_themes')
    .select('theme_id')
    .eq('child_id', childId)
    .returns<Pick<OwnedTheme, 'theme_id'>[]>();

  if (error) throw error;

  return (data || []).map(row => row.theme_id as ThemeId);
}

export async function getDisabledThemes(childId: string): Promise<ThemeId[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('disabled_themes')
    .select('theme_id')
    .eq('child_id', childId)
    .returns<Pick<DisabledTheme, 'theme_id'>[]>();

  if (error) throw error;

  return (data || []).map(row => row.theme_id as ThemeId);
}

export async function getAvailableThemes(childId: string): Promise<ThemeId[]> {
  const [owned, disabled] = await Promise.all([
    getOwnedThemes(childId),
    getDisabledThemes(childId),
  ]);

  return owned.filter(themeId => !disabled.includes(themeId));
}

export async function purchaseTheme(childId: string, themeId: ThemeId, price: number) {
  const supabase = createClient();

  const { data: child, error: childError } = await supabase
    .from('children')
    .select('coins')
    .eq('id', childId)
    .maybeSingle<Pick<Child, 'coins'>>();

  if (childError) throw childError;
  if (!child) throw new Error('Child not found');
  if (child.coins < price) throw new Error('Not enough coins');

  const { error: themeError } = await supabase
    .from('owned_themes')
    .insert({
      child_id: childId,
      theme_id: themeId,
      is_free: false,
    });

  if (themeError) throw themeError;

  const { error: coinsError } = await supabase
    .from('children')
    .update({ coins: child.coins - price })
    .eq('id', childId);

  if (coinsError) throw coinsError;

  return child.coins - price;
}

export async function disableTheme(childId: string, themeId: ThemeId, parentId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('disabled_themes')
    .insert({
      child_id: childId,
      theme_id: themeId,
      disabled_by: parentId,
    });

  if (error && error.code !== '23505') {
    throw error;
  }
}

export async function enableTheme(childId: string, themeId: ThemeId) {
  const supabase = createClient();

  const { error } = await supabase
    .from('disabled_themes')
    .delete()
    .eq('child_id', childId)
    .eq('theme_id', themeId);

  if (error) throw error;
}

export async function getShopThemesForChild(childId: string, gradeLevel: string) {
  const allThemes = getThemesForGrade(gradeLevel);
  const [owned, disabled] = await Promise.all([
    getOwnedThemes(childId),
    getDisabledThemes(childId),
  ]);

  return allThemes.filter(themeId => !disabled.includes(themeId));
}

export const getButtonStyleClasses = (buttonStyle: string): string => {
  const styles: Record<string, string> = {
    'pixel': 'rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] border-4 border-black',
    'blocky': 'rounded-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] border-2',
    'soft': 'rounded-3xl shadow-xl hover:shadow-2xl border-0',
    'rounded': 'rounded-2xl shadow-lg hover:shadow-xl',
    'sharp': 'rounded-lg shadow-md hover:shadow-lg border-2',
    'minimal': 'rounded-md shadow-sm hover:shadow-md border border-gray-300',
    'neon': 'rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] border-2',
    'glow': 'rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]',
    'cyber': 'rounded-none shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] border border-cyan-400',
    'icy': 'rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-blue-200',
    'bouncy': 'rounded-2xl shadow-lg hover:shadow-xl border-2',
    'organic': 'rounded-3xl shadow-md hover:shadow-lg border-2',
    'railway': 'rounded-lg shadow-lg hover:shadow-xl border-4',
    'sandy': 'rounded-3xl shadow-md hover:shadow-lg border-2',
    'rustic': 'rounded-xl shadow-lg hover:shadow-xl border-2',
    'volcanic': 'rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] border-2',
    'planetary': 'rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] border-2',
    'furry': 'rounded-2xl shadow-lg hover:shadow-xl border-2',
    'default': 'rounded-xl shadow-lg hover:shadow-xl',
  };
  return styles[buttonStyle] || styles.default;
};

export const getCardStyleClasses = (cardStyle: string): string => {
  const styles: Record<string, string> = {
    'pixel': 'rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] border-4 border-black bg-white',
    'blocky': 'rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-3',
    'soft': 'rounded-3xl shadow-2xl backdrop-blur-lg bg-white/95',
    'glassmorphism': 'rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/20',
    'solid': 'rounded-2xl bg-white/90 shadow-lg border-2',
    'metal': 'rounded-xl bg-slate-900/80 backdrop-blur-sm shadow-lg border-2',
    'sharp': 'rounded-lg shadow-md border-2 border-gray-200 bg-white',
    'minimal': 'rounded-lg shadow-sm border border-gray-300 bg-white',
    'neon': 'rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-md bg-black/80 border-2',
    'glow': 'rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] backdrop-blur-sm bg-white/95',
    'cyber': 'rounded-none shadow-[0_0_15px_rgba(0,255,255,0.3)] border-2 border-cyan-400 bg-slate-900/90',
    'frost': 'rounded-3xl shadow-xl backdrop-blur-sm bg-white/95 border-2',
    'quilted': 'rounded-3xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'leafy': 'rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'station': 'rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'beachy': 'rounded-3xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'canvas': 'rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'molten': 'rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'orbital': 'rounded-3xl shadow-lg bg-white/90 backdrop-blur-sm border-2',
    'default': 'rounded-2xl shadow-xl backdrop-blur-sm bg-white/95',
  };
  return styles[cardStyle] || styles.default;
};

export const getBorderStyleClasses = (borderStyle: string): string => {
  const styles: Record<string, string> = {
    'pixel': 'border-4 border-black',
    'blocky': 'border-3',
    'soft': 'border-0',
    'sharp': 'border-2 border-gray-300',
    'minimal': 'border border-gray-200',
    'neon': 'border-2 border-current',
    'glow': 'border-0',
    'cyber': 'border-2 border-cyan-400',
    'crystal': 'border-4',
    'stitched': 'border-4',
    'paw-print': 'border-4',
    'antennae': 'border-4',
    'tracks': 'border-4',
    'waves': 'border-4',
    'rope': 'border-4',
    'lava': 'border-4',
    'rings': 'border-4',
    'default': 'border-2',
  };
  return styles[borderStyle] || styles.default;
};
