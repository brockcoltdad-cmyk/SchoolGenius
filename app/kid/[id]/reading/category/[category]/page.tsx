'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, BookOpen, Star, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import { createClient } from '@/lib/supabase/client';

// Category icons matching the main page
const CATEGORY_ICONS: Record<string, string> = {
  'Dinosaur Adventures': '🦖',
  'Space Explorers': '🚀',
  'Superhero Kids': '🦸',
  'Pirate Treasure': '🏴‍☠️',
  'Robot Friends': '🤖',
  'Jungle Safari': '🦁',
  'Sports Fun': '⚽',
  'Building Things': '🔨',
  'Racing Cars': '🏎️',
  'Ninja Warriors': '🥷',
  'Wizard Academy': '🧙',
  'Dragon Riders': '🐉',
  'Time Travel': '⏰',
  'Spy Adventures': '🕵️',
  'Alien Encounters': '👽',
  'Fairy Tales': '🧚',
  'Princess Stories': '👸',
  'Animal Friends': '🐕',
  'Magic & Wizards': '🪄',
  'Ocean Mermaids': '🧜‍♀️',
  'Dance & Music': '💃',
  'Art & Creativity': '🎨',
  'Garden Fairies': '🌸',
  'Unicorn Dreams': '🦄',
  'Friendship Stories': '👯',
  'Horse Ranch': '🐴',
  'Mystery Detective': '🔍',
  'Silly Stories': '😂',
  'Family Fun': '👨‍👩‍👧',
  'School Adventures': '🏫',
  'Nature & Animals': '🌲',
  'Holiday Magic': '🎄',
  'Funny Stories': '🤣',
  'Sports Champions': '🏆',
  'Treasure Hunters': '💎',
};

interface Story {
  id: string;
  title: string;
  content: string;
  word_count: number;
  expected_time_minutes: number;
  lexile_band: string;
  reading_strategy: string;
  times_read: number;
}

export default function CategoryStoriesPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;
  const categoryName = decodeURIComponent(params.category as string);

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [childProgress, setChildProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchStories() {
      const supabase = createClient();

      // Get stories in this category
      const { data: storiesData } = await supabase
        .from('stories')
        .select('id, title, content, word_count, expected_time_minutes, lexile_band, reading_strategy, times_read')
        .eq('category', categoryName)
        .order('created_at', { ascending: true });

      if (storiesData) {
        setStories(storiesData);
      }

      // Get child's reading progress
      const { data: progress } = await supabase
        .from('reading_progress')
        .select('story_id, completed')
        .eq('child_id', kidId);

      if (progress) {
        const progressMap: Record<string, boolean> = {};
        progress.forEach(p => {
          progressMap[p.story_id] = p.completed;
        });
        setChildProgress(progressMap);
      }

      setLoading(false);
    }

    fetchStories();
  }, [kidId, categoryName]);

  const categoryIcon = CATEGORY_ICONS[categoryName] || '📖';

  const StoryCard = ({ story, index }: { story: Story; index: number }) => {
    const isCompleted = childProgress[story.id];
    const excerpt = story.content?.substring(0, 150) + '...';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.02, y: -3 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href={`/kid/${kidId}/reading/story/${story.id}`}>
          <Card className={`${currentTheme.cardClass} overflow-hidden cursor-pointer group relative`}>
            {isCompleted && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Read!
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {categoryIcon}
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold text-lg mb-1 group-hover:opacity-80 transition-opacity"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {story.title}
                  </h3>
                  <p
                    className="text-sm opacity-70 mb-3 line-clamp-2"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {excerpt}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs">
                    <span
                      className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full"
                      style={{ color: currentTheme.colors.text }}
                    >
                      <Clock className="h-3 w-3" />
                      {story.expected_time_minutes || 20} min
                    </span>
                    <span
                      className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full"
                      style={{ color: currentTheme.colors.text }}
                    >
                      <BookOpen className="h-3 w-3" />
                      {story.word_count || '~300'} words
                    </span>
                    {story.lexile_band && (
                      <span
                        className="bg-white/20 px-2 py-1 rounded-full"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {story.lexile_band}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  };

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
              {categoryIcon}
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
                href={`/kid/${kidId}/reading`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Library
              </Link>
              <div className="flex items-center gap-2 text-sm" style={{ color: currentTheme.colors.text }}>
                <span>{stories.length} stories</span>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-4xl px-4 py-8">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-6xl inline-block mb-4"
              >
                {categoryIcon}
              </motion.span>
              <h1 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                {categoryName}
              </h1>
              <p className="text-lg opacity-80" style={{ color: currentTheme.colors.text }}>
                Choose a story to read!
              </p>
            </motion.div>

            {stories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: currentTheme.colors.primary }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                  Stories Loading...
                </h2>
                <p className="opacity-70" style={{ color: currentTheme.colors.text }}>
                  New stories in this category are being added. Check back soon!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {stories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
