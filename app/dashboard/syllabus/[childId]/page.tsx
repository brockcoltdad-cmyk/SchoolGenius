'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, HelpCircle, Eye, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ModeSwitcher from '@/components/parent/ModeSwitcher';
import SimpleSyllabusEditor from '@/components/parent/SimpleSyllabusEditor';
import ScannedSyllabusViewer from '@/components/parent/ScannedSyllabusViewer';

interface ChildProfile {
  id: string;
  name: string;
  grade_level: string;
}

interface SyllabusSettings {
  mode: 'default' | 'custom' | 'school';
  updated_at: string;
}

const MODE_INFO = {
  default: {
    label: 'Default Mode',
    color: 'blue',
    icon: '🔵',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-900',
    description: 'Using standard grade-level curriculum'
  },
  custom: {
    label: 'Custom Mode',
    color: 'purple',
    icon: '🟣',
    bgGradient: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-900',
    description: 'Your personalized subject schedule'
  },
  school: {
    label: 'Scanned Mode',
    color: 'green',
    icon: '🟢',
    bgGradient: 'from-green-50 to-green-100',
    borderColor: 'border-green-300',
    textColor: 'text-green-900',
    description: 'AI-analyzed school syllabus with prep lessons'
  }
};

export default function SyllabusManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const childId = params.childId as string;
  const supabase = createClient();

  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [syllabusSettings, setSyllabusSettings] = useState<SyllabusSettings | null>(null);
  const [hasCustomSyllabus, setHasCustomSyllabus] = useState(false);
  const [hasScannedSyllabus, setHasScannedSyllabus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [childId]);

  async function fetchData() {
    try {
      // Fetch child profile
      const { data: child, error: childError } = await supabase
        .from('children')
        .select('id, name, grade_level')
        .eq('id', childId)
        .single();

      if (childError) throw childError;
      setChildProfile(child);

      // Fetch syllabus settings (or use default if not exists)
      const { data: settings, error: settingsError } = await supabase
        .from('syllabus_settings')
        .select('mode, updated_at')
        .eq('child_id', childId)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      // Default to 'default' mode if no settings exist
      setSyllabusSettings(settings || { mode: 'default', updated_at: new Date().toISOString() });

      // Check if custom syllabus exists
      const { data: customSyllabus } = await supabase
        .from('custom_syllabus')
        .select('id')
        .eq('child_id', childId)
        .maybeSingle();

      setHasCustomSyllabus(!!customSyllabus);

      // Check if scanned syllabus exists
      const { data: scannedSyllabus } = await supabase
        .from('scanned_homework')
        .select('id')
        .eq('child_id', childId)
        .eq('category', 'syllabus')
        .maybeSingle();

      setHasScannedSyllabus(!!scannedSyllabus);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load syllabus data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-cyan-50">
        <Card className="border-4 border-orange-200 p-12 text-center bg-white shadow-xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-8 border-orange-200 border-t-orange-600"
          />
          <p className="text-xl font-bold text-gray-600">Loading syllabus...</p>
        </Card>
      </div>
    );
  }

  if (!childProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-cyan-50">
        <Card className="border-4 border-orange-200 p-12 text-center bg-white shadow-xl">
          <div className="mb-4 text-6xl">❌</div>
          <h3 className="mb-3 text-2xl font-black text-gray-900">Child not found</h3>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 font-black">
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentMode = syllabusSettings?.mode || 'default';
  const modeInfo = MODE_INFO[currentMode];
  const gradeDisplay = childProfile.grade_level === 'K' ? 'Kindergarten' : `Grade ${childProfile.grade_level}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-cyan-50 pb-12">
      {/* Header */}
      <header className="border-b-4 border-orange-200 bg-white/90 backdrop-blur-xl shadow-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 font-bold hover:bg-orange-50">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Syllabus Management - {childProfile.name}
                </h1>
                <p className="text-sm font-semibold text-gray-600">{gradeDisplay}</p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-2 border-orange-300 font-bold">
                    <HelpCircle className="h-4 w-4" />
                    Help
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4" side="bottom">
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900">Three Syllabus Modes:</p>
                    <p className="text-sm">
                      <strong>🔵 Default:</strong> Standard curriculum for your child's grade level
                    </p>
                    <p className="text-sm">
                      <strong>🟣 Custom:</strong> You choose subject order and daily time goals
                    </p>
                    <p className="text-sm">
                      <strong>🟢 Scanned:</strong> Upload school syllabus - AI creates prep lessons 1-3 days before each topic
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Current Mode Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`border-4 ${modeInfo.borderColor} bg-gradient-to-br ${modeInfo.bgGradient} p-6 shadow-xl`}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{modeInfo.icon}</div>
                <div className="flex-1">
                  <h2 className={`text-2xl font-black ${modeInfo.textColor}`}>
                    {modeInfo.label}
                  </h2>
                  <p className={`text-base font-semibold ${modeInfo.textColor} opacity-80`}>
                    {modeInfo.description}
                  </p>
                </div>
                <div className="rounded-full bg-white/50 px-4 py-2 font-bold text-gray-700">
                  Active
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Mode Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-4 border-orange-200 bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-black text-gray-900">Switch Mode</h3>
              <p className="text-sm font-semibold text-gray-600 mb-4">
                Choose how you want to manage {childProfile.name}'s learning curriculum
              </p>
              <ModeSwitcher
                childId={childId}
                currentMode={currentMode}
                hasCustomSyllabus={hasCustomSyllabus}
                hasScannedSyllabus={hasScannedSyllabus}
                onModeChange={() => fetchData()}
              />
            </Card>
          </motion.div>

          {/* Syllabus Content Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-4 border-orange-200 bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-black text-gray-900">
                {currentMode === 'default' && 'Standard Curriculum'}
                {currentMode === 'custom' && 'Your Custom Syllabus'}
                {currentMode === 'school' && 'Scanned School Syllabus'}
              </h3>

              {/* Content based on mode */}
              {currentMode === 'default' && (
                <div className="rounded-lg bg-blue-50 p-6 border-2 border-blue-200">
                  <div className="mb-4 text-4xl text-center">📚</div>
                  <p className="text-center font-semibold text-blue-900">
                    Using the standard {gradeDisplay} curriculum
                  </p>
                  <p className="text-center text-sm text-blue-700 mt-2">
                    All 6 subjects are active with balanced daily practice
                  </p>
                </div>
              )}

              {currentMode === 'custom' && (
                <SimpleSyllabusEditor childId={childId} />
              )}

              {currentMode === 'school' && (
                <ScannedSyllabusViewer childId={childId} />
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-4 border-orange-200 bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-black text-gray-900">Quick Actions</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Link href={`/kid/${childId}/scan`}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full h-auto flex-col gap-2 p-6 border-2 border-orange-300 hover:bg-orange-50"
                    >
                      <Upload className="h-8 w-8 text-orange-600" />
                      <span className="font-black text-gray-900">Scan New Syllabus</span>
                      <span className="text-xs text-gray-600">Upload school syllabus</span>
                    </Button>
                  </motion.div>
                </Link>
                <Link href={`/kid/${childId}/syllabus`}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full h-auto flex-col gap-2 p-6 border-2 border-orange-300 hover:bg-orange-50"
                    >
                      <Eye className="h-8 w-8 text-orange-600" />
                      <span className="font-black text-gray-900">View Schedule</span>
                      <span className="text-xs text-gray-600">See prep lessons</span>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
