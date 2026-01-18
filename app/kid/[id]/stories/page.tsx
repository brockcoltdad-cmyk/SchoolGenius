'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle, Star, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import { useStoryLibrary } from '@/hooks/useStoryLibrary';
import { createClient } from '@/lib/supabase/client';

const GRADE_TABS = [
  { value: undefined, label: 'All' },
  { value: 0, label: 'K' },
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
  { value: 4, label: '4th' },
  { value: 5, label: '5th+' },
];

export default function StoriesPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);
  const [childGrade, setChildGrade] = useState<number>(0);

  const { stories, loading, error } = useStoryLibrary(kidId, selectedGrade);

  // Get child's grade level
  useEffect(() => {
    async function fetchChildGrade() {
      const supabase = createClient();
      const { data } = await supabase
        .from('children')
        .select('grade_level')
        .eq('id', kidId)
        .single();

      if (data?.grade_level !== undefined) {
        setChildGrade(data.grade_level);
        // Default to child's grade
        setSelectedGrade(data.grade_level);
      }
    }
    fetchChildGrade();
  }, [kidId]);

  const completedCount = stories.filter(s => s.completed).length;
  const totalCount = stories.length;

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-24">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl sticky top-0 z-20">
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

                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{completedCount} / {totalCount} completed</span>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                📚 Story Library
              </h1>
              <p className="text-white/70">
                Read stories and take quizzes to earn coins!
              </p>
            </motion.div>

            {/* Grade Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {GRADE_TABS.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setSelectedGrade(tab.value)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedGrade === tab.value
                      ? 'text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  style={
                    selectedGrade === tab.value
                      ? { background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }
                      : {}
                  }
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p className="text-white/70">Loading stories...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && stories.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No stories found for this grade level.</p>
              </div>
            )}

            {/* Story Grid */}
            {!loading && !error && stories.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story, i) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/kid/${kidId}/stories/${story.id}`}>
                      <Card className={`${currentTheme.cardClass} overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer relative`}>
                        {/* Completion Badge */}
                        {story.completed && (
                          <div className="absolute top-3 right-3 z-10 bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        )}

                        {/* Cover Image/Color */}
                        <div className={`h-32 ${story.coverColor || 'bg-gradient-to-br from-blue-400 to-purple-500'} flex items-center justify-center`}>
                          <BookOpen className="h-12 w-12 text-white/50" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              Grade {story.gradeLevel === 0 ? 'K' : story.gradeLevel}
                            </span>
                            <span className="inline-block rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                              {story.lexileLevel}L
                            </span>
                            {story.completed && story.score !== undefined && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                <Star className="h-3 w-3" />
                                {story.score}%
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                            {story.title}
                          </h3>

                          {/* Preview */}
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                            {story.preview}
                          </p>

                          {/* Read Button */}
                          <div
                            className={`w-full py-2.5 rounded-xl text-white font-semibold text-center ${
                              story.completed ? 'bg-green-500' : ''
                            }`}
                            style={!story.completed ? {
                              background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                            } : {}}
                          >
                            {story.completed ? 'Read Again' : 'Read Story'}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
