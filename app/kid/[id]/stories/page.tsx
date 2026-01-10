'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';

const stories = [
  { id: '1', title: 'The Magic Garden', level: 'Easy', color: 'bg-green-400' },
  { id: '2', title: 'Space Adventure', level: 'Medium', color: 'bg-blue-400' },
  { id: '3', title: 'Underwater Quest', level: 'Medium', color: 'bg-cyan-400' },
  { id: '4', title: 'Dragon Friends', level: 'Hard', color: 'bg-red-400' },
];

export default function StoriesPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  return (
    <PageTransition>
      <ThemedBackground>
        <ThemeDecorations />

        <div className="min-h-screen relative z-10 pb-24">
          <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <Link
                href={`/kid/${kidId}`}
                className="flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
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
                className="flex justify-center"
              >
                <GigiCharacter size="lg" showName={false} />
              </motion.div>
              <h1 className="text-center text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                📚 Story Library
              </h1>

          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`${currentTheme.cardClass} overflow-hidden`}>
                  <div className={`h-32 ${story.color}`} />
                  <div className="p-6">
                    <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {story.level}
                    </span>
                    <h3 className="mb-4 text-xl font-bold" style={{ color: currentTheme.colors.text }}>{story.title}</h3>
                    <button
                      className={`w-full ${currentTheme.buttonClass} py-2 text-white`}
                      style={{ background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                    >
                      Read
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
            </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
