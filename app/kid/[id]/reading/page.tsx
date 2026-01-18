'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Sparkles, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';
import { createClient } from '@/lib/supabase/client';

// Category configurations with icons and colors
const CATEGORIES_CONFIG: Record<string, { icon: string; color: string; gradient: string }> = {
  // Boys favorites
  'Dinosaur Adventures': { icon: '🦖', color: 'bg-green-500', gradient: 'from-green-400 to-green-600' },
  'Space Explorers': { icon: '🚀', color: 'bg-purple-500', gradient: 'from-purple-400 to-indigo-600' },
  'Superhero Kids': { icon: '🦸', color: 'bg-red-500', gradient: 'from-red-400 to-red-600' },
  'Pirate Treasure': { icon: '🏴‍☠️', color: 'bg-amber-600', gradient: 'from-amber-500 to-amber-700' },
  'Robot Friends': { icon: '🤖', color: 'bg-slate-500', gradient: 'from-slate-400 to-slate-600' },
  'Jungle Safari': { icon: '🦁', color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600' },
  'Sports Fun': { icon: '⚽', color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
  'Building Things': { icon: '🔨', color: 'bg-yellow-600', gradient: 'from-yellow-500 to-yellow-700' },
  'Racing Cars': { icon: '🏎️', color: 'bg-red-600', gradient: 'from-red-500 to-red-700' },
  'Ninja Warriors': { icon: '🥷', color: 'bg-gray-700', gradient: 'from-gray-600 to-gray-800' },
  'Wizard Academy': { icon: '🧙', color: 'bg-purple-600', gradient: 'from-purple-500 to-purple-700' },
  'Dragon Riders': { icon: '🐉', color: 'bg-red-500', gradient: 'from-red-400 to-orange-600' },
  'Time Travel': { icon: '⏰', color: 'bg-blue-600', gradient: 'from-blue-500 to-cyan-600' },
  'Spy Adventures': { icon: '🕵️', color: 'bg-gray-600', gradient: 'from-gray-500 to-gray-700' },
  'Alien Encounters': { icon: '👽', color: 'bg-green-600', gradient: 'from-green-500 to-teal-600' },

  // Girls favorites
  'Fairy Tales': { icon: '🧚', color: 'bg-pink-400', gradient: 'from-pink-300 to-pink-500' },
  'Princess Stories': { icon: '👸', color: 'bg-pink-500', gradient: 'from-pink-400 to-rose-500' },
  'Animal Friends': { icon: '🐕', color: 'bg-amber-500', gradient: 'from-amber-400 to-amber-600' },
  'Magic & Wizards': { icon: '🪄', color: 'bg-violet-500', gradient: 'from-violet-400 to-purple-600' },
  'Ocean Mermaids': { icon: '🧜‍♀️', color: 'bg-cyan-500', gradient: 'from-cyan-400 to-blue-500' },
  'Dance & Music': { icon: '💃', color: 'bg-fuchsia-500', gradient: 'from-fuchsia-400 to-pink-500' },
  'Art & Creativity': { icon: '🎨', color: 'bg-rose-500', gradient: 'from-rose-400 to-pink-600' },
  'Garden Fairies': { icon: '🌸', color: 'bg-pink-400', gradient: 'from-pink-300 to-rose-400' },
  'Unicorn Dreams': { icon: '🦄', color: 'bg-purple-400', gradient: 'from-purple-300 to-pink-400' },
  'Friendship Stories': { icon: '👯', color: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500' },
  'Horse Ranch': { icon: '🐴', color: 'bg-amber-600', gradient: 'from-amber-500 to-orange-600' },
  'Mystery Detective': { icon: '🔍', color: 'bg-indigo-500', gradient: 'from-indigo-400 to-blue-600' },

  // Neutral/Universal
  'Silly Stories': { icon: '😂', color: 'bg-yellow-400', gradient: 'from-yellow-300 to-amber-500' },
  'Family Fun': { icon: '👨‍👩‍👧', color: 'bg-orange-400', gradient: 'from-orange-300 to-orange-500' },
  'School Adventures': { icon: '🏫', color: 'bg-blue-400', gradient: 'from-blue-300 to-blue-500' },
  'Nature & Animals': { icon: '🌲', color: 'bg-green-500', gradient: 'from-green-400 to-emerald-600' },
  'Holiday Magic': { icon: '🎄', color: 'bg-red-500', gradient: 'from-red-400 to-green-500' },
  'Funny Stories': { icon: '🤣', color: 'bg-yellow-500', gradient: 'from-yellow-400 to-orange-500' },
  'Sports Champions': { icon: '🏆', color: 'bg-amber-500', gradient: 'from-amber-400 to-yellow-600' },
  'Treasure Hunters': { icon: '💎', color: 'bg-cyan-600', gradient: 'from-cyan-500 to-blue-600' },
};

interface CategoryData {
  category: string;
  count: number;
  gender_target: string;
}

export default function ReadingLibraryPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [childGrade, setChildGrade] = useState<number>(3);
  const [readingLevel, setReadingLevel] = useState<string>('400L-600L');

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Get child's grade level
      const { data: child } = await supabase
        .from('children')
        .select('grade_level')
        .eq('id', kidId)
        .single();

      if (child) {
        setChildGrade(child.grade_level || 3);
      }

      // Get available categories with story counts
      const { data: stories } = await supabase
        .from('stories')
        .select('category, gender_target, lexile_band')
        .not('category', 'is', null);

      if (stories) {
        // Count stories per category
        const categoryMap = new Map<string, CategoryData>();
        stories.forEach(story => {
          if (story.category) {
            const key = story.category;
            if (categoryMap.has(key)) {
              categoryMap.get(key)!.count++;
            } else {
              categoryMap.set(key, {
                category: story.category,
                count: 1,
                gender_target: story.gender_target || 'neutral'
              });
            }
          }
          // Track reading level from first story
          if (story.lexile_band && !readingLevel) {
            setReadingLevel(story.lexile_band);
          }
        });

        setCategories(Array.from(categoryMap.values()));
      }

      setLoading(false);
    }

    fetchData();
  }, [kidId]);

  // Separate categories by gender target
  const boysCategories = categories.filter(c => c.gender_target === 'boys');
  const girlsCategories = categories.filter(c => c.gender_target === 'girls');
  const neutralCategories = categories.filter(c => c.gender_target === 'neutral');

  const getCategoryConfig = (category: string) => {
    return CATEGORIES_CONFIG[category] || {
      icon: '📖',
      color: 'bg-slate-500',
      gradient: 'from-slate-400 to-slate-600'
    };
  };

  const CategoryCard = ({ data, delay }: { data: CategoryData; delay: number }) => {
    const config = getCategoryConfig(data.category);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: delay * 0.05, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href={`/kid/${kidId}/reading/category/${encodeURIComponent(data.category)}`}>
          <Card className={`${currentTheme.cardClass} overflow-hidden cursor-pointer group`}>
            <div className={`h-24 bg-gradient-to-br ${config.gradient} flex items-center justify-center relative`}>
              <span className="text-5xl group-hover:scale-110 transition-transform">{config.icon}</span>
              {data.count > 0 && (
                <span className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                  {data.count} {data.count === 1 ? 'story' : 'stories'}
                </span>
              )}
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>
                {data.category}
              </h3>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  };

  const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 mb-4"
    >
      <span className="text-3xl">{icon}</span>
      <h2 className="text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
        {title}
      </h2>
    </motion.div>
  );

  if (loading) {
    return (
      <PageTransition>
        <ThemedBackground>
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-6xl"
            >
              📚
            </motion.div>
          </div>
        </ThemedBackground>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-24">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
              <Link
                href={`/kid/${kidId}`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <div className="flex items-center gap-2 text-sm" style={{ color: currentTheme.colors.text }}>
                <BookOpen className="h-4 w-4" />
                <span>Reading Level: {readingLevel}</span>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8">
            {/* Title with Gigi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex justify-center mb-4"
              >
                <GigiCharacter size="lg" showName={false} />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                📚 Reading Library
              </h1>
              <p className="text-lg opacity-80" style={{ color: currentTheme.colors.text }}>
                Pick a story category to start reading!
              </p>
            </motion.div>

            {categories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: currentTheme.colors.primary }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                  Stories Coming Soon!
                </h2>
                <p className="opacity-70" style={{ color: currentTheme.colors.text }}>
                  New stories are being added right now. Check back in a few minutes!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {/* Boys Favorites */}
                {boysCategories.length > 0 && (
                  <section>
                    <SectionHeader title="Adventure & Action" icon="⚔️" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {boysCategories.map((cat, i) => (
                        <CategoryCard key={cat.category} data={cat} delay={i} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Girls Favorites */}
                {girlsCategories.length > 0 && (
                  <section>
                    <SectionHeader title="Magic & Friendship" icon="✨" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {girlsCategories.map((cat, i) => (
                        <CategoryCard key={cat.category} data={cat} delay={i} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Neutral/Universal */}
                {neutralCategories.length > 0 && (
                  <section>
                    <SectionHeader title="For Everyone" icon="🌟" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {neutralCategories.map((cat, i) => (
                        <CategoryCard key={cat.category} data={cat} delay={i} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
