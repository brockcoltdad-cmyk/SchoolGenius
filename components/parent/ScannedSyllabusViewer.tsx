'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Calendar, BookOpen, Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface ScannedSyllabusViewerProps {
  childId: string;
}

interface ScannedDocument {
  id: string;
  image_url: string;
  file_name: string;
  scanned_at: string;
  ai_analysis?: any;
}

interface PrepLesson {
  id: string;
  date: string;
  subject_code: string;
  title: string;
  topic: string;
  school_teach_date?: string;
}

export default function ScannedSyllabusViewer({ childId }: ScannedSyllabusViewerProps) {
  const [scannedDoc, setScannedDoc] = useState<ScannedDocument | null>(null);
  const [prepLessons, setPrepLessons] = useState<PrepLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchScannedSyllabus();
  }, [childId]);

  async function fetchScannedSyllabus() {
    try {
      // Fetch most recent scanned syllabus
      const { data: doc, error: docError } = await supabase
        .from('scanned_homework')
        .select('*')
        .eq('child_id', childId)
        .eq('category', 'syllabus')
        .order('scanned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (docError && docError.code !== 'PGRST116') {
        throw docError;
      }

      setScannedDoc(doc);

      if (doc) {
        // Fetch generated prep lessons
        const { data: lessons, error: lessonsError } = await supabase
          .from('daily_schedule')
          .select('*')
          .eq('child_id', childId)
          .eq('from_syllabus', true)
          .order('date', { ascending: true })
          .limit(10);

        if (lessonsError) {
          console.error('Error fetching prep lessons:', lessonsError);
        } else {
          setPrepLessons(lessons || []);
        }
      }
    } catch (error: any) {
      console.error('Error fetching scanned syllabus:', error);
      toast({
        title: 'Error',
        description: 'Failed to load scanned syllabus',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg bg-slate-100 p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
        <p className="font-semibold text-slate-600">Loading scanned syllabus...</p>
      </div>
    );
  }

  if (!scannedDoc) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-orange-50 border-2 border-orange-200 p-6 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <h4 className="mb-2 text-xl font-black text-orange-900">No Syllabus Scanned Yet</h4>
          <p className="mb-4 text-sm font-semibold text-orange-800">
            Upload your child's school syllabus to get AI-generated prep lessons
          </p>
          <Link href={`/kid/${childId}/scan`}>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 font-black">
              <Upload className="mr-2 h-5 w-5" />
              Scan Syllabus Now
            </Button>
          </Link>
        </div>

        <div className="rounded-lg bg-blue-50 border-2 border-blue-200 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900 mb-1">How Scanned Mode Works:</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Upload a photo of your child's school syllabus</li>
                <li>Our AI reads dates and topics</li>
                <li>We create prep lessons 1-3 days before each school topic</li>
                <li>Your child arrives at school already prepared!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group prep lessons by subject
  const lessonsBySubject = prepLessons.reduce((acc, lesson) => {
    if (!acc[lesson.subject_code]) {
      acc[lesson.subject_code] = [];
    }
    acc[lesson.subject_code].push(lesson);
    return acc;
  }, {} as Record<string, PrepLesson[]>);

  const subjectColors: Record<string, string> = {
    MATH: 'blue',
    READ: 'green',
    SPELL: 'purple',
    TYPE: 'yellow',
    CODE: 'pink',
    LANG: 'cyan',
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="rounded-lg bg-green-50 border-2 border-green-200 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-900">
              📚 This syllabus was scanned and analyzed by AI
            </p>
            <p className="text-sm text-green-800 mt-1">
              Your child will receive prep lessons 1-3 days before each topic is taught at school.
              To update, scan a new syllabus.
            </p>
          </div>
        </div>
      </div>

      {/* Scanned Image */}
      <Card className="border-3 border-orange-300 p-6 bg-gradient-to-br from-white to-orange-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <h4 className="text-lg font-black text-gray-900">Scanned Syllabus</h4>
          </div>
          <p className="text-sm font-semibold text-gray-600">
            Scanned {new Date(scannedDoc.scanned_at).toLocaleDateString()}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative cursor-pointer overflow-hidden rounded-xl border-3 border-orange-300 bg-slate-100 aspect-video shadow-lg group"
            >
              {scannedDoc.image_url ? (
                <img
                  src={scannedDoc.image_url}
                  alt="Scanned syllabus"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-20 w-20 text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
                <div className="rounded-full bg-white/90 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-6 w-6 text-gray-900" />
                </div>
              </div>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="max-w-5xl p-0">
            <div className="max-h-[90vh] overflow-auto">
              {scannedDoc.image_url ? (
                <img
                  src={scannedDoc.image_url}
                  alt="Scanned syllabus - full size"
                  className="w-full"
                />
              ) : (
                <div className="flex h-96 items-center justify-center bg-slate-100">
                  <p className="text-slate-500">Image not available</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <p className="mt-3 text-sm font-semibold text-gray-700">
          File: {scannedDoc.file_name}
        </p>
      </Card>

      {/* Generated Prep Schedule */}
      <Card className="border-3 border-orange-300 p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-orange-600" />
          <h4 className="text-lg font-black text-gray-900">
            Generated Prep Lessons ({prepLessons.length})
          </h4>
        </div>

        {prepLessons.length === 0 ? (
          <div className="rounded-lg bg-slate-100 p-6 text-center">
            <p className="font-semibold text-slate-600">
              No prep lessons scheduled yet. The AI is processing your syllabus.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(lessonsBySubject).map(([subject, lessons]) => {
              const color = subjectColors[subject] || 'gray';

              return (
                <div key={subject} className="space-y-2">
                  <h5 className={`text-sm font-black text-${color}-700 uppercase tracking-wide`}>
                    {subject}
                  </h5>
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        whileHover={{ x: 4 }}
                        className={`rounded-lg border-2 border-${color}-200 bg-${color}-50 p-4`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-bold text-${color}-900`}>{lesson.title}</p>
                            <p className={`text-sm text-${color}-700 mt-1`}>
                              Topic: {lesson.topic}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-600">
                            <p className="font-semibold">
                              Prep: {new Date(lesson.date).toLocaleDateString()}
                            </p>
                            {lesson.school_teach_date && (
                              <p className="text-xs">
                                School: {new Date(lesson.school_teach_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Link href={`/kid/${childId}/scan`}>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 font-black text-lg h-14 px-8 shadow-xl">
            <Upload className="mr-2 h-5 w-5" />
            Scan New Syllabus
          </Button>
        </Link>
      </div>
    </div>
  );
}
