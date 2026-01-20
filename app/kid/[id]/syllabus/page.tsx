'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/lib/theme-context';
import { ThemedBackground } from '@/components/theme/ThemedBackground';
import { ThemeDecorations } from '@/components/theme/ThemeDecorations';
import PageTransition from '@/components/animations/PageTransition';
import GigiCharacter from '@/components/animations/GigiCharacter';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

interface ScheduleLesson {
  id: string;
  date: string;
  title: string;
  description: string;
  subject_code: string;
  estimated_minutes: number;
  completed: boolean;
  from_syllabus: boolean;
}

export default function SyllabusPage() {
  const { currentTheme } = useTheme();
  const params = useParams();
  const kidId = params.id as string;

  const [schedule, setSchedule] = useState<ScheduleLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSyllabus, setHasSyllabus] = useState(false);

  useEffect(() => {
    async function loadSchedule() {
      const supabase = createClient();

      console.log('🔍 Loading syllabus for kid:', kidId);

      // Check if kid has scanned a syllabus
      const { data: syllabusDoc, error: syllabusError } = await supabase
        .from('scanned_homework')
        .select('id')
        .eq('child_id', kidId)
        .eq('category', 'syllabus')
        .order('scanned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📋 Syllabus query result:', syllabusDoc, 'Error:', syllabusError?.message);
      setHasSyllabus(!!syllabusDoc);

      // Get daily schedule from syllabus
      const { data: lessons, error } = await supabase
        .from('daily_schedule')
        .select('*')
        .eq('child_id', kidId)
        .eq('from_syllabus', true)
        .order('date', { ascending: true });

      console.log('📅 Lessons query result:', lessons?.length, 'lessons', 'Error:', error?.message);

      if (!error && lessons) {
        // Map database fields to interface fields
        setSchedule(lessons.map(l => ({
          id: l.id,
          date: l.date,
          title: l.lesson_title || '',
          description: '',
          subject_code: l.subject_code || '',
          estimated_minutes: 30,
          completed: l.completed,
          from_syllabus: l.from_syllabus
        })));
      }

      setLoading(false);
    }

    loadSchedule();
  }, [kidId]);

  const groupByWeek = (lessons: ScheduleLesson[]) => {
    const weeks: Record<string, ScheduleLesson[]> = {};

    lessons.forEach((lesson) => {
      const date = new Date(lesson.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(lesson);
    });

    return weeks;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const weeklySchedule = groupByWeek(schedule);
  const weekKeys = Object.keys(weeklySchedule).sort();

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
                className="mb-6 text-center"
              >
                <GigiCharacter size="lg" showName={false} />
              </motion.div>

              <h1 className="mb-2 text-center text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                📋 My Learning Plan
              </h1>
              <p className="mb-8 text-center text-lg" style={{ color: currentTheme.colors.textSecondary }}>
                Get ready for class with prep lessons!
              </p>

              {loading ? (
                <Card className={`${currentTheme.cardClass} p-8 text-center`}>
                  <p style={{ color: currentTheme.colors.textSecondary }}>Loading your schedule...</p>
                </Card>
              ) : !hasSyllabus ? (
                <Card className={`${currentTheme.cardClass} p-12 text-center`}>
                  <p className="mb-4 text-xl" style={{ color: currentTheme.colors.textSecondary }}>
                    No syllabus scanned yet!
                  </p>
                  <p className="mb-6" style={{ color: currentTheme.colors.textSecondary }}>
                    Scan your school syllabus to get custom prep lessons that help you learn topics BEFORE class.
                  </p>
                  <Link
                    href={`/kid/${kidId}/scan`}
                    className="inline-block rounded-lg px-6 py-3 font-bold text-white transition-all hover:scale-105"
                    style={{ background: currentTheme.colors.primary }}
                  >
                    📸 Scan Syllabus Now
                  </Link>
                </Card>
              ) : schedule.length === 0 ? (
                <Card className={`${currentTheme.cardClass} p-12 text-center`}>
                  <p className="mb-4 text-xl" style={{ color: currentTheme.colors.textSecondary }}>
                    Generating your prep schedule...
                  </p>
                  <p style={{ color: currentTheme.colors.textSecondary }}>
                    Our AI is analyzing your syllabus and creating custom lessons. Check back in a moment!
                  </p>
                </Card>
              ) : (
                <div className="space-y-8">
                  {weekKeys.map((weekKey) => {
                    const weekLessons = weeklySchedule[weekKey];
                    const weekDate = new Date(weekKey);
                    const weekLabel = `Week of ${weekDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;

                    return (
                      <div key={weekKey}>
                        <h2 className="mb-4 text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                          {weekLabel}
                        </h2>
                        <div className="space-y-3">
                          {weekLessons.map((lesson) => (
                            <motion.div
                              key={lesson.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <Card
                                className={`${currentTheme.cardClass} p-4 transition-all ${
                                  lesson.completed ? 'opacity-75' : 'hover:shadow-lg'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2">
                                      {lesson.completed ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <Calendar className="h-5 w-5" style={{ color: currentTheme.colors.primary }} />
                                      )}
                                      <span className="font-semibold" style={{ color: currentTheme.colors.textSecondary }}>
                                        {formatDate(lesson.date)}
                                      </span>
                                      <span
                                        className="rounded-full px-2 py-1 text-xs font-bold"
                                        style={{ background: currentTheme.colors.primary, color: 'white' }}
                                      >
                                        {lesson.subject_code}
                                      </span>
                                    </div>
                                    <h3 className="mb-1 text-lg font-bold" style={{ color: currentTheme.colors.text }}>
                                      {lesson.title}
                                    </h3>
                                    {lesson.description && (
                                      <p className="mb-2 text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                                        {lesson.description}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {lesson.estimated_minutes} min
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4" />
                                        Prep Lesson
                                      </span>
                                    </div>
                                  </div>
                                  {!lesson.completed && (
                                    <Link
                                      href={`/kid/${kidId}`}
                                      className="rounded-lg px-4 py-2 font-bold text-white transition-all hover:scale-105"
                                      style={{ background: currentTheme.colors.primary }}
                                    >
                                      Start
                                    </Link>
                                  )}
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {schedule.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    💡 Tip: Do these prep lessons BEFORE your class teaches the topic. You&apos;ll walk in already knowing it!
                  </p>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </ThemedBackground>
    </PageTransition>
  );
}
