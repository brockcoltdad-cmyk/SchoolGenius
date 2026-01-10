'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Lock, CheckCircle, Star, Play } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Skill {
  id: string;
  skill_name: string;
  skill_order: number;
  grade_level: number;
}

interface Progress {
  skill_id: string;
  completed: boolean;
  score: number;
  stars: number;
}

const subjectInfo: Record<string, { name: string; emoji: string; code: string }> = {
  math: { name: 'Math', emoji: '📐', code: 'MATH' },
  reading: { name: 'Reading', emoji: '📖', code: 'READ' },
  spelling: { name: 'Spelling', emoji: '🔤', code: 'SPELL' },
  writing: { name: 'Writing', emoji: '✏️', code: 'LANG' },
  grammar: { name: 'Grammar', emoji: '📝', code: 'LANG' },
  phonics: { name: 'Phonics', emoji: '🔊', code: 'READ' },
  coding: { name: 'Coding', emoji: '💻', code: 'CODE' },
  typing: { name: 'Typing', emoji: '⌨️', code: 'TYPE' },
};

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const kidId = params.id as string;
  const subject = params.subject as string;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [childGrade, setChildGrade] = useState<number>(3);

  const supabase = createClient();
  const info = subjectInfo[subject] || { name: subject, emoji: '📚', code: 'MATH' };

  useEffect(() => {
    async function fetchData() {
      try {
        // Get child's grade level
        const { data: child } = await supabase
          .from('children')
          .select('grade_level')
          .eq('id', kidId)
          .single();

        const grade = parseInt(child?.grade_level || '3');
        setChildGrade(grade);

        // Fetch skills for this subject and grade
        const { data: skillsData, error: skillsError } = await supabase
          .from('curriculum_skills')
          .select('id, skill_name, skill_order, grade_level')
          .eq('subject_code', info.code)
          .lte('grade_level', grade)
          .order('grade_level', { ascending: true })
          .order('skill_order', { ascending: true })
          .limit(10);

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Fetch progress for this child
        if (skillsData && skillsData.length > 0) {
          const skillIds = skillsData.map(s => s.id);
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('skill_id, completed, score, stars')
            .eq('child_id', kidId)
            .in('skill_id', skillIds);

          const progressMap: Record<string, Progress> = {};
          (progressData || []).forEach(p => {
            progressMap[p.skill_id] = p;
          });
          setProgress(progressMap);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [kidId, info.code]);

  const handleSkillClick = (skillId: string, locked: boolean) => {
    if (locked) return;
    router.push(`/kid/${kidId}/lesson/${skillId}`);
  };

  // Determine if skill is locked (previous skill must be completed)
  const isSkillLocked = (index: number): boolean => {
    if (index === 0) return false;
    const prevSkill = skills[index - 1];
    const prevProgress = progress[prevSkill?.id];
    return !prevProgress?.completed;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold text-xl">Loading {info.name}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{info.emoji}</span>
            <h1 className="text-2xl font-bold text-white">{info.name}</h1>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 text-xl">No skills available yet.</p>
            <p className="text-white/50 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill, index) => {
              const skillProgress = progress[skill.id];
              const completed = skillProgress?.completed || false;
              const score = skillProgress?.score || 0;
              const stars = skillProgress?.stars || 0;
              const locked = isSkillLocked(index);

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleSkillClick(skill.id, locked)}
                    disabled={locked}
                    className={`w-full p-4 rounded-2xl border transition-all text-left ${
                      locked
                        ? 'bg-white/5 border-white/10 cursor-not-allowed opacity-50'
                        : completed
                        ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          locked
                            ? 'bg-white/10'
                            : completed
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}>
                          {locked ? (
                            <Lock className="w-5 h-5 text-white/50" />
                          ) : completed ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{skill.skill_name}</h3>
                          <p className="text-white/60 text-sm">Grade {skill.grade_level}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {completed && (
                          <div className="flex gap-1">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-5 h-5 ${
                                  s <= stars
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-white/20'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <div className={`px-4 py-2 rounded-xl font-bold ${
                          locked
                            ? 'bg-white/10 text-white/40'
                            : completed
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {locked ? 'Locked' : completed ? 'Review' : 'Start'}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar for incomplete skills */}
                    {!locked && !completed && score > 0 && (
                      <div className="mt-3 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Unlock message */}
        <p className="text-center text-white/50 mt-8 text-sm">
          Complete skills to unlock new ones! 🔓
        </p>
      </div>
    </div>
  );
}
