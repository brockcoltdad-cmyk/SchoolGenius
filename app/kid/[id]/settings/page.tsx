'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Volume2, VolumeX, Mic, MicOff, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import PremiumCard from '@/components/ui/premium-card';
import SkeletonLoader from '@/components/ui/skeleton-loader';
import ThemeSwitchEffect from '@/components/animations/ThemeSwitchEffect';
import GigiCharacter from '@/components/animations/GigiCharacter';
import PulseGlow from '@/components/animations/PulseGlow';
import SuccessRipple from '@/components/animations/SuccessRipple';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTheme, themes, type ThemeId } from '@/lib/theme-context';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import type { Child, OwnedTheme, DisabledTheme } from '@/types/database';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { CharacterSelection } from '@/components/theme/CharacterSelection';
import { ThemeProgressBar } from '@/components/theme/ThemeProgressBar';
import { LevelUpCelebration, VictoryCelebration } from '@/components/theme/LevelUpCelebration';
import { useThemeSkin, getSkinsWithUnlockStatus } from '@/lib/use-theme-skin';

export default function SettingsPage() {
  const { currentTheme, setTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const kidId = params.id as string;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [ownedThemes, setOwnedThemes] = useState<ThemeId[]>([]);
  const [disabledThemes, setDisabledThemes] = useState<ThemeId[]>([]);
  const [childGrade, setChildGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showThemeSwitch, setShowThemeSwitch] = useState(false);
  const [switchingTheme, setSwitchingTheme] = useState<ThemeId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [childCoins, setChildCoins] = useState(0);

  const { progress, currentSkin, skins, updateSkin, addXP, isLoading: skinLoading } = useThemeSkin(kidId, currentTheme.id);

  useEffect(() => {
    async function fetchChildData() {
      try {
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
        const isSimpleId = !kidId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

        if (isDemoMode || isSimpleId) {
          // Use mock data for demo - unlock ALL themes
          setChildGrade(kidId === '1' ? '3' : '5');
          setOwnedThemes([
            'default', 'dinosaur', 'battle', 'builder', 'unicorn', 'space', 'robot', 'pirate', 'monster', 'hero',
            'dreams', 'mermaid', 'princess', 'rainbow', 'victory', 'cube', 'web', 'creatures', 'glam', 'fashion',
            'ice', 'pony', 'neon', 'anime', 'sneaker', 'esports', 'aesthetic', 'kpop', 'softgirl', 'cottagecore',
            'minimal', 'cyberpunk', 'coder', 'streetwear', 'shark', 'butterfly', 'kitten', 'fairy', 'ballerina',
            'ninja', 'zombie', 'racecar', 'mech', 'popstar', 'cupcake', 'friendship', 'kawaii', 'graffiti', 'hiphop',
            'scifi', 'darkninja', 'y2k', 'zodiac', 'bookworm', 'dance', 'lofi', 'finance', 'gym', 'nightowl',
            'cleangirl', 'sage', 'coffee', 'study', 'parisian', 'wellness', 'vintage', 'moonlight', 'safari', 'farm',
            'candy', 'construction', 'firefighter', 'ocean', 'jungle', 'arctic', 'teddy', 'puppy', 'bug', 'train',
            'beach', 'camping', 'volcano', 'planet', 'slime', 'bracelet', 'artstudio', 'spaday', 'petgroomer', 'moviestar'
          ]);
          setDisabledThemes([]);
          setIsLoading(false);
          return;
        }

        const supabase = createClient();

        const { data: child } = await supabase
          .from('children')
          .select('grade_level, current_theme, coins')
          .eq('id', kidId)
          .single<Pick<Child, 'grade_level' | 'current_theme' | 'coins'>>();

        if (child) {
          setChildGrade(child.grade_level || '');
          setChildCoins(child.coins || 0);
          if (child.current_theme) {
            setTheme(child.current_theme as ThemeId);
          }
        }

        const { data: themes } = await supabase
          .from('student_themes')
          .select('theme_id')
          .eq('student_id', kidId)
          .returns<Pick<OwnedTheme, 'theme_id'>[]>();

        if (themes) {
          setOwnedThemes(themes.map(t => t.theme_id as ThemeId).filter(Boolean));
        }

        const { data: disabled } = await supabase
          .from('student_themes')
          .select('theme_id')
          .eq('student_id', kidId)
          .eq('is_active', false)
          .returns<Pick<DisabledTheme, 'theme_id'>[]>();

        if (disabled) {
          setDisabledThemes(disabled.map(t => t.theme_id as ThemeId));
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChildData();
  }, [kidId, setTheme]);

  const handleThemeChange = async (themeId: ThemeId) => {
    setSwitchingTheme(themeId);
    setShowThemeSwitch(true);

    try {
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
      const isSimpleId = !kidId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (!isDemoMode && !isSimpleId) {
        const supabase = createClient();
        const { error } = await supabase
          .from('children')
          .update({ current_theme: themeId })
          .eq('id', kidId);

        if (error) throw error;
      }

      setTimeout(() => {
        setTheme(themeId);
      }, 1000);

      setTimeout(() => {
        setShowSuccess(true);
      }, 2000);

      setTimeout(() => {
        toast({
          title: 'Theme activated!',
          description: `Your whole app is now ${themes[themeId].name} themed!`,
        });
      }, 2500);

      setTimeout(() => {
        router.push(`/kid/${kidId}`);
      }, 3500);
    } catch (error) {
      console.error('Error updating theme:', error);
      setShowThemeSwitch(false);
      toast({
        title: 'Error',
        description: 'Failed to update theme',
        variant: 'destructive',
      });
    }
  };

  const handleSkinSelect = async (skinId: string) => {
    try {
      await updateSkin(skinId);
      setShowSuccess(true);
      toast({
        title: 'Character Selected!',
        description: `${currentSkin.name} is now your active character!`,
      });
    } catch (error) {
      console.error('Error selecting skin:', error);
      toast({
        title: 'Error',
        description: 'Failed to select character',
        variant: 'destructive',
      });
    }
  };

  const handlePurchaseSkin = async (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    if (!skin) return;

    if (childCoins < skin.coinCost) {
      toast({
        title: 'Not enough coins!',
        description: `You need ${skin.coinCost - childCoins} more coins to unlock this character.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
      const isSimpleId = !kidId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (!isDemoMode && !isSimpleId) {
        const supabase = createClient();
        const { error } = await supabase
          .from('children')
          .update({ coins: childCoins - skin.coinCost })
          .eq('id', kidId);

        if (error) throw error;
      }

      setChildCoins(prev => prev - skin.coinCost);
      await updateSkin(skinId);

      toast({
        title: 'Character Unlocked!',
        description: `You unlocked ${skin.name}!`,
      });
    } catch (error) {
      console.error('Error purchasing skin:', error);
      toast({
        title: 'Error',
        description: 'Failed to purchase character',
        variant: 'destructive',
      });
    }
  };

  return (
    <ThemedBackground>
      <div className="pb-24">
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link
            href={`/kid/${kidId}`}
            className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
            style={{ color: currentTheme.colors.primary }}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
            >
              <GigiCharacter size="lg" showName={false} className="mb-4" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold"
              style={{ color: currentTheme.colors.primary }}
            >
              ⚙️ Settings
            </motion.h1>
            <p className="mt-2 text-lg" style={{ color: currentTheme.colors.textSecondary }}>
              Personalize your learning experience!
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-2xl font-bold"
              style={{ color: currentTheme.colors.primary }}
            >
              Choose Your Theme
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Pick the theme that makes learning most fun for you!
            </motion.p>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SkeletonLoader variant="card" count={6} />
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {ownedThemes.filter(id => themes[id] && !disabledThemes.includes(id)).map((themeId, i) => {
                    const theme = themes[themeId];
                    const isSelected = currentTheme.id === themeId;

                    return (
                      <motion.button
                        key={themeId}
                        onClick={() => handleThemeChange(themeId)}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.08,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        whileHover={{
                          scale: 1.08,
                          y: -12,
                          rotate: isSelected ? 0 : 2,
                          transition: { type: 'spring', stiffness: 400, damping: 10 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
                          isSelected ? 'ring-4 ring-white ring-offset-4 shadow-2xl' : 'hover:shadow-2xl'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                        }}
                      >
                        {isSelected && (
                          <PulseGlow color={theme.colors.primary} size="lg" intensity="medium" />
                        )}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.3 }}
                        />

                        <div className="relative z-10">
                          <div className="mb-3 flex items-center justify-between">
                            <motion.div
                              className="text-5xl"
                              animate={{
                                rotate: isSelected ? [0, -5, 5, -5, 0] : 0,
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: isSelected ? Infinity : 0,
                                repeatDelay: 2,
                              }}
                              whileHover={{
                                scale: 1.3,
                                rotate: 15,
                                y: -5,
                                transition: { type: 'spring', stiffness: 400, damping: 10 }
                              }}
                            >
                              {theme.mascot}
                            </motion.div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
                              >
                                <Check className="h-6 w-6" style={{ color: theme.colors.primary }} />
                              </motion.div>
                            )}
                          </div>
                          <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">{theme.name}</h3>
                          <div className="space-y-1 text-sm text-white/90">
                            <p>{theme.coinName} currency</p>
                            <p>{theme.shopName}</p>
                          </div>
                        </div>

                        <div className="relative z-10 mt-4 flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.3 }}
                            className="h-4 w-4 rounded-full border-2 border-white/50 shadow-md"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <motion.div
                            whileHover={{ scale: 1.3 }}
                            className="h-4 w-4 rounded-full border-2 border-white/50 shadow-md"
                            style={{ backgroundColor: theme.colors.secondary }}
                          />
                          <motion.div
                            whileHover={{ scale: 1.3 }}
                            className="h-4 w-4 rounded-full border-2 border-white/50 shadow-md"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <PulseGlow color={currentTheme.colors.primary} size="lg" intensity="low" />
                  <Link
                    href={`/kid/${kidId}/shop`}
                    className="relative z-10 flex items-center justify-center gap-3 rounded-2xl py-5 px-6 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <ShoppingBag className="h-6 w-6" />
                    </motion.div>
                    Want More Themes? Visit the Shop!
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {skins.length > 1 && (
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4 text-3xl font-black text-center"
                style={{ color: currentTheme.colors.primary }}
              >
                ⚔️ Choose Your Character
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 text-center"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                Select your character skin! Complete tasks to level up and unlock more characters!
              </motion.p>

              <ThemeProgressBar
                xp={progress.xp}
                level={progress.level}
                showStats={true}
                completedTasks={0}
              />

              <div className="mt-12">
                {skinLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <SkeletonLoader variant="card" count={4} />
                  </div>
                ) : (
                  <CharacterSelection
                    skins={getSkinsWithUnlockStatus(skins, progress.level, [])}
                    selectedSkin={progress.selectedSkin}
                    currentLevel={progress.level}
                    currentCoins={childCoins}
                    onSelectSkin={handleSkinSelect}
                    onPurchaseSkin={handlePurchaseSkin}
                  />
                )}
              </div>
            </div>
          )}

          <Card className={`${currentTheme.cardClass} p-6`}>
            <h2 className="mb-6 text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
              Sound & Voice
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                  ) : (
                    <VolumeX className="h-6 w-6 text-slate-400" />
                  )}
                  <div>
                    <p className="font-semibold" style={{ color: currentTheme.colors.text }}>Sound Effects</p>
                    <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Hear sounds when you learn</p>
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {voiceEnabled ? (
                    <Mic className="h-6 w-6" style={{ color: currentTheme.colors.primary }} />
                  ) : (
                    <MicOff className="h-6 w-6 text-slate-400" />
                  )}
                  <div>
                    <p className="font-semibold" style={{ color: currentTheme.colors.text }}>Voice Reading</p>
                    <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Hear lessons read aloud</p>
                  </div>
                </div>
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold" style={{ color: currentTheme.colors.text }}>Volume</p>
                  <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>{volume[0]}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Tip:</strong> Sounds and voice help you learn! Ask a parent before turning these off.
              </p>
            </div>
          </Card>
        </motion.div>
      </main>

      {switchingTheme && (
        <ThemeSwitchEffect
          show={showThemeSwitch}
          themeName={themes[switchingTheme].name}
          mascot={themes[switchingTheme].mascot}
          colors={{
            primary: themes[switchingTheme].colors.primary,
            secondary: themes[switchingTheme].colors.secondary,
          }}
          onComplete={() => {
            setShowThemeSwitch(false);
            setSwitchingTheme(null);
          }}
        />
      )}

      <SuccessRipple
        show={showSuccess}
        message="Theme Activated!"
        color={currentTheme.colors.primary}
        onComplete={() => setShowSuccess(false)}
      />

      <LevelUpCelebration
        show={showLevelUp}
        level={newLevel}
        onComplete={() => setShowLevelUp(false)}
      />
      </div>
    </ThemedBackground>
  );
}
