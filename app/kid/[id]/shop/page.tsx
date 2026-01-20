'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Crown, Check, Loader2, Sparkles } from 'lucide-react';
import PremiumCard from '@/components/ui/premium-card';
import PremiumButton from '@/components/ui/premium-button';
import SkeletonLoader from '@/components/ui/skeleton-loader';
import AgeCelebration from '@/components/animations/AgeCelebration';
import GigiCharacter from '@/components/animations/GigiCharacter';
import CoinBurst from '@/components/animations/CoinBurst';
import ShimmerEffect from '@/components/animations/ShimmerEffect';
import PulseGlow from '@/components/animations/PulseGlow';
import { useTheme, themes, type ThemeId } from '@/lib/theme-context';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { getThemesForGrade, getThemePrice } from '@/lib/theme-config';
import { useToast } from '@/hooks/use-toast';
import { useThemedCurrency } from '@/lib/themed-currency';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';

export default function ShopPage() {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();
  const params = useParams();
  const kidId = params.id as string;
  const { toast } = useToast();

  const [coins, setCoins] = useState(0);
  const [childGrade, setChildGrade] = useState('');
  const [ownedThemes, setOwnedThemes] = useState<ThemeId[]>([]);
  const [disabledThemes, setDisabledThemes] = useState<ThemeId[]>([]);
  const [purchasingTheme, setPurchasingTheme] = useState<ThemeId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showCoinBurst, setShowCoinBurst] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        const { data: child } = await supabase
          .from('children')
          .select('coins, grade_level')
          .eq('id', kidId)
          .single();

        if (child) {
          setCoins(child.coins || 0);
          setChildGrade(child.grade_level || '');
        }

        const { data: themesData } = await supabase
          .from('student_themes')
          .select('theme_id')
          .eq('student_id', kidId);

        if (themesData) {
          setOwnedThemes(themesData.map(t => t.theme_id as ThemeId).filter(Boolean));
        }

        // Note: disabled_themes table doesn't exist in current schema
        // If you need to track disabled themes, you may need to add this table
        // or use a different approach (e.g., a column in student_themes)
        setDisabledThemes([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [kidId]);

  const handlePurchase = async (themeId: ThemeId) => {
    // All themes are FREE - no coin restrictions
    setPurchasingTheme(themeId);

    try {
      const supabase = createClient();

      const { error: themeError } = await supabase
        .from('student_themes')
        .insert({ student_id: kidId, theme_id: themeId, is_active: false });

      if (themeError) throw themeError;

      // No coins deducted - themes are free
      setOwnedThemes([...ownedThemes, themeId]);

      setTimeout(() => {
        setCelebrationMessage(`${themes[themeId].name} Theme Unlocked!`);
        setShowCelebration(true);
      }, 500);

      setTimeout(() => {
        toast({
          title: 'Theme unlocked!',
          description: `${themes[themeId].name} is now yours! Check Settings to use it.`,
        });
      }, 3000);
    } catch (error) {
      console.error('Error purchasing theme:', error);
      toast({
        title: 'Unlock failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setPurchasingTheme(null);
    }
  };

  const allThemes = childGrade
    ? getThemesForGrade(childGrade).filter(themeId => !disabledThemes.includes(themeId))
    : [];

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />
        <div className="min-h-screen pb-24 relative z-10">
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/kid/${kidId}`}
              className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
              style={{ color: currentTheme.colors.primary }}
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
            <motion.div
              className="relative flex items-center gap-2 rounded-xl bg-yellow-400/20 px-4 py-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PulseGlow color="#fbbf24" size="sm" intensity="low" />
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <span className="text-2xl">{currency.icon}</span>
              </motion.div>
              <motion.span
                className="font-bold text-yellow-900"
                key={coins}
                initial={{ scale: 1.5, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                {coins} {currency.name}
              </motion.span>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
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
              <GigiCharacter size="lg" showName={false} showGreeting={false} className="mb-4" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-5xl font-bold"
              style={{ color: currentTheme.colors.primary }}
            >
              🛒 {currency.shopName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Earn {currency.name.toLowerCase()} and unlock amazing themes!
            </motion.p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
              🎨 Unlock New Themes
            </h2>
            <p className="mb-6 text-lg" style={{ color: currentTheme.colors.textSecondary }}>
              Earn {currency.name.toLowerCase()} by completing lessons to unlock amazing themes!
            </p>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SkeletonLoader variant="card" count={6} />
              </div>
            ) : allThemes.length === 0 ? (
              <PremiumCard className="p-8 text-center">
                <Sparkles className="mx-auto h-16 w-16 mb-4" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                  No themes available
                </h3>
                <p style={{ color: currentTheme.colors.textSecondary }}>
                  Check back later for new themes!
                </p>
              </PremiumCard>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allThemes.map((themeId, i) => {
                  const theme = themes[themeId];
                  const isOwned = ownedThemes.includes(themeId);
                  const isPurchasing = purchasingTheme === themeId;
                  // All themes are free!

                  return (
                    <motion.div
                      key={themeId}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.08,
                        type: 'spring',
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: isPurchasing ? 1 : 1.05,
                        y: isPurchasing ? 0 : -8,
                        transition: { type: 'spring', stiffness: 400, damping: 10 }
                      }}
                    >
                      <PremiumCard
                        delay={0}
                        hoverable={false}
                        className={`relative overflow-hidden p-6 ${isOwned ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                      >
                        <ShimmerEffect active={!isOwned} speed={3} color="rgba(251, 191, 36, 0.3)">
                          {isOwned && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', delay: i * 0.08 + 0.3 }}
                              className="absolute top-3 right-3 z-10"
                            >
                              <div className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                <Check className="h-3 w-3" />
                                Owned
                              </div>
                            </motion.div>
                          )}

                          <motion.div
                            className="mb-4 flex h-32 items-center justify-center rounded-xl text-6xl relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                            }}
                            whileHover={{
                              scale: 1.1,
                              rotate: 5,
                              transition: { type: 'spring', stiffness: 400, damping: 10 }
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <motion.div
                              className="relative z-10"
                              animate={{
                                rotate: [0, -5, 5, -5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                              }}
                            >
                              {theme.mascot}
                            </motion.div>
                          </motion.div>
                        <h3 className="mb-2 text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                          {theme.name}
                        </h3>
                        <p className="mb-3 text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          {theme.coinName} • {theme.shopName}
                        </p>
                        <div className="mb-4 flex items-center gap-2">
                          <span className="text-2xl">🎁</span>
                          <span className="font-bold text-green-600">
                            FREE
                          </span>
                        </div>

                        {isOwned ? (
                          <Link href={`/kid/${kidId}/settings`}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all"
                              style={{
                                backgroundColor: theme.colors.primary + '20',
                                color: theme.colors.primary,
                              }}
                            >
                              <Sparkles className="h-5 w-5" />
                              Use in Settings
                            </motion.div>
                          </Link>
                        ) : (
                          <PremiumButton
                            onClick={() => handlePurchase(themeId)}
                            disabled={isPurchasing}
                            className="w-full"
                            style={{
                              background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                              color: 'white',
                            }}
                          >
                            {isPurchasing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Unlocking...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Unlock Theme
                              </>
                            )}
                          </PremiumButton>
                        )}
                        </ShimmerEffect>
                      </PremiumCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <CoinBurst
        show={showCoinBurst}
        count={coinsEarned}
        onComplete={() => setShowCoinBurst(false)}
      />

      <AgeCelebration
        show={showCelebration}
        grade={childGrade}
        message={celebrationMessage}
        onComplete={() => setShowCelebration(false)}
      />
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
