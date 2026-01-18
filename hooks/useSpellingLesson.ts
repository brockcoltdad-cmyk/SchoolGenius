'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * SPELLING LESSON DATA HOOK
 *
 * Fetches spelling lessons from the seeded database tables:
 * - rule_teaching_scripts: Phonics rules and explanations
 * - practice_problems: Word lists for practice
 *
 * Returns data in the same format as the hardcoded WORD_LISTS object
 * to minimize changes to SpellingLessonPlayer.tsx
 */

interface SpellingWordList {
  words: string[];
  rule: string;
  ruleExplanation: string;
}

interface UseSpellingLessonResult {
  wordLists: SpellingWordList[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSpellingLesson(grade: number): UseSpellingLessonResult {
  const [wordLists, setWordLists] = useState<SpellingWordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch rule teaching scripts for spelling at this grade
        const { data: rulesData, error: rulesError } = await supabase
          .from('rule_teaching_scripts')
          .select('*')
          .eq('subject', 'spelling')
          .eq('grade', grade)
          .order('rule_id');

        if (rulesError) {
          console.error('Error fetching spelling rules:', rulesError);
          throw new Error(`Failed to fetch rules: ${rulesError.message}`);
        }

        if (!rulesData || rulesData.length === 0) {
          console.log(`No spelling rules found for grade ${grade}, returning empty`);
          setWordLists([]);
          setLoading(false);
          return;
        }

        // 2. For each rule, fetch associated practice problems (words)
        const listsWithWords: SpellingWordList[] = [];

        for (const rule of rulesData) {
          // Fetch practice problems for this rule_id
          const { data: problemsData, error: problemsError } = await supabase
            .from('practice_problems')
            .select('*')
            .eq('rule_id', rule.rule_id)
            .eq('subject', 'spelling')
            .eq('grade', grade)
            .limit(20);

          if (problemsError) {
            console.error(`Error fetching words for ${rule.rule_id}:`, problemsError);
            continue;
          }

          // Parse rule card for explanation
          const ruleCard = typeof rule.rule_card === 'string'
            ? JSON.parse(rule.rule_card)
            : rule.rule_card;

          const teachingScript = typeof rule.teaching_script === 'string'
            ? JSON.parse(rule.teaching_script)
            : rule.teaching_script;

          // Extract words from problems - could be in question, answer, or audio_word field
          const words = (problemsData || [])
            .map(p => p.audio_word || p.answer || p.question)
            .filter(w => w && typeof w === 'string' && w.length > 0)
            .slice(0, 10); // Limit to 10 words per list

          if (words.length === 0) continue;

          const wordList: SpellingWordList = {
            words: words,
            rule: ruleCard?.title || rule.rule_name || 'Spelling Rule',
            ruleExplanation: ruleCard?.rule_text || ruleCard?.explanation ||
                            teachingScript?.intro || 'Learn these spelling words!'
          };

          listsWithWords.push(wordList);
        }

        console.log(`✅ Loaded ${listsWithWords.length} spelling word lists for grade ${grade} from database`);
        setWordLists(listsWithWords);

      } catch (err: any) {
        console.error('Error in useSpellingLesson:', err);
        setError(err.message || 'Failed to load spelling lessons');
        setWordLists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [grade, fetchTrigger]);

  const refetch = () => setFetchTrigger(prev => prev + 1);

  return { wordLists, loading, error, refetch };
}

export default useSpellingLesson;
