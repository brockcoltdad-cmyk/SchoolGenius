'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, HelpCircle, Eye, Upload } from 'lucide-react';
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
import DashboardShell, { useDashboardTheme } from '@/components/parent/DashboardShell';

interface ChildProfile {
  id: string;
  name: string;
  grade_level: string | null;
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
  const { theme, isDark } = useDashboardTheme();
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
      setChildProfile(child as ChildProfile);

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
      setSyllabusSettings((settings as SyllabusSettings | null) || { mode: 'default', updated_at: new Date().toISOString() });

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
      <DashboardShell showBackButton backHref="/dashboard">
        <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`mx-auto mb-4 h-16 w-16 rounded-full border-8 ${isDark ? 'border-slate-600 border-t-purple-500' : 'border-slate-200 border-t-blue-600'}`}
          />
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-600'}`}>Loading syllabus...</p>
        </Card>
      </DashboardShell>
    );
  }

  if (!childProfile) {
    return (
      <DashboardShell showBackButton backHref="/dashboard">
        <Card className={`p-12 text-center border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
          <div className="mb-4 text-6xl">❌</div>
          <h3 className={`mb-3 text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Child not found</h3>
          <Link href="/dashboard">
            <Button className={`bg-gradient-to-r ${theme.gradient} font-black text-white`}>
              Back to Dashboard
            </Button>
          </Link>
        </Card>
      </DashboardShell>
    );
  }

  const currentMode = syllabusSettings?.mode || 'default';
  const modeInfo = MODE_INFO[currentMode];
  const gradeDisplay = childProfile.grade_level === 'K' ? 'Kindergarten' : `Grade ${childProfile.grade_level}`;

  return (
    <DashboardShell
      showBackButton
      backHref="/dashboard"
      title={`Syllabus Management - ${childProfile.name}`}
      subtitle={gradeDisplay}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-4xl mx-auto"
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
          <Card className={`border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'} p-6 shadow-xl`}>
            <h3 className={`mb-4 text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Switch Mode</h3>
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'} mb-4`}>
              Choose how you want to manage {childProfile.name}&apos;s learning curriculum
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
          <Card className={`border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'} p-6 shadow-xl`}>
            <h3 className={`mb-4 text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
          <Card className={`border-4 ${theme.border} ${isDark ? 'bg-slate-800' : 'bg-white'} p-6 shadow-xl`}>
            <h3 className={`mb-4 text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href={`/kid/${childId}/scan`}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className={`w-full h-auto flex-col gap-2 p-6 border-2 ${theme.border} ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                  >
                    <Upload className={`h-8 w-8 ${theme.text}`} />
                    <span className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Scan New Syllabus</span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Upload school syllabus</span>
                  </Button>
                </motion.div>
              </Link>
              <Link href={`/kid/${childId}/syllabus`}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className={`w-full h-auto flex-col gap-2 p-6 border-2 ${theme.border} ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                  >
                    <Eye className={`h-8 w-8 ${theme.text}`} />
                    <span className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>View Schedule</span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>See prep lessons</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardShell>
  );
}
