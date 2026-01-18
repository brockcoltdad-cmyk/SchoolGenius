'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * CODING LESSON DATA HOOK
 *
 * Fetches coding lessons from the seeded database tables:
 * - rule_teaching_scripts: Coding concepts and rules
 * - practice_problems: Coding challenges (blocks or Python)
 *
 * Returns data in the same format as the hardcoded CODING_LESSONS object
 * to minimize changes to CodingLessonPlayer.tsx
 */

type CodingMode = 'blocks' | 'python';

interface CodeBlock {
  id: string;
  type: 'action' | 'loop' | 'conditional' | 'variable' | 'output';
  text: string;
  color: string;
  icon: string;
}

interface BlockChallenge {
  instruction: string;
  availableBlocks: CodeBlock[];
  correctSequence: string[];
  hints: string[];
  output: string;
}

interface PythonChallenge {
  concept: string;
  instruction: string;
  starterCode: string;
  solution: string;
  expectedOutput: string;
  hints: string[];
  testCases?: { input: string; expected: string }[];
}

interface CodingLesson {
  id: string;
  grade: number;
  topic: string;
  mode: CodingMode;
  rule: string;
  ruleExplanation: string;
  demoCode: string;
  demoOutput: string;
  challenges: (BlockChallenge | PythonChallenge)[];
}

interface UseCodingLessonResult {
  lessons: CodingLesson[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCodingLesson(grade: number): UseCodingLessonResult {
  const [lessons, setLessons] = useState<CodingLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      setError(null);

      try {
        // Fetch rule teaching scripts for coding at this grade
        const { data: rulesData, error: rulesError } = await supabase
          .from('rule_teaching_scripts')
          .select('*')
          .eq('subject', 'coding')
          .eq('grade', grade)
          .order('rule_id');

        if (rulesError) {
          console.error('Error fetching coding rules:', rulesError);
          throw new Error(`Failed to fetch rules: ${rulesError.message}`);
        }

        if (!rulesData || rulesData.length === 0) {
          console.log(`No coding rules found for grade ${grade}, returning empty`);
          setLessons([]);
          setLoading(false);
          return;
        }

        // Determine mode based on grade
        const mode: CodingMode = grade <= 5 ? 'blocks' : 'python';

        const transformedLessons: CodingLesson[] = [];

        for (const rule of rulesData) {
          // Parse JSON fields
          const ruleCard = typeof rule.rule_card === 'string'
            ? JSON.parse(rule.rule_card)
            : rule.rule_card;

          const teachingScript = typeof rule.teaching_script === 'string'
            ? JSON.parse(rule.teaching_script)
            : rule.teaching_script;

          // Fetch challenges/problems for this rule
          const { data: challengesData } = await supabase
            .from('practice_problems')
            .select('*')
            .eq('rule_id', rule.rule_id)
            .eq('subject', 'coding')
            .eq('grade', grade)
            .limit(5);

          // Transform challenges based on mode
          const challenges: (BlockChallenge | PythonChallenge)[] = (challengesData || []).map(problem => {
            const tier1 = typeof problem.tier1 === 'string' ? JSON.parse(problem.tier1) : problem.tier1;
            const tier2 = typeof problem.tier2 === 'string' ? JSON.parse(problem.tier2) : problem.tier2;

            if (mode === 'blocks') {
              return {
                instruction: problem.question || 'Complete the challenge!',
                availableBlocks: tier1?.blocks || [
                  { id: 'action1', type: 'action', text: 'Move', color: 'bg-blue-500', icon: '➡️' }
                ],
                correctSequence: tier1?.sequence || ['action1'],
                hints: tier2?.hints || ['Think about the order!'],
                output: problem.answer || 'Success!'
              } as BlockChallenge;
            } else {
              return {
                concept: ruleCard?.title || 'Python Concept',
                instruction: problem.question || 'Write the code!',
                starterCode: tier1?.starter || '# Write your code here',
                solution: problem.answer || '',
                expectedOutput: tier1?.output || '',
                hints: tier2?.hints || ['Check the syntax!'],
                testCases: tier1?.testCases
              } as PythonChallenge;
            }
          });

          const lesson: CodingLesson = {
            id: rule.rule_id || `coding-${grade}-${transformedLessons.length}`,
            grade: grade,
            topic: ruleCard?.title || rule.rule_name || 'Coding Lesson',
            mode: mode,
            rule: ruleCard?.title || rule.rule_name || 'Coding Concept',
            ruleExplanation: ruleCard?.rule_text || ruleCard?.explanation ||
                            teachingScript?.intro || 'Learn this coding concept!',
            demoCode: teachingScript?.demo?.code || ruleCard?.examples?.[0] || '// Demo code',
            demoOutput: teachingScript?.demo?.output || 'Demo output',
            challenges: challenges.length > 0 ? challenges : [
              mode === 'blocks' ? {
                instruction: 'Complete the challenge!',
                availableBlocks: [
                  { id: 'move', type: 'action', text: 'Move', color: 'bg-blue-500', icon: '➡️' }
                ],
                correctSequence: ['move'],
                hints: ['Just try moving!'],
                output: 'You did it!'
              } as BlockChallenge : {
                concept: 'Basics',
                instruction: 'Print "Hello"',
                starterCode: 'print(',
                solution: 'print("Hello")',
                expectedOutput: 'Hello',
                hints: ['Use quotes around text']
              } as PythonChallenge
            ]
          };

          transformedLessons.push(lesson);
        }

        console.log(`✅ Loaded ${transformedLessons.length} coding lessons for grade ${grade} from database`);
        setLessons(transformedLessons);

      } catch (err: any) {
        console.error('Error in useCodingLesson:', err);
        setError(err.message || 'Failed to load coding lessons');
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

export default useCodingLesson;
