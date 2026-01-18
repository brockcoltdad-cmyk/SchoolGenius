'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * TYPING LESSON DATA HOOK
 *
 * Fetches typing lessons from the seeded database tables:
 * - rule_teaching_scripts: Typing rules by phase
 * - practice_problems: Practice texts
 *
 * Returns data in the same format as the hardcoded PRACTICE_TEXTS object
 * to minimize changes to TypingLessonPlayer.tsx
 */

interface TypingRule {
  phase: number;
  title: string;
  rule: string;
  keys: string[];
}

interface UseTypingLessonResult {
  practiceTexts: Record<number, string[]>;
  rules: TypingRule[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTypingLesson(grade: number): UseTypingLessonResult {
  const [practiceTexts, setPracticeTexts] = useState<Record<number, string[]>>({});
  const [rules, setRules] = useState<TypingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      setError(null);

      try {
        // Fetch typing rules
        const { data: rulesData, error: rulesError } = await supabase
          .from('rule_teaching_scripts')
          .select('*')
          .eq('subject', 'typing')
          .order('rule_id');

        if (rulesError) {
          console.error('Error fetching typing rules:', rulesError);
        }

        // Fetch all typing practice problems
        const { data: problemsData, error: problemsError } = await supabase
          .from('practice_problems')
          .select('*')
          .eq('subject', 'typing')
          .limit(200);

        if (problemsError) {
          console.error('Error fetching typing problems:', problemsError);
          throw new Error(`Failed to fetch typing texts: ${problemsError.message}`);
        }

        // Transform rules
        const transformedRules: TypingRule[] = (rulesData || []).map((rule, index) => {
          const ruleCard = typeof rule.rule_card === 'string'
            ? JSON.parse(rule.rule_card)
            : rule.rule_card;

          return {
            phase: index + 1,
            title: ruleCard?.title || rule.rule_name || `Phase ${index + 1}`,
            rule: ruleCard?.rule_text || 'Practice these keys!',
            keys: ruleCard?.keys || []
          };
        });

        // Group practice texts by skill/phase
        const textsMap: Record<number, string[]> = {};

        for (const problem of (problemsData || [])) {
          // Determine phase from skill or default based on content
          let phase = 4; // Default to "all letters"

          const skill = (problem.skill || '').toLowerCase();
          if (skill.includes('home') || skill.includes('asdf')) phase = 1;
          else if (skill.includes('top') || skill.includes('qwerty')) phase = 2;
          else if (skill.includes('bottom') || skill.includes('zxcv')) phase = 3;
          else if (skill.includes('all') || skill.includes('full')) phase = 4;
          else if (skill.includes('speed') || skill.includes('advanced')) phase = 5;

          // Extract text from question or answer
          const text = problem.question || problem.answer || '';
          if (text && typeof text === 'string' && text.length > 0) {
            if (!textsMap[phase]) textsMap[phase] = [];
            textsMap[phase].push(text);
          }
        }

        // Ensure we have at least some texts for common phases
        for (let i = 1; i <= 5; i++) {
          if (!textsMap[i]) textsMap[i] = [];
        }

        console.log(`✅ Loaded typing lessons: ${transformedRules.length} rules, ${Object.values(textsMap).flat().length} practice texts`);
        setRules(transformedRules);
        setPracticeTexts(textsMap);

      } catch (err: any) {
        console.error('Error in useTypingLesson:', err);
        setError(err.message || 'Failed to load typing lessons');
        setPracticeTexts({});
        setRules([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [grade, fetchTrigger]);

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return { practiceTexts, rules, loading, error, refetch };
}

export default useTypingLesson;
