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

export default function SyllabusPage() {
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

          <main className="mx-auto max-w-2xl px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
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
                className="mb-6"
              >
                <GigiCharacter size="lg" showName={false} />
              </motion.div>
              <h1 className="mb-8 text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                📋 My Learning Plan
              </h1>
              <Card className={`${currentTheme.cardClass} p-12`}>
                <p style={{ color: currentTheme.colors.textSecondary }}>Customize your daily learning schedule here!</p>
              </Card>
            </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
