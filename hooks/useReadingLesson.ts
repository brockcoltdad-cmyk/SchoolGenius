'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * READING LESSON DATA HOOK
 *
 * Fetches reading lessons from the seeded database tables:
 * - rule_teaching_scripts: Reading comprehension strategies
 * - practice_problems: Stories with comprehension questions
 *
 * Returns data in the same format as the hardcoded STORIES_BY_GRADE object
 * to minimize changes to ReadingLessonPlayer.tsx
 */

interface ComprehensionQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  lexileLevel: number;
  gradeLevel: number;
  questions: ComprehensionQuestion[];
}

interface UseReadingLessonResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Lexile ranges by grade for filtering
const LEXILE_BY_GRADE: Record<number, { min: number; max: number }> = {
  0: { min: 0, max: 200 },
  1: { min: 200, max: 400 },
  2: { min: 300, max: 500 },
  3: { min: 400, max: 700 },
  4: { min: 500, max: 800 },
  5: { min: 600, max: 900 },
  6: { min: 700, max: 1000 },
  7: { min: 800, max: 1100 },
  8: { min: 900, max: 1500 },
};

export function useReadingLesson(grade: number): UseReadingLessonResult {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      setError(null);

      try {
        const lexileRange = LEXILE_BY_GRADE[Math.min(grade, 8)] || LEXILE_BY_GRADE[8];

        // Fetch practice problems that contain stories
        const { data: problemsData, error: problemsError } = await supabase
          .from('practice_problems')
          .select('*')
          .eq('subject', 'reading')
          .eq('grade', grade)
          .limit(20);

        if (problemsError) {
          console.error('Error fetching reading problems:', problemsError);
          throw new Error(`Failed to fetch stories: ${problemsError.message}`);
        }

        if (!problemsData || problemsData.length === 0) {
          console.log(`No reading content found for grade ${grade}, returning empty`);
          setStories([]);
          setLoading(false);
          return;
        }

        // Group problems by story/passage (using skill or rule_id as grouping key)
        const storyGroups = new Map<string, any[]>();

        for (const problem of problemsData) {
          const groupKey = problem.skill || problem.rule_id || problem.id;
          if (!storyGroups.has(groupKey)) {
            storyGroups.set(groupKey, []);
          }
          storyGroups.get(groupKey)!.push(problem);
        }

        // Transform grouped problems into Story format
        const transformedStories: Story[] = [];
        let storyIndex = 0;

        for (const [groupKey, problems] of Array.from(storyGroups)) {
          // Try to extract story content from tier1/tier2 or explanation
          const firstProblem = problems[0];
          const tier1 = typeof firstProblem.tier1 === 'string'
            ? JSON.parse(firstProblem.tier1)
            : firstProblem.tier1;

          // Extract content - might be in different fields
          const content = tier1?.passage || tier1?.story || tier1?.text ||
                         firstProblem.explanation ||
                         problems.map(p => p.question).join('\n\n');

          // Transform questions
          const questions: ComprehensionQuestion[] = problems.map(p => {
            const options = Array.isArray(p.options) ? p.options :
                           (p.options ? JSON.parse(p.options) : ['A', 'B', 'C', 'D']);

            return {
              question: p.question || 'What is the answer?',
              options: options,
              correctAnswer: p.answer || options[0],
              explanation: p.explanation || `The correct answer is ${p.answer}.`
            };
          });

          if (questions.length > 0) {
            transformedStories.push({
              id: `reading-${grade}-${storyIndex++}`,
              title: firstProblem.skill || `Story ${storyIndex}`,
              content: content || 'Read the passage and answer the questions.',
              lexileLevel: firstProblem.lexile_level || Math.round((lexileRange.min + lexileRange.max) / 2),
              gradeLevel: grade,
              questions: questions.slice(0, 10) // Max 10 questions per story
            });
          }
        }

        console.log(`✅ Loaded ${transformedStories.length} reading stories for grade ${grade} from database`);
        setStories(transformedStories);

      } catch (err: any) {
        console.error('Error in useReadingLesson:', err);
        setError(err.message || 'Failed to load reading lessons');
        setStories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [grade, fetchTrigger]);

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return { stories, loading, error, refetch };
}

export default useReadingLesson;
