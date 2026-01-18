'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { createClient } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

interface SubjectConfig {
  subject_code: string;
  display_order: number;
  minutes_per_day: number;
  enabled: boolean;
}

interface SimpleSyllabusEditorProps {
  childId: string;
}

// Default 6 subjects from curriculum_subjects table
const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { subject_code: 'MATH', display_order: 1, minutes_per_day: 30, enabled: true },
  { subject_code: 'READ', display_order: 2, minutes_per_day: 30, enabled: true },
  { subject_code: 'SPELL', display_order: 3, minutes_per_day: 20, enabled: true },
  { subject_code: 'TYPE', display_order: 4, minutes_per_day: 15, enabled: true },
  { subject_code: 'CODE', display_order: 5, minutes_per_day: 20, enabled: true },
  { subject_code: 'LANG', display_order: 6, minutes_per_day: 20, enabled: true },
];

const SUBJECT_INFO: Record<string, { name: string; emoji: string; color: string }> = {
  MATH: { name: 'Mathematics', emoji: '🔢', color: 'from-blue-100 to-blue-200' },
  READ: { name: 'Reading', emoji: '📖', color: 'from-green-100 to-green-200' },
  SPELL: { name: 'Spelling', emoji: '✍️', color: 'from-purple-100 to-purple-200' },
  TYPE: { name: 'Typing', emoji: '⌨️', color: 'from-yellow-100 to-yellow-200' },
  CODE: { name: 'Coding', emoji: '💻', color: 'from-pink-100 to-pink-200' },
  LANG: { name: 'Language Arts', emoji: '📝', color: 'from-cyan-100 to-cyan-200' },
};

export default function SimpleSyllabusEditor({ childId }: SimpleSyllabusEditorProps) {
  const [subjects, setSubjects] = useState<SubjectConfig[]>(DEFAULT_SUBJECTS);
  const [originalSubjects, setOriginalSubjects] = useState<SubjectConfig[]>(DEFAULT_SUBJECTS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomSyllabus();
  }, [childId]);

  async function fetchCustomSyllabus() {
    try {
      const { data, error } = await (supabase
        .from('custom_syllabus' as any)
        .select('subjects')
        .eq('child_id', childId)
        .maybeSingle() as any);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.subjects) {
        const loadedSubjects = data.subjects as SubjectConfig[];
        setSubjects(loadedSubjects);
        setOriginalSubjects(loadedSubjects);
      }
    } catch (error: any) {
      console.error('Error fetching custom syllabus:', error);
      toast({
        title: 'Error',
        description: 'Failed to load custom syllabus',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleReorder = (newOrder: SubjectConfig[]) => {
    const reorderedSubjects = newOrder.map((subject, index) => ({
      ...subject,
      display_order: index + 1,
    }));
    setSubjects(reorderedSubjects);
  };

  const handleToggle = (subjectCode: string) => {
    const enabledCount = subjects.filter(s => s.enabled).length;
    const isCurrentlyEnabled = subjects.find(s => s.subject_code === subjectCode)?.enabled;

    // Don't allow disabling all subjects
    if (isCurrentlyEnabled && enabledCount === 1) {
      toast({
        title: 'Cannot Disable',
        description: 'At least one subject must be enabled',
        variant: 'destructive',
      });
      return;
    }

    setSubjects(subjects.map(s =>
      s.subject_code === subjectCode ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const handleMinutesChange = (subjectCode: string, value: number[]) => {
    setSubjects(subjects.map(s =>
      s.subject_code === subjectCode ? { ...s, minutes_per_day: value[0] } : s
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { error } = await (supabase
        .from('custom_syllabus' as any)
        .upsert({
          child_id: childId,
          subjects: subjects,
          updated_at: new Date().toISOString(),
        }) as any);

      if (error) throw error;

      setOriginalSubjects(subjects);
      toast({
        title: 'Success',
        description: 'Custom syllabus saved successfully',
      });
    } catch (error: any) {
      console.error('Error saving custom syllabus:', error);
      toast({
        title: 'Error',
        description: 'Failed to save custom syllabus',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSubjects(originalSubjects);
    toast({
      title: 'Changes Discarded',
      description: 'Reverted to last saved state',
    });
  };

  const totalMinutes = subjects
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + s.minutes_per_day, 0);

  const hasChanges = JSON.stringify(subjects) !== JSON.stringify(originalSubjects);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-slate-100 p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
        <p className="font-semibold text-slate-600">Loading custom syllabus...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 border-2 border-blue-200 p-4">
        <p className="text-sm font-semibold text-blue-900">
          💡 Drag subjects to reorder, adjust daily minutes, and toggle subjects on/off
        </p>
      </div>

      <Reorder.Group
        axis="y"
        values={subjects}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {subjects.map((subject) => {
          const info = SUBJECT_INFO[subject.subject_code];

          return (
            <Reorder.Item
              key={subject.subject_code}
              value={subject}
              className="touch-none"
            >
              <motion.div
                layout
                className={`rounded-xl border-3 p-5 shadow-md transition-all ${
                  subject.enabled
                    ? `border-orange-300 bg-gradient-to-br ${info.color}`
                    : 'border-gray-300 bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing pt-1">
                    <GripVertical className="h-6 w-6 text-gray-500" />
                  </div>

                  {/* Subject Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{info.emoji}</span>
                        <div>
                          <h4 className="text-lg font-black text-gray-900">{info.name}</h4>
                          <p className="text-sm font-semibold text-gray-600">
                            {subject.subject_code}
                          </p>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`toggle-${subject.subject_code}`} className="text-sm font-bold">
                          {subject.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                        <Switch
                          id={`toggle-${subject.subject_code}`}
                          checked={subject.enabled}
                          onCheckedChange={() => handleToggle(subject.subject_code)}
                        />
                      </div>
                    </div>

                    {/* Minutes Slider */}
                    {subject.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-bold text-gray-700">
                            Daily Minutes
                          </Label>
                          <span className="text-2xl font-black text-gray-900">
                            {subject.minutes_per_day}
                            <span className="text-sm text-gray-600 font-semibold"> min</span>
                          </span>
                        </div>
                        <Slider
                          value={[subject.minutes_per_day]}
                          onValueChange={(value) => handleMinutesChange(subject.subject_code, value)}
                          min={10}
                          max={60}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>10 min</span>
                          <span>60 min</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Total Time Summary */}
      <div className="rounded-xl border-4 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-black text-gray-900">Total Daily Time</h4>
            <p className="text-sm font-semibold text-gray-600">
              {subjects.filter(s => s.enabled).length} subjects enabled
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-orange-600">
              {totalMinutes}
              <span className="text-xl text-gray-600 font-bold"> min</span>
            </p>
            <p className="text-sm font-semibold text-gray-600">
              {(totalMinutes / 60).toFixed(1)} hours
            </p>
          </div>
        </div>
        {totalMinutes > 240 && (
          <div className="mt-3 rounded-lg bg-orange-200 border-2 border-orange-400 p-3">
            <p className="text-sm font-bold text-orange-900">
              ⚠️ Total time exceeds 4 hours. Consider reducing daily minutes.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-black text-lg h-14 shadow-xl"
        >
          {isSaving ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save Custom Syllabus
            </>
          )}
        </Button>
        <Button
          onClick={handleCancel}
          disabled={isSaving || !hasChanges}
          variant="outline"
          className="border-3 border-orange-300 font-black text-lg h-14 hover:bg-orange-50"
        >
          <X className="mr-2 h-5 w-5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
