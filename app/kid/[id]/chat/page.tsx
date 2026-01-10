'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import GigiCharacter from '@/components/animations/GigiCharacter';
import PageTransition from '@/components/animations/PageTransition';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';

export default function ChatPage() {
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

          <main className="mx-auto max-w-4xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GigiCharacter size="xl" showName={false} showGreeting={true} className="mb-8" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={`${currentTheme.cardClass} relative overflow-hidden p-12`}>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-6 py-3 shadow-lg"
                  >
                    <span className="text-2xl">🚀</span>
                    <span className="text-lg font-bold text-yellow-800">Coming Soon</span>
                  </motion.div>
                  <p className="text-xl font-medium" style={{ color: currentTheme.colors.text }}>
                    Chat with me and I&apos;ll help you with anything! Ask questions, get homework help, and learn new things together!
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 grid gap-4 md:grid-cols-3"
            >
              {['Help me with math', 'Explain this word', 'Quiz me'].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    disabled
                    className={`${currentTheme.buttonClass} w-full opacity-50`}
                  >
                    {text}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
