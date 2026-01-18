'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * MATH LESSON DATA HOOK
 *
 * Fetches math lessons from the seeded database tables:
 * - rule_teaching_scripts: Teaching content (Phase 1)
 * - practice_problems: Practice problems (Phase 4)
 * - weekly_quizzes: Quiz questions (Phase 5)
 *
 * Returns data in the same format as the hardcoded MATH_LESSONS object
 * to minimize changes to MathLessonPlayer.tsx
 */

// Types matching MathLessonPlayer.tsx
type MathVisualType = 'counting' | 'number_line' | 'fraction' | 'array' | 'place_value' | 'bar_model' | 'balance' | 'equation' | 'none';

interface MathProblem {
  question: string;
  answer: number | string;
  options?: (number | string)[];
  visualType: MathVisualType;
  visualData: any;
  explanation: string;
}

interface MathLesson {
  grade: number;
  topic: string;
  rule: string;
  ruleExplanation: string;
  visualType: MathVisualType;
  ruleVisualData: any;
  problems: MathProblem[];
}

interface UseMathLessonResult {
  lessons: MathLesson[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Default visual data for different skills
const DEFAULT_VISUALS: Record<string, { visualType: MathVisualType; visualData: any }> = {
  'MATH-R-COUNT': { visualType: 'counting', visualData: { emoji: '🍎', groups: [5], operation: 'count', show_equation: true } },
  'MATH-R-ADD': { visualType: 'counting', visualData: { emoji: '🍎', groups: [3, 2], operation: 'add', show_equation: true } },
  'MATH-R-SUB': { visualType: 'counting', visualData: { emoji: '🍎', groups: [5], subtract: 2, operation: 'subtract', show_equation: true } },
  'MATH-R-MULT': { visualType: 'array', visualData: { rows: 3, cols: 4, emoji: '⭐' } },
  'MATH-R-DIV': { visualType: 'array', visualData: { total: 12, groups: 3, emoji: '🍪' } },
  'MATH-R-FRAC': { visualType: 'fraction', visualData: { numerator: 1, denominator: 4, showPie: true } },
  'MATH-R-DEC': { visualType: 'place_value', visualData: { number: 12.5, showBlocks: true } },
  'MATH-R-PLACEVALUE': { visualType: 'place_value', visualData: { number: 234, showBlocks: true } },
  'MATH-R-ALGEBRA': { visualType: 'equation', visualData: { equation: 'x + 5 = 12', showSteps: true } },
  'default': { visualType: 'none', visualData: {} }
};

// Map visual_type from database to our enum
function mapVisualType(dbType: string | null): MathVisualType {
  if (!dbType) return 'none';
  const typeMap: Record<string, MathVisualType> = {
    'counting': 'counting',
    'number_line': 'number_line',
    'fraction': 'fraction',
    'array': 'array',
    'place_value': 'place_value',
    'bar_model': 'bar_model',
    'balance': 'balance',
    'equation': 'equation'
  };
  return typeMap[dbType.toLowerCase()] || 'none';
}

// Get skill code from rule_id (e.g., "MATH-R-MULT-G3" → "MATH-R-MULT")
function getSkillFromRuleId(ruleId: string): string {
  const match = ruleId.match(/^(MATH-R-[A-Z]+)/);
  return match ? match[1] : 'default';
}

export function useMathLesson(grade: number): UseMathLessonResult {
  const [lessons, setLessons] = useState<MathLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch rule teaching scripts for this grade
        const { data: rulesData, error: rulesError } = await supabase
          .from('rule_teaching_scripts')
          .select('*')
          .eq('subject', 'math')
          .eq('grade', grade)
          .order('rule_id');

        if (rulesError) {
          console.error('Error fetching rules:', rulesError);
          throw new Error(`Failed to fetch rules: ${rulesError.message}`);
        }

        if (!rulesData || rulesData.length === 0) {
          console.log(`No rules found for math grade ${grade}, returning empty`);
          setLessons([]);
          setLoading(false);
          return;
        }

        // 2. For each rule, fetch associated practice problems
        const lessonsWithProblems: MathLesson[] = [];

        for (const rule of rulesData) {
          // Fetch practice problems for this rule_id
          const { data: problemsData, error: problemsError } = await supabase
            .from('practice_problems')
            .select('*')
            .eq('rule_id', rule.rule_id)
            .eq('subject', 'math')
            .eq('grade', grade)
            .limit(10); // Limit to 10 problems per lesson

          if (problemsError) {
            console.error(`Error fetching problems for ${rule.rule_id}:`, problemsError);
            continue; // Skip this rule but continue with others
          }

          // Get default visual for this skill type
          const skillCode = getSkillFromRuleId(rule.rule_id);
          const defaultVisual = DEFAULT_VISUALS[skillCode] || DEFAULT_VISUALS['default'];

          // Transform problems to MathProblem format
          const problems: MathProblem[] = (problemsData || []).map(p => ({
            question: p.question,
            answer: isNaN(Number(p.answer)) ? p.answer : Number(p.answer),
            options: p.options ? (Array.isArray(p.options) ? p.options : JSON.parse(p.options)) : undefined,
            visualType: mapVisualType(p.visual_type) || defaultVisual.visualType,
            visualData: p.visual_data || defaultVisual.visualData,
            explanation: p.explanation || `The answer is ${p.answer}.`
          }));

          // Parse teaching_script and rule_card JSONs
          const teachingScript = typeof rule.teaching_script === 'string'
            ? JSON.parse(rule.teaching_script)
            : rule.teaching_script;

          const ruleCard = typeof rule.rule_card === 'string'
            ? JSON.parse(rule.rule_card)
            : rule.rule_card;

          // Build the lesson object
          const lesson: MathLesson = {
            grade: grade,
            topic: rule.rule_name || teachingScript?.title || 'Math Lesson',
            rule: ruleCard?.title || rule.rule_name || 'Math Rule',
            ruleExplanation: ruleCard?.explanation || teachingScript?.introduction || 'Learn this math concept!',
            visualType: defaultVisual.visualType,
            ruleVisualData: defaultVisual.visualData,
            problems: problems.length > 0 ? problems : generatePlaceholderProblems(grade, skillCode)
          };

          lessonsWithProblems.push(lesson);
        }

        console.log(`Loaded ${lessonsWithProblems.length} math lessons for grade ${grade} from database`);
        setLessons(lessonsWithProblems);

      } catch (err: any) {
        console.error('Error in useMathLesson:', err);
        setError(err.message || 'Failed to load lessons');
        setLessons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [grade, fetchTrigger]);

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return { lessons, loading, error, refetch };
}

// Generate placeholder problems if database has none (fallback)
function generatePlaceholderProblems(grade: number, skillCode: string): MathProblem[] {
  const defaultVisual = DEFAULT_VISUALS[skillCode] || DEFAULT_VISUALS['default'];

  // Simple placeholder based on grade level
  if (grade <= 2) {
    return [
      {
        question: '2 + 3 = ?',
        answer: 5,
        options: [4, 5, 6, 7],
        visualType: 'counting',
        visualData: { emoji: '🍎', groups: [2, 3], operation: 'add', show_equation: false },
        explanation: 'Count 2, then count 3 more. 2 + 3 = 5!'
      }
    ];
  }

  return [
    {
      question: '6 × 4 = ?',
      answer: 24,
      options: [20, 22, 24, 26],
      visualType: defaultVisual.visualType,
      visualData: defaultVisual.visualData,
      explanation: '6 groups of 4 equals 24.'
    }
  ];
}

export default useMathLesson;
