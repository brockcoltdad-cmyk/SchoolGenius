'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * WRITING LESSON DATA HOOK
 *
 * Fetches writing lessons from the seeded database tables:
 * - rule_teaching_scripts: Writing rules and demos
 * - practice_problems: Writing prompts
 *
 * Returns data in the same format as the hardcoded WRITING_RULES object
 * to minimize changes to WritingLessonPlayer.tsx
 */

interface WritingRule {
  id: string;
  title: string;
  rule: string;
  demo: string;
  tip: string;
  prompt: string;
  minWords: number;
  maxWords: number;
  gradeLevel: number;
}

interface UseWritingLessonResult {
  writingRules: WritingRule[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Word limits by grade level
const WORD_LIMITS: Record<number, { min: number; max: number }> = {
  0: { min: 3, max: 10 },
  1: { min: 15, max: 50 },
  2: { min: 25, max: 75 },
  3: { min: 40, max: 100 },
  4: { min: 50, max: 150 },
  5: { min: 75, max: 200 },
  6: { min: 100, max: 300 },
  7: { min: 150, max: 400 },
  8: { min: 200, max: 500 },
};

export function useWritingLesson(grade: number): UseWritingLessonResult {
  const [writingRules, setWritingRules] = useState<WritingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      setError(null);

      try {
        // Fetch rule teaching scripts for writing at this grade
        const { data: rulesData, error: rulesError } = await supabase
          .from('rule_teaching_scripts')
          .select('*')
          .eq('subject', 'writing')
          .eq('grade', grade)
          .order('rule_id');

        if (rulesError) {
          console.error('Error fetching writing rules:', rulesError);
          throw new Error(`Failed to fetch rules: ${rulesError.message}`);
        }

        if (!rulesData || rulesData.length === 0) {
          console.log(`No writing rules found for grade ${grade}, returning empty`);
          setWritingRules([]);
          setLoading(false);
          return;
        }

        const wordLimits = WORD_LIMITS[Math.min(grade, 8)] || WORD_LIMITS[8];
        const transformedRules: WritingRule[] = [];

        for (const rule of rulesData) {
          // Parse JSON fields
          const ruleCard = typeof rule.rule_card === 'string'
            ? JSON.parse(rule.rule_card)
            : rule.rule_card;

          const teachingScript = typeof rule.teaching_script === 'string'
            ? JSON.parse(rule.teaching_script)
            : rule.teaching_script;

          // Fetch a practice problem/prompt for this rule
          const { data: promptData } = await supabase
            .from('practice_problems')
            .select('*')
            .eq('rule_id', rule.rule_id)
            .eq('subject', 'writing')
            .eq('grade', grade)
            .limit(1)
            .single();

          const writingRule: WritingRule = {
            id: rule.rule_id || `writing-${grade}-${transformedRules.length}`,
            title: ruleCard?.title || rule.rule_name || 'Writing Rule',
            rule: ruleCard?.rule_text || ruleCard?.explanation || teachingScript?.intro || 'Learn this writing skill!',
            demo: ruleCard?.examples?.[0] || teachingScript?.demo || 'Example text goes here.',
            tip: ruleCard?.memory_tip || teachingScript?.tip || 'Remember to practice!',
            prompt: promptData?.question || ruleCard?.prompt || 'Write about this topic.',
            minWords: wordLimits.min,
            maxWords: wordLimits.max,
            gradeLevel: grade
          };

          transformedRules.push(writingRule);
        }

        console.log(`✅ Loaded ${transformedRules.length} writing rules for grade ${grade} from database`);
        setWritingRules(transformedRules);

      } catch (err: any) {
        console.error('Error in useWritingLesson:', err);
        setError(err.message || 'Failed to load writing lessons');
        setWritingRules([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [grade, fetchTrigger]);

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return { writingRules, loading, error, refetch };
}

export default useWritingLesson;
