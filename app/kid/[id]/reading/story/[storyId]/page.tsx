'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, Lightbulb, Volume2, CheckCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';
import { createClient } from '@/lib/supabase/client';

interface VocabWord {
  word: string;
  definition: string;
  sentence?: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
  word_count: number;
  expected_time_minutes: number;
  lexile_band: string;
  reading_strategy: string;
  strategy_tip: string;
  vocabulary: VocabWord[];
  comprehension_questions: unknown[];
}

export default function StoryReaderPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const storyId = params.storyId as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVocab, setShowVocab] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [readingStarted, setReadingStarted] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    async function fetchStory() {
      const supabase = createClient();

      const { data } = await supabase
        .from('stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (data) {
        setStory(data);
        // Update times_read
        await supabase
          .from('stories')
          .update({ times_read: (data.times_read || 0) + 1 })
          .eq('id', storyId);
      }

      setLoading(false);
    }

    fetchStory();
  }, [storyId]);

  const handleStartReading = () => {
    setShowTip(false);
    setReadingStarted(true);
  };

  const handleTakeQuiz = async () => {
    // Track that they started reading
    const supabase = createClient();
    await supabase.from('reading_progress').upsert({
      child_id: kidId,
      story_id: storyId,
      started_at: new Date().toISOString(),
      completed: false
    }, { onConflict: 'child_id,story_id' });

    router.push(`/kid/${kidId}/reading/quiz/${storyId}`);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
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
              📖
            </motion.div>
          </div>
        </ThemedBackground>
      </PageTransition>
    );
  }

  if (!story) {
    return (
      <PageTransition>
        <ThemedBackground>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl mb-4 block">😔</span>
              <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                Story Not Found
              </h2>
              <Link href={`/kid/${kidId}/reading`} className="underline" style={{ color: currentTheme.colors.primary }}>
                Back to Library
              </Link>
            </div>
          </div>
        </ThemedBackground>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-32">
          {/* Header */}
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl sticky top-0 z-20">
            <div className="mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
              <Link
                href={`/kid/${kidId}/reading/category/${encodeURIComponent(story.category)}`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>

              <div className="flex items-center gap-3">
                {/* Font Size Controls */}
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                  <button
                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                    className="px-2 py-0.5 hover:bg-white/20 rounded"
                    style={{ color: currentTheme.colors.text }}
                  >
                    A-
                  </button>
                  <span className="text-sm px-1" style={{ color: currentTheme.colors.text }}>
                    {fontSize}
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                    className="px-2 py-0.5 hover:bg-white/20 rounded"
                    style={{ color: currentTheme.colors.text }}
                  >
                    A+
                  </button>
                </div>

                {/* Vocab Toggle */}
                <button
                  onClick={() => setShowVocab(!showVocab)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    showVocab ? 'bg-yellow-500 text-white' : 'bg-white/20'
                  }`}
                  style={{ color: showVocab ? 'white' : currentTheme.colors.text }}
                >
                  📚 Words
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-4 py-6">
            {/* Reading Strategy Tip - Shows before reading */}
            <AnimatePresence>
              {showTip && story.strategy_tip && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-500/30">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <GigiCharacter size="sm" showName={false} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-yellow-700">Reading Tip!</span>
                          </div>
                          <p className="text-gray-700 mb-3">{story.strategy_tip}</p>
                          <Button
                            onClick={handleStartReading}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          >
                            Got it! Start Reading
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: currentTheme.colors.primary }}
              >
                {story.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm" style={{ color: currentTheme.colors.text }}>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {story.expected_time_minutes || 20} min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {story.word_count || '~300'} words
                </span>
                {story.lexile_band && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">
                    {story.lexile_band}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Vocabulary Panel */}
            <AnimatePresence>
              {showVocab && story.vocabulary && story.vocabulary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <Card className="bg-yellow-50/80 border-yellow-200">
                    <div className="p-4">
                      <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        📚 Vocabulary Words
                      </h3>
                      <div className="grid gap-3">
                        {story.vocabulary.map((v, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <button
                              onClick={() => speakText(v.word)}
                              className="p-1 hover:bg-yellow-200 rounded"
                            >
                              <Volume2 className="h-4 w-4 text-yellow-700" />
                            </button>
                            <div>
                              <span className="font-bold text-yellow-900">{v.word}</span>
                              <span className="text-yellow-800"> - {v.definition}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: readingStarted || !story.strategy_tip ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${currentTheme.cardClass} mb-6`}>
                <div className="p-6 md:p-8">
                  <div
                    className="prose prose-lg max-w-none leading-relaxed"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.8,
                      color: currentTheme.colors.text
                    }}
                  >
                    {story.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Finished Reading Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-r from-green-400/20 to-blue-400/20 border-green-500/30">
                <div className="p-6">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                    Finished Reading?
                  </h3>
                  <p className="opacity-70 mb-4" style={{ color: currentTheme.colors.text }}>
                    Take the quiz to show what you learned!
                  </p>
                  <Button
                    onClick={handleTakeQuiz}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-8"
                  >
                    Take the Quiz
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
