'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import GigiCharacter from '@/components/animations/GigiCharacter';
import PageTransition from '@/components/animations/PageTransition';

const subjectData: Record<string, { name: string; emoji: string; skills: { id: string; name: string; locked: boolean; completed: boolean; progress: number }[] }> = {
  math: {
    name: 'Math',
    emoji: '📐',
    skills: [
      { id: '1', name: 'Addition Basics', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Subtraction Basics', locked: false, completed: true, progress: 100 },
      { id: '3', name: 'Multiplication Tables', locked: false, completed: false, progress: 60 },
      { id: '4', name: 'Division Practice', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Word Problems', locked: true, completed: false, progress: 0 },
    ],
  },
  reading: {
    name: 'Reading',
    emoji: '📖',
    skills: [
      { id: '1', name: 'Letter Recognition', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Short Vowels', locked: false, completed: true, progress: 100 },
      { id: '3', name: 'Sight Words', locked: false, completed: false, progress: 45 },
      { id: '4', name: 'Reading Comprehension', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Story Analysis', locked: true, completed: false, progress: 0 },
    ],
  },
  writing: {
    name: 'Writing',
    emoji: '✏️',
    skills: [
      { id: '1', name: 'Sentence Structure', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Paragraph Writing', locked: false, completed: false, progress: 70 },
      { id: '3', name: 'Descriptive Writing', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Story Writing', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Essay Writing', locked: true, completed: false, progress: 0 },
    ],
  },
  spelling: {
    name: 'Spelling',
    emoji: '🔤',
    skills: [
      { id: '1', name: 'CVC Words', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Blends & Digraphs', locked: false, completed: false, progress: 80 },
      { id: '3', name: 'Long Vowels', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Silent Letters', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Complex Words', locked: true, completed: false, progress: 0 },
    ],
  },
  grammar: {
    name: 'Grammar',
    emoji: '📝',
    skills: [
      { id: '1', name: 'Parts of Speech', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Subject-Verb Agreement', locked: false, completed: false, progress: 55 },
      { id: '3', name: 'Punctuation', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Capitalization', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Complex Sentences', locked: true, completed: false, progress: 0 },
    ],
  },
  phonics: {
    name: 'Phonics',
    emoji: '🔊',
    skills: [
      { id: '1', name: 'Letter Sounds', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Blending Sounds', locked: false, completed: true, progress: 100 },
      { id: '3', name: 'Rhyming Words', locked: false, completed: false, progress: 65 },
      { id: '4', name: 'Word Families', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Advanced Phonics', locked: true, completed: false, progress: 0 },
    ],
  },
  vocabulary: {
    name: 'Vocabulary',
    emoji: '📚',
    skills: [
      { id: '1', name: 'Common Words', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Synonyms & Antonyms', locked: false, completed: false, progress: 50 },
      { id: '3', name: 'Context Clues', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Prefixes & Suffixes', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Academic Vocabulary', locked: true, completed: false, progress: 0 },
    ],
  },
  typing: {
    name: 'Typing',
    emoji: '⌨️',
    skills: [
      { id: '1', name: 'Home Row Keys', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Top & Bottom Rows', locked: false, completed: false, progress: 75 },
      { id: '3', name: 'Numbers & Symbols', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Speed Building', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Touch Typing Mastery', locked: true, completed: false, progress: 0 },
    ],
  },
  handwriting: {
    name: 'Handwriting',
    emoji: '✍️',
    skills: [
      { id: '1', name: 'Letter Formation', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Lowercase Letters', locked: false, completed: false, progress: 85 },
      { id: '3', name: 'Uppercase Letters', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Cursive Writing', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Neat Writing', locked: true, completed: false, progress: 0 },
    ],
  },
  coding: {
    name: 'Coding',
    emoji: '💻',
    skills: [
      { id: '1', name: 'Sequencing', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Loops & Patterns', locked: false, completed: false, progress: 40 },
      { id: '3', name: 'Conditionals', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Functions', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Problem Solving', locked: true, completed: false, progress: 0 },
    ],
  },
  'test-prep': {
    name: 'Test Prep',
    emoji: '🎯',
    skills: [
      { id: '1', name: 'Multiple Choice Strategies', locked: false, completed: true, progress: 100 },
      { id: '2', name: 'Time Management', locked: false, completed: false, progress: 60 },
      { id: '3', name: 'Reading Tests', locked: true, completed: false, progress: 0 },
      { id: '4', name: 'Math Tests', locked: true, completed: false, progress: 0 },
      { id: '5', name: 'Practice Exams', locked: true, completed: false, progress: 0 },
    ],
  },
};

export default function SubjectPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const subjectCode = params.code as string;

  const subject = subjectData[subjectCode] || subjectData.math;

  const handleSkillClick = (skillId: string) => {
    if (!skillId || skillId === 'locked') return;
    router.push(`/kid/${kidId}/lesson/${skillId}`);
  };

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
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="mb-4"
                >
                  <GigiCharacter size="lg" showName={false} />
                </motion.div>
                <div className="mb-4 text-6xl">{subject.emoji}</div>
                <h1 className="text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                  {subject.name}
                </h1>
              </div>

          <div className="space-y-4">
            {subject.skills.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`${currentTheme.cardClass} p-6 ${skill.locked ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        {skill.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : skill.locked ? (
                          <Lock className="h-6 w-6 text-slate-400" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2" style={{ borderColor: currentTheme.colors.primary }} />
                        )}
                        <h3 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>{skill.name}</h3>
                      </div>
                      {!skill.locked && skill.progress > 0 && (
                        <div className="ml-9">
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span style={{ color: currentTheme.colors.textSecondary }}>Progress</span>
                            <span className="font-semibold" style={{ color: currentTheme.colors.text }}>{skill.progress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.progress}%` }}
                              transition={{ duration: 1 }}
                              className="h-full"
                              style={{ background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Button
                        disabled={skill.locked}
                        onClick={() => handleSkillClick(skill.id)}
                        className={currentTheme.buttonClass}
                        style={
                          !skill.locked
                            ? { background: `linear-gradient(to right, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`, color: 'white' }
                            : {}
                        }
                      >
                        {skill.completed ? 'Review' : skill.locked ? 'Locked' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {subject.skills.some((s) => s.locked) && (
            <Card className={`${currentTheme.cardClass} p-6`} style={{ background: `${currentTheme.colors.primary}10` }}>
              <p className="text-center text-sm" style={{ color: currentTheme.colors.text }}>
                Complete skills to unlock new ones! 🔓
              </p>
            </Card>
          )}
            </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
